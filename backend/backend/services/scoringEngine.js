const pool = require('../db/pool');

/**
 * Compute branch match scores for a student based on their topic-wise marks.
 *
 * @param {Array<{subject:string, topic_name:string, marks_obtained:number, max_marks:number}>} topicScores
 * @param {Array<{question_id:string, branch_boost:string, boost_amount:number}>} [aptitudeBoosts]
 * @returns {Promise<Array<{branch:string, score:number}>>} sorted descending by score
 */
async function computeBranchScores(topicScores, aptitudeBoosts = []) {
  if (!topicScores || topicScores.length === 0) {
    throw new Error('No topic scores provided');
  }

  // Pull every weight row that matches a topic the student actually submitted.
  const topicNames = [...new Set(topicScores.map((t) => t.topic_name))];
  const { rows: weightRows } = await pool.query(
    `SELECT branch, topic_name, weight
     FROM branch_topic_weights
     WHERE topic_name = ANY($1::text[])`,
    [topicNames]
  );

  if (weightRows.length === 0) {
    throw new Error(
      'No branch weight data found for the submitted topics. Check branch_topic_weights table.'
    );
  }

  // Group weights by branch: { CSE: [{topic_name, weight}, ...], ECE: [...] }
  const weightsByBranch = {};
  for (const row of weightRows) {
    if (!weightsByBranch[row.branch]) weightsByBranch[row.branch] = [];
    weightsByBranch[row.branch].push({ topic_name: row.topic_name, weight: Number(row.weight) });
  }

  // Build a quick lookup: topic_name -> percentage the student scored
  const percentageByTopic = {};
  for (const t of topicScores) {
    const pct = (Number(t.marks_obtained) / Number(t.max_marks)) * 100;
    percentageByTopic[t.topic_name] = pct;
  }

  const results = [];

  for (const [branch, weights] of Object.entries(weightsByBranch)) {
    let weightedSum = 0;
    let totalWeight = 0;

    for (const { topic_name, weight } of weights) {
      const pct = percentageByTopic[topic_name];
      if (pct === undefined) continue; // student didn't submit this topic
      weightedSum += pct * weight;
      totalWeight += weight;
    }

    if (totalWeight === 0) continue; // no overlap between student topics and this branch

    let normalisedScore = weightedSum / totalWeight;

    // Apply optional aptitude quiz nudges (small, capped boost)
    const boost = aptitudeBoosts
      .filter((b) => b.branch_boost === branch)
      .reduce((sum, b) => sum + Number(b.boost_amount || 0), 0);

    normalisedScore = Math.min(100, normalisedScore + boost);

    results.push({ branch, score: Number(normalisedScore.toFixed(2)) });
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}

module.exports = { computeBranchScores };

const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { computeBranchScores } = require('../services/scoringEngine');
const { generateExplanation } = require('../services/aiExplanation');

// GET /api/recommend/:student_id
router.get('/:student_id', async (req, res) => {
  const { student_id } = req.params;

  try {
    const { rows: topicScores } = await pool.query(
      `SELECT subject, topic_name, marks_obtained, max_marks
       FROM topic_scores WHERE student_id = $1`,
      [student_id]
    );

    if (topicScores.length === 0) {
      return res.status(404).json({ error: 'No scores found for this student. Submit scores first.' });
    }

    const { rows: aptitudeBoosts } = await pool.query(
      `SELECT question_id, branch_boost, boost_amount
       FROM aptitude_responses WHERE student_id = $1`,
      [student_id]
    );

    const allScores = await computeBranchScores(topicScores, aptitudeBoosts);
    const top3 = allScores.slice(0, 3);

    let aiSummary = '';
    try {
      aiSummary = await generateExplanation(topicScores, top3);
    } catch (aiErr) {
      console.error('AI explanation failed, continuing without it:', aiErr.message);
      aiSummary = 'AI explanation unavailable right now — your scores above are still accurate.';
    }

    await pool.query(
      `INSERT INTO recommendations
        (student_id, branch_1, branch_1_score, branch_2, branch_2_score, branch_3, branch_3_score, full_scores, ai_explanation)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        student_id,
        top3[0]?.branch, top3[0]?.score,
        top3[1]?.branch, top3[1]?.score,
        top3[2]?.branch, top3[2]?.score,
        JSON.stringify(allScores),
        aiSummary,
      ]
    );

    res.json({
      branches: top3.map((b) => ({ name: b.branch, score: b.score })),
      all_scores: allScores,
      ai_summary: aiSummary,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to generate recommendation' });
  }
});

module.exports = router;

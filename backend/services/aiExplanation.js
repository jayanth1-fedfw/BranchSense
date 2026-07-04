const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * Generate a personalised explanation of the student's branch recommendations.
 *
 * @param {Array<{subject:string, topic_name:string, marks_obtained:number, max_marks:number}>} topicScores
 * @param {Array<{branch:string, score:number}>} topBranches - top 3, sorted descending
 * @returns {Promise<string>}
 */
async function generateExplanation(topicScores, topBranches) {
  const [b1, b2, b3] = topBranches;

  const scoresSummary = topicScores
    .map((t) => `${t.topic_name}: ${t.marks_obtained}/${t.max_marks}`)
    .join(', ');

  const prompt = `A student scored the following in their intermediate topics: ${scoresSummary}

The BranchSense algorithm recommends:
1. ${b1.branch} — ${b1.score}% match
${b2 ? `2. ${b2.branch} — ${b2.score}% match` : ''}
${b3 ? `3. ${b3.branch} — ${b3.score}% match` : ''}

Write a personalised 3-paragraph explanation:
- Para 1: Why branch 1 suits them (cite their specific strong topics)
- Para 2: What they should strengthen before joining
- Para 3: Career outlook for their top branch in India by 2030

Keep it motivating, specific, and under 200 words. Do not use markdown headers, just plain paragraphs.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = message.content.find((block) => block.type === 'text');
  return textBlock ? textBlock.text : '';
}

module.exports = { generateExplanation };

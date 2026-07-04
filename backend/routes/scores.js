const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// POST /api/scores/submit
// Body: { student_id, scores: [ { subject, topic, marks, max } ] }
router.post('/submit', async (req, res) => {
  const { student_id, scores } = req.body;

  if (!student_id || !Array.isArray(scores) || scores.length === 0) {
    return res.status(400).json({ error: 'student_id and a non-empty scores array are required' });
  }

  // Validate: marks entered <= max marks, both numeric and non-negative
  for (const s of scores) {
    if (!s.subject || !s.topic || s.marks == null || s.max == null) {
      return res.status(400).json({ error: 'Each score needs subject, topic, marks, and max' });
    }
    if (Number(s.marks) < 0 || Number(s.max) <= 0 || Number(s.marks) > Number(s.max)) {
      return res.status(400).json({
        error: `Invalid marks for topic "${s.topic}": marks must be between 0 and max`,
      });
    }
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const s of scores) {
      await client.query(
        `INSERT INTO topic_scores (student_id, subject, topic_name, marks_obtained, max_marks)
         VALUES ($1, $2, $3, $4, $5)`,
        [student_id, s.subject, s.topic, s.marks, s.max]
      );
    }
    await client.query('COMMIT');
    res.json({ submitted: true, count: scores.length });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Submit scores failed:', err);
    res.status(500).json({ error: `Failed to submit scores: ${err.message}` });
  } finally {
    client.release();
  }
});

module.exports = router;
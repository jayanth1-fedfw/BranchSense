const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET /api/topics
// Returns all topics grouped by subject, e.g.
// { topics_by_subject: { MATHS: [...], PHYSICS: [...], CHEMISTRY: [...], BIOLOGY: [...] } }
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT subject, topic_name FROM topics ORDER BY subject, topic_name`
    );

    const topics_by_subject = {};
    for (const row of rows) {
      if (!topics_by_subject[row.subject]) topics_by_subject[row.subject] = [];
      topics_by_subject[row.subject].push(row.topic_name);
    }

    res.json({ topics_by_subject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET /api/branches
// Returns list of all branches and the topics they value, sorted by weight desc
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT branch, topic_name, weight FROM branch_topic_weights ORDER BY branch, weight DESC`
    );

    const branchMap = {};
    for (const row of rows) {
      if (!branchMap[row.branch]) branchMap[row.branch] = [];
      branchMap[row.branch].push({ topic: row.topic_name, weight: Number(row.weight) });
    }

    const branches = Object.entries(branchMap).map(([branch, topics]) => ({ branch, topics }));
    res.json({ branches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch branches' });
  }
});

module.exports = router;

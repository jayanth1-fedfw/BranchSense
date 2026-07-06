const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// POST /api/student/register
router.post('/register', async (req, res) => {
  const { name, board, year, stream } = req.body;

  if (!name || !board || !year || !stream) {
    return res.status(400).json({ error: 'name, board, year, and stream are all required' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO students (name, board, year_passed, stream)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [name, board, year, stream]
    );
    res.status(201).json({ student_id: rows[0].id });
  } catch (err) {
    console.error('Register student failed:', err);
    // Surface the real Postgres error message so the frontend/browser shows
    // the actual cause (e.g. "relation students does not exist", "connect ECONNREFUSED",
    // "password authentication failed") instead of a generic message.
    res.status(500).json({ error: `Failed to register student: ${err.message}` });
  }
});

// GET /api/student/:student_id/history
router.get('/:student_id/history', async (req, res) => {
  const { student_id } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT * FROM recommendations WHERE student_id = $1 ORDER BY generated_at DESC`,
      [student_id]
    );
    res.json({ history: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET /api/health/db
// Hits the database directly so you can tell "backend is up" apart from
// "backend can't reach the database" — the two most common deploy issues.
router.get('/db', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW() as server_time');
    const { rows: tableCheck } = await pool.query(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name = 'students'`
    );
    res.json({
      db_connected: true,
      server_time: rows[0].server_time,
      students_table_exists: tableCheck.length > 0,
    });
  } catch (err) {
    console.error('DB health check failed:', err);
    res.status(500).json({
      db_connected: false,
      error: err.message,
      hint: 'Check DATABASE_URL in your Render environment variables, and confirm schema.sql was run on the same Supabase project this URL points to.',
    });
  }
});

module.exports = router;
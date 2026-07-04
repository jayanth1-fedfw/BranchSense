const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const studentsRouter = require('./routes/students');
const scoresRouter = require('./routes/scores');
const recommendRouter = require('./routes/recommend');
const branchesRouter = require('./routes/branches');
const pool = require('./db/pool');

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allows your frontend (Vercel/Render static site) to call this API
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

// ── DATABASE INIT ─────────────────────────────────────────────────────────────
async function initializeDatabase() {
  try {
    const schemaPath = path.join(__dirname, 'db', 'schema.sql');
    const seedPath   = path.join(__dirname, 'db', 'seed_weights.sql');

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const seedSql   = fs.readFileSync(seedPath, 'utf8');

    const tablesCheck = await pool.query(`
      SELECT COUNT(*) as cnt 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    const tablesExist = parseInt(tablesCheck.rows[0].cnt, 10) > 0;

    if (!tablesExist) {
      await pool.query(schemaSql);
      console.log('✓ Database schema initialized');
      await pool.query(seedSql);
      console.log('✓ Database seeded with weights');
    } else {
      console.log('✓ Database already initialized');
    }
  } catch (error) {
    const message = error?.message?.trim();
    if (message && !message.includes('already exists')) {
      console.warn('⚠ Database initialization note:', message);
    }
  }
}

// ── ROOT ROUTE (fixes "Cannot GET /") ────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    app: 'BranchSense API',
    status: 'running ✅',
    version: '1.0.0',
    endpoints: {
      health:     'GET  /health',
      register:   'POST /api/student/register',
      scores:     'POST /api/scores/submit',
      recommend:  'GET  /api/recommend/:student_id',
      branches:   'GET  /api/branches',
    },
  });
});

// ── HEALTH CHECK ──────────────────────────────────────────────────────────────
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'healthy', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', db: 'disconnected', error: err.message });
  }
});

// ── API ROUTES ────────────────────────────────────────────────────────────────
app.use('/api/student',   studentsRouter);
app.use('/api/scores',    scoresRouter);
app.use('/api/recommend', recommendRouter);
app.use('/api/branches',  branchesRouter);

// ── 404 HANDLER ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── GLOBAL ERROR HANDLER ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Something went wrong on the server', message: err.message });
});

// ── START ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;

initializeDatabase()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ BranchSense backend running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });
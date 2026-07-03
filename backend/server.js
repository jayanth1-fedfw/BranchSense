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

// Initialize database on startup
async function initializeDatabase() {
  try {
    console.log('Checking database initialization...');
    const schemaPath = path.join(__dirname, 'db', 'schema.sql');
    const seedPath = path.join(__dirname, 'db', 'seed_weights.sql');

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    await pool.query(schemaSql);
    console.log('Database schema initialized');

    await pool.query(seedSql);
    console.log('Database seeded');
  } catch (error) {
    console.error('Database initialization warning:', error.message);
    // Don't crash - database might already be initialized
  }
}

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/student', studentsRouter);
app.use('/api/scores', scoresRouter);
app.use('/api/recommend', recommendRouter);
app.use('/api/branches', branchesRouter);

// Central error handler as a safety net
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

const PORT = process.env.PORT || 4000;

// Initialize database and then start server
initializeDatabase().then(() => {
  app.listen(PORT, () => console.log(`BranchSense backend running on port ${PORT}`));
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

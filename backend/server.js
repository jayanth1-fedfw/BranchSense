const express = require('express');
const cors = require('cors');
require('dotenv').config();

const studentsRouter = require('./routes/students');
const scoresRouter = require('./routes/scores');
const recommendRouter = require('./routes/recommend');
const branchesRouter = require('./routes/branches');

const app = express();

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
app.listen(PORT, () => console.log(`BranchSense backend running on port ${PORT}`));

const fs = require('fs');
const path = require('path');
const pool = require('../db/pool');

async function run() {
  const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
  const seedPath = path.join(__dirname, '..', 'db', 'seed_weights.sql');

  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  const seedSql = fs.readFileSync(seedPath, 'utf8');

  await pool.query(schemaSql);
  await pool.query(seedSql);

  await pool.end();
}

run().catch((error) => {
  console.error('Database setup failed:', error);
  process.exit(1);
});

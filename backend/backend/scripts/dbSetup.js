const fs = require('fs');
const path = require('path');
const pool = require('../db/pool');

async function run() {
  try {
    const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
    const seedPath = path.join(__dirname, '..', 'db', 'seed_weights.sql');

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log('Running database schema setup...');
    await pool.query(schemaSql);
    console.log('Schema setup complete');

    console.log('Seeding database...');
    await pool.query(seedSql);
    console.log('Database seeding complete');

    await pool.end();
    console.log('Database setup successful');
  } catch (error) {
    console.error('Database setup failed:', error.message);
    // Don't exit with error - allow deployment to continue
    // The database might initialize on first request
    process.exit(0);
  }
}

run();

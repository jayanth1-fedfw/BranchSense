const pool = require('./db/pool');
require('dotenv').config();

async function testDatabaseConnectivity() {
  console.log('\n=== DATABASE CONNECTIVITY TEST ===\n');
  
  console.log('Environment Variables:');
  console.log(`- DATABASE_URL: ${process.env.DATABASE_URL ? '✓ Set' : '✗ Not set'}`);
  console.log(`- ANTHROPIC_API_KEY: ${process.env.ANTHROPIC_API_KEY ? '✓ Set' : '✗ Not set'}`);
  console.log(`- PORT: ${process.env.PORT || '4000'}\n`);

  try {
    console.log('Testing database connection...');
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Database connection successful');
    console.log(`  Server time: ${result.rows[0].now}\n`);

    // Check if tables exist
    console.log('Checking database schema:');
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tables.rows.length === 0) {
      console.log('✗ No tables found in database');
      console.log('  → Database needs to be initialized');
    } else {
      console.log(`✓ Found ${tables.rows.length} tables:`);
      tables.rows.forEach(t => {
        console.log(`  - ${t.table_name}`);
      });
    }

    // Check row counts in key tables
    console.log('\nTable row counts:');
    const tableNames = ['students', 'topic_scores', 'branch_topic_weights', 'recommendations'];
    
    for (const table of tableNames) {
      try {
        const count = await pool.query(`SELECT COUNT(*) as cnt FROM ${table}`);
        console.log(`  ${table}: ${count.rows[0].cnt} rows`);
      } catch (e) {
        console.log(`  ${table}: ✗ Table not found`);
      }
    }

  } catch (err) {
    console.error('✗ Database connection failed:');
    console.error(`  Error: ${err.message}`);
    console.error(`  Code: ${err.code}`);
    if (err.code === 'ENOENT') {
      console.error('  → DATABASE_URL environment variable may be incorrect');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('  → Database server is not running or unreachable');
    }
  } finally {
    await pool.end();
    process.exit(0);
  }
}

testDatabaseConnectivity();

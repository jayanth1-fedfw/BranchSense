const https = require('https'); // ← was http, must be https for onrender.com

const BASE_URL = 'https://branchsense.onrender.com';

async function makeRequest(method, urlPath, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: 443,              // ← was 4000, must be 443 for HTTPS
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 10000,         // ← increased to 10s (Render free tier is slow to wake)
    };

    const startTime = process.hrtime.bigint();

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const endTime = process.hrtime.bigint();
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
          durationMs: Number(endTime - startTime) / 1_000_000,
          timestamp: new Date(),
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout (10s) — Render free tier may be sleeping, try again'));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function testAPIEndpoints() {
  console.log('\n=== BRANCHSENSE API CONNECTIVITY TEST ===\n');
  console.log(`Backend URL: ${BASE_URL}\n`);

  const tests = [
    {
      name: 'Health Check',
      method: 'GET',
      path: '/health',
      expectedStatus: 200,
    },
    {
      name: 'Get Branches',
      method: 'GET',
      path: '/api/branches',
      expectedStatus: 200,
    },
    {
      name: 'Register Student',
      method: 'POST',
      path: '/api/student/register',
      body: {
        name: 'Test Student',
        board: 'CBSE',
        year_passed: 2025,   // ← was "year", your DB column is year_passed
        stream: 'MPC',
      },
      expectedStatus: 201,
    },
    {
      name: 'Root Route',
      method: 'GET',
      path: '/',
      expectedStatus: 200,
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    console.log(`▶ ${test.name}`);
    console.log(`  ${test.method} ${BASE_URL}${test.path}`);

    try {
      const response = await makeRequest(test.method, test.path, test.body);
      const isSuccess = response.status === test.expectedStatus;

      if (isSuccess) {
        passed++;
        console.log(`  ✓ Status: ${response.status} — OK`);
      } else {
        failed++;
        console.log(`  ✗ Status: ${response.status} (expected ${test.expectedStatus})`);
      }

      console.log(`  ⏱ Response time: ${response.durationMs.toFixed(2)}ms`);

      try {
        const json = JSON.parse(response.body);
        const preview = JSON.stringify(json).substring(0, 120);
        console.log(`  📦 Response: ${preview}${preview.length >= 120 ? '...' : ''}`);

        // Extra diagnostics for failed registration
        if (test.name === 'Register Student' && !isSuccess) {
          console.log(`  ⚠ Full error: ${JSON.stringify(json)}`);
        }
      } catch {
        console.log(`  📦 Response: ${response.body.substring(0, 120)}`);
      }

    } catch (err) {
      failed++;
      console.log(`  ✗ Network Error: ${err.message}`);

      if (err.message.includes('sleeping') || err.message.includes('timeout')) {
        console.log(`  💡 Tip: Open ${BASE_URL}/health in your browser first to wake the server, then re-run this test.`);
      }
    }

    console.log('');
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('==========================================');
  console.log(`Results: ${passed} passed, ${failed} failed out of ${tests.length} tests`);

  if (failed === 0) {
    console.log('🎉 All tests passed — backend is fully working!');
  } else {
    console.log('\n💡 Next steps:');
    console.log('  1. Check Render backend logs for error details');
    console.log('  2. Verify DATABASE_URL is set in Render environment variables');
    console.log(`  3. Visit ${BASE_URL}/health in browser to confirm server is awake`);
  }

  process.exit(failed > 0 ? 1 : 0);
}

setTimeout(testAPIEndpoints, 1000);
const http = require('http');

const BASE_URL = 'http://localhost:4000';

async function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 4000,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const startTime = process.hrtime.bigint();
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
          timestamp: new Date(),
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout (5s)'));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function testAPIEndpoints() {
  console.log('\n=== API PERFORMANCE & CONNECTIVITY TEST ===\n');
  console.log(`Testing API at: ${BASE_URL}\n`);

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
        year: 2025,
        stream: 'MPC',
      },
      expectedStatus: 201,
    },
  ];

  for (const test of tests) {
    console.log(`Testing: ${test.name}`);
    console.log(`  ${test.method} ${test.path}`);
    
    const startTime = process.hrtime.bigint();
    try {
      const response = await makeRequest(test.method, test.path, test.body);
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1_000_000; // Convert to ms

      const isSuccess = response.status === test.expectedStatus;
      const statusIcon = isSuccess ? '✓' : '✗';
      console.log(`  ${statusIcon} Status: ${response.status} (expected ${test.expectedStatus})`);
      console.log(`  ⏱ Response time: ${duration.toFixed(2)}ms`);

      try {
        const json = JSON.parse(response.body);
        console.log(`  Response: ${JSON.stringify(json).substring(0, 100)}...`);
      } catch (e) {
        console.log(`  Response: ${response.body.substring(0, 100)}`);
      }
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`);
    }
    console.log('');
  }

  process.exit(0);
}

// Wait a moment for the server to start, then test
setTimeout(testAPIEndpoints, 1000);

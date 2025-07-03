// Test script for local verification
const http = require('http');

console.log('Testing PromptForge MCP server locally...\n');

// Test function
function testEndpoint(method, expectedStatus = 200) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      jsonrpc: '2.0',
      method: method,
      params: {},
      id: 1
    });

    const options = {
      hostname: 'localhost',
      port: 8000,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        console.log(`✓ ${method} - Status: ${res.statusCode}`);
        console.log(`  Response: ${body}\n`);
        resolve({ status: res.statusCode, body });
      });
    });

    req.on('error', (error) => {
      console.error(`✗ ${method} - Error: ${error.message}`);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Run tests
async function runTests() {
  try {
    // Test tools/list
    await testEndpoint('tools/list');
    
    // Test initialize (some MCP clients use this)
    await testEndpoint('initialize');
    
    // Test unknown method
    await testEndpoint('unknown/method');
    
    console.log('All tests completed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Wait a bit for server to start, then run tests
setTimeout(runTests, 2000);
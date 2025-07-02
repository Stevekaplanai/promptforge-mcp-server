// test.js - Simple test script for PromptForge
import http from 'http';

const testTools = async () => {
  const tests = [
    {
      name: 'Test optimize_prompt',
      payload: {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'optimize_prompt',
          arguments: {
            prompt: 'Write a function to sort numbers',
            domain: 'coding',
            desiredFormat: 'detailed'
          }
        },
        id: 1
      }
    },
    {
      name: 'Test manage_patterns',
      payload: {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'manage_patterns',
          arguments: {
            action: 'get',
            domain: 'coding'          }
        },
        id: 2
      }
    }
  ];

  for (const test of tests) {
    console.log(`\nRunning: ${test.name}`);
    
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('Response:', data);
      });
    });

    req.on('error', (e) => {
      console.error(`Problem with request: ${e.message}`);
    });

    req.write(JSON.stringify(test.payload));
    req.end();
  }
};

testTools();
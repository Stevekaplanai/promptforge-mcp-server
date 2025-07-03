// Ultra-minimal Smithery MCP Server
const http = require('http');

// Tool definitions
const tools = [
  {
    name: 'optimize_prompt',
    description: 'Analyzes and enhances a user prompt',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string' }
      },
      required: ['prompt']
    }
  }
];

// Create server
const server = http.createServer((req, res) => {
  // Always return JSON
  res.setHeader('Content-Type', 'application/json');
  
  // Handle GET requests (health check)
  if (req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }
  
  // Handle POST requests (JSON-RPC)
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const request = JSON.parse(body);
        
        // Always respond with tools for any method
        const response = {
          jsonrpc: '2.0',
          result: { tools },
          id: request.id
        };
        
        res.writeHead(200);
        res.end(JSON.stringify(response));
      } catch (e) {
        res.writeHead(200);
        res.end(JSON.stringify({
          jsonrpc: '2.0',
          error: { code: -32700, message: 'Parse error' },
          id: null
        }));
      }
    });
    return;
  }
  
  // Other methods
  res.writeHead(405);
  res.end();
});

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
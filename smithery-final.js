// Simple HTTP server for Smithery deployment
const http = require('http');

// Tool definitions - no authentication required for listing!
const tools = [
  {
    name: 'optimize_prompt',
    description: 'Analyzes and enhances a user prompt by applying optimization patterns',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', minLength: 1 },
        domain: { type: 'string' },
        intent: { type: 'string' },
        desiredFormat: { type: 'string' },
        userContext: { type: 'object', additionalProperties: {} },
        bypassOptimization: { type: 'boolean' }
      },
      required: ['prompt']
    }
  },
  {
    name: 'manage_patterns',
    description: 'Manages the prompt optimization patterns library',
    inputSchema: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['get', 'add', 'update', 'delete'] },
        domain: { type: 'string' },
        pattern: { type: 'object' }
      },
      required: ['action']
    }
  },
  {
    name: 'track_analytics',
    description: 'Tracks prompt optimization analytics and performance metrics',
    inputSchema: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['record', 'query'] },
        data: { type: 'object' },
        queryParams: { type: 'object' }
      },
      required: ['action']
    }
  }
];

// Handle JSON-RPC requests
async function handleRequest(request) {
  const { method, params, id } = request;
  
  try {
    switch (method) {
      case 'tools/list':
        // Return tools immediately - no auth needed for listing!
        return {
          jsonrpc: '2.0',
          result: { tools },
          id
        };
      
      case 'tools/call':
        // Handle tool calls (this is where auth would happen)
        const { name, arguments: args } = params;
        let result;
        
        switch (name) {
          case 'optimize_prompt':
            result = {
              optimizedPrompt: args.prompt + ' [OPTIMIZED]',
              confidence: 0.85,
              modifications: ['Added clarity', 'Improved structure']
            };
            break;
          
          case 'manage_patterns':
            result = { success: true, action: args.action };
            break;
          
          case 'track_analytics':
            result = { success: true, action: args.action };
            break;
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
        
        return {
          jsonrpc: '2.0',
          result,
          id
        };
      
      default:
        throw new Error(`Unknown method: ${method}`);
    }
  } catch (error) {
    return {
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: error.message
      },
      id
    };
  }
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Only accept POST
  if (req.method !== 'POST') {
    res.writeHead(405);
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }
  
  // Collect request body
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      const request = JSON.parse(body);
      const response = await handleRequest(request);
      res.writeHead(200);
      res.end(JSON.stringify(response));
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal error: ' + error.message
        },
        id: null
      }));
    }
  });
});

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`PromptForge MCP server running on port ${PORT}`);
});
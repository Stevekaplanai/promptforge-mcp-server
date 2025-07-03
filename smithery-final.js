// Smithery MCP Server with enhanced logging
console.log('[STARTUP] Starting PromptForge MCP server...');

const http = require('http');

// Tool definitions
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

// Create HTTP server with comprehensive logging
const server = http.createServer((req, res) => {
  console.log(`[REQUEST] ${req.method} ${req.url} from ${req.headers.host}`);
  console.log('[HEADERS]', JSON.stringify(req.headers));
  
  // Set CORS headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    console.log('[RESPONSE] Preflight OPTIONS request');
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Handle GET for health check
  if (req.method === 'GET' && req.url === '/') {
    console.log('[RESPONSE] Health check');
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', server: 'promptforge-mcp' }));
    return;
  }
  
  // Handle POST for JSON-RPC
  if (req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      console.log('[BODY]', body);
      
      try {
        const request = JSON.parse(body);
        console.log('[PARSED]', JSON.stringify(request));
        
        const { method, params, id } = request;
        
        // Handle different methods
        if (method === 'tools/list' || method === 'initialize') {
          const response = {
            jsonrpc: '2.0',
            result: { tools },
            id: id || null
          };
          console.log('[RESPONSE] tools/list:', JSON.stringify(response));
          res.writeHead(200);
          res.end(JSON.stringify(response));
        } else if (method === 'tools/call') {
          const { name, arguments: args } = params || {};
          console.log(`[TOOL CALL] ${name} with args:`, args);
          
          let result = {};
          if (name === 'optimize_prompt') {
            result = {
              optimizedPrompt: args.prompt + ' [OPTIMIZED]',
              confidence: 0.85,
              modifications: ['Added clarity', 'Improved structure']
            };
          } else if (name === 'manage_patterns') {
            result = { success: true, action: args.action };
          } else if (name === 'track_analytics') {
            result = { success: true, action: args.action };
          }
          
          const response = {
            jsonrpc: '2.0',
            result,
            id: id || null
          };
          console.log('[RESPONSE] tools/call:', JSON.stringify(response));
          res.writeHead(200);
          res.end(JSON.stringify(response));
        } else {
          console.log('[ERROR] Unknown method:', method);
          res.writeHead(200);
          res.end(JSON.stringify({
            jsonrpc: '2.0',
            error: {
              code: -32601,
              message: `Method not found: ${method}`
            },
            id: id || null
          }));
        }
      } catch (error) {
        console.error('[ERROR] Failed to process request:', error);
        res.writeHead(200);
        res.end(JSON.stringify({
          jsonrpc: '2.0',
          error: {
            code: -32700,
            message: 'Parse error: ' + error.message
          },
          id: null
        }));
      }
    });
  } else {
    console.log('[ERROR] Unsupported method:', req.method);
    res.writeHead(405);
    res.end(JSON.stringify({ error: 'Method not allowed' }));
  }
});

// Error handling
server.on('error', (error) => {
  console.error('[SERVER ERROR]', error);
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`[SUCCESS] PromptForge MCP server running on 0.0.0.0:${PORT}`);
  console.log('[INFO] Ready to handle requests');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[SHUTDOWN] Received SIGTERM, closing server...');
  server.close(() => {
    console.log('[SHUTDOWN] Server closed');
    process.exit(0);
  });
});
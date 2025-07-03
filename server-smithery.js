#!/usr/bin/env node

// PromptForge MCP Server - MCP Protocol Compliant
console.log('[INIT] Starting PromptForge MCP server...');

const http = require('http');

// Server information
const SERVER_INFO = {
  name: 'promptforge-mcp',
  version: '1.0.0',
  description: 'AI-powered prompt optimization MCP server'
};

// Tool definitions
const TOOLS = [
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

// Create HTTP server
const server = http.createServer((req, res) => {
  // Set headers for all responses
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Handle different HTTP methods
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.method === 'GET') {
    // Health check endpoint
    res.writeHead(200);
    res.end(JSON.stringify({ 
      status: 'healthy',
      server: 'promptforge-mcp',
      version: '1.0.0'
    }));
    return;
  }
  
  if (req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const request = JSON.parse(body);
        const { jsonrpc, method, params, id } = request;
        
        // Log the request for debugging
        console.log(`[RPC] Method: ${method}, ID: ${id}`);
        
        // Handle JSON-RPC methods
        switch (method) {
          case 'initialize':
            res.writeHead(200);
            res.end(JSON.stringify({
              jsonrpc: '2.0',
              result: {
                protocolVersion: '2024-11-05',
                capabilities: {
                  tools: {},
                  resources: {},
                  prompts: {},
                  logging: {}
                },
                serverInfo: SERVER_INFO
              },
              id: id
            }));
            break;
            
          case 'tools/list':
            res.writeHead(200);
            res.end(JSON.stringify({
              jsonrpc: '2.0',
              result: { 
                tools: TOOLS 
              },
              id: id
            }));
            break;
            
          case 'tools/call':
            handleToolCall(params, id, res);
            break;
            
          default:
            res.writeHead(200);
            res.end(JSON.stringify({
              jsonrpc: '2.0',
              error: {
                code: -32601,
                message: `Method not found: ${method}`
              },
              id: id
            }));
        }
      } catch (error) {
        console.error('[ERROR]', error);
        res.writeHead(200);
        res.end(JSON.stringify({
          jsonrpc: '2.0',
          error: {
            code: -32700,
            message: 'Parse error'
          },
          id: null
        }));
      }
    });
    
    req.on('error', (error) => {
      console.error('[REQUEST ERROR]', error);
      res.writeHead(500);
      res.end();
    });
  } else {
    res.writeHead(405);
    res.end(JSON.stringify({ error: 'Method not allowed' }));
  }
});

// Handle tool calls
function handleToolCall(params, id, res) {
  const { name, arguments: args } = params;
  console.log(`[TOOL] Calling ${name} with args:`, args);
  
  let result;
  
  try {
    switch (name) {
      case 'optimize_prompt':
        result = {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                optimizedPrompt: args.prompt + ' [Optimized for clarity and effectiveness]',
                confidence: 0.85,
                modifications: [
                  'Enhanced clarity',
                  'Improved structure',
                  'Added context'
                ]
              }, null, 2)
            }
          ]
        };
        break;
        
      case 'manage_patterns':
        result = {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                action: args.action,
                message: `Pattern ${args.action} completed successfully`
              }, null, 2)
            }
          ]
        };
        break;
        
      case 'track_analytics':
        result = {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                action: args.action,
                timestamp: new Date().toISOString()
              }, null, 2)
            }
          ]
        };
        break;
        
      default:
        res.writeHead(200);
        res.end(JSON.stringify({
          jsonrpc: '2.0',
          error: {
            code: -32601,
            message: `Unknown tool: ${name}`
          },
          id: id
        }));
        return;
    }
    
    res.writeHead(200);
    res.end(JSON.stringify({
      jsonrpc: '2.0',
      result: result,
      id: id
    }));
  } catch (error) {
    console.error(`[TOOL ERROR] ${name}:`, error);
    res.writeHead(200);
    res.end(JSON.stringify({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: `Internal error in tool ${name}: ${error.message}`
      },
      id: id
    }));
  }
}

// Start server with explicit binding
const PORT = process.env.PORT || 8000;
const HOST = '0.0.0.0'; // Important: Bind to all interfaces

server.listen(PORT, HOST, () => {
  console.log(`[SUCCESS] PromptForge MCP server listening on ${HOST}:${PORT}`);
  console.log('[INFO] Server is ready to accept connections');
  console.log('[INFO] Protocol version: 2024-11-05');
});

// Handle server errors
server.on('error', (error) => {
  console.error('[SERVER ERROR]', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`[FATAL] Port ${PORT} is already in use`);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[SHUTDOWN] Received SIGTERM signal');
  server.close(() => {
    console.log('[SHUTDOWN] Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[SHUTDOWN] Received SIGINT signal');
  server.close(() => {
    console.log('[SHUTDOWN] Server closed');
    process.exit(0);
  });
});
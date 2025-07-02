import { createStatefulServer } from '@smithery/sdk/server/stateful.js';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import EventSource from 'eventsource';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration from environment or Smithery config
const getConfig = (config = {}) => ({
  mcpifyServerUrl: config.mcpifyServerUrl || process.env.MCPIFY_SERVER_URL || 
    'https://agent.mcpify.ai/sse?server=14ddccd2-5cef-491b-b07c-71bdf8a94740',
  apiKey: config.apiKey || process.env.API_KEY || '',
  analyticsEnabled: config.analyticsEnabled !== false && process.env.ANALYTICS_ENABLED !== 'false'
});

// Tool definitions matching your PromptForge server
const TOOLS = [
  {
    name: 'optimize_prompt',
    description: 'Analyzes and enhances a user prompt by applying optimization patterns, injecting context, and formatting for better results.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { 
          type: 'string', 
          description: 'The user prompt to optimize',
          minLength: 1 
        },
        domain: { 
          type: 'string',          description: 'The domain/context for optimization'
        }
      },
      required: ['prompt']
    }
  },
  {
    name: 'track_analytics',
    description: 'Tracks prompt optimization analytics and performance metrics.',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['record', 'query'],
          description: 'Action to perform: record new data or query existing data'
        }
      },
      required: ['action']
    }
  },
  {
    name: 'manage_patterns',
    description: 'Manages the prompt optimization patterns library.',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['get', 'add', 'update', 'delete'],
          description: 'Action to perform on patterns'
        }
      },      required: ['action']
    }
  }
];

// Create MCP server function
function createMcpServer({ config }) {
  const mcpServer = new McpServer({
    name: "PromptForge",
    version: "1.0.0",
    description: "Advanced prompt optimization server with pattern management and analytics"
  });
  
  const serverConfig = getConfig(config);
  
  // Bridge function to communicate with MCPify
  async function callMCPifyTool(toolName, args) {
    // For now, return a mock response
    // In production, this would connect to MCPify
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          tool: toolName,
          args: args,
          result: 'Tool executed successfully',
          timestamp: new Date().toISOString()
        })
      }]
    };
  }
  
  // Set up tool handlers
  mcpServer.setRequestHandler("tools/list", async () => ({
    tools: TOOLS
  }));
  
  mcpServer.setRequestHandler("tools/call", async (request) => {
    const { name, arguments: args } = request.params;
    
    console.log(`Calling tool: ${name}`, args);
    
    try {
      const result = await callMCPifyTool(name, args);
      return result;
    } catch (error) {
      console.error(`Tool call error: ${error.message}`);
      throw error;
    }
  });

  // Return the configured server
  return mcpServer.server;
}

// Create and start the stateful server
const PORT = process.env.PORT || 8000;

const app = createStatefulServer(createMcpServer).app;

app.listen(PORT, () => {
  console.log(`PromptForge server running on port ${PORT}`);
  console.log(`MCPify endpoint: ${getConfig().mcpifyServerUrl}`);
});
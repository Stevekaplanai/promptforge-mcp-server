import { createServer } from '@smithery/sdk';
import EventSource from 'eventsource';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration from environment or Smithery config
const getConfig = () => ({
  mcpifyServerUrl: process.env.MCPIFY_SERVER_URL || 
    'https://agent.mcpify.ai/sse?server=14ddccd2-5cef-491b-b07c-71bdf8a94740',
  apiKey: process.env.API_KEY || '',
  analyticsEnabled: process.env.ANALYTICS_ENABLED !== 'false'
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
          type: 'string',          description: 'The domain/context for optimization (e.g., "coding", "writing", "analysis")'
        },
        desiredFormat: { 
          type: 'string',
          description: 'Desired output format (e.g., "detailed", "concise", "technical")'
        },
        intent: { 
          type: 'string',
          description: 'The intent behind the prompt (e.g., "create", "analyze", "explain")'
        },
        userContext: {
          type: 'object',
          description: 'Additional user context to inject into the prompt',
          additionalProperties: true
        },
        bypassOptimization: {
          type: 'boolean',
          description: 'If true, returns the original prompt without optimization'
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
        action: {          type: 'string',
          enum: ['record', 'query'],
          description: 'Action to perform: record new data or query existing data'
        },
        data: {
          type: 'object',
          properties: {
            originalPrompt: { type: 'string' },
            optimizedPrompt: { type: 'string' },
            domain: { type: 'string' },
            confidence: { type: 'number', minimum: 0, maximum: 1 },
            performanceMetrics: {
              type: 'object',
              properties: {
                timeToOptimize: { type: 'number' },
                timeToExecute: { type: 'number' },
                tokenCount: {
                  type: 'object',
                  properties: {
                    original: { type: 'number' },
                    optimized: { type: 'number' }
                  }
                }
              }
            },
            userFeedback: {
              type: 'object',
              properties: {
                wasHelpful: { type: 'boolean' },
                rating: { type: 'number', minimum: 1, maximum: 5 },                comments: { type: 'string' }
              }
            }
          }
        },
        queryParams: {
          type: 'object',
          properties: {
            domain: { type: 'string' },
            startDate: { type: 'string' },
            endDate: { type: 'string' },
            minConfidence: { type: 'number' },
            limit: { type: 'number' }
          }
        }
      },
      required: ['action']
    }
  },
  {
    name: 'manage_patterns',
    description: 'Manages the prompt optimization patterns library - add, update, delete, or retrieve patterns.',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['get', 'add', 'update', 'delete'],
          description: 'Action to perform on patterns'
        },        domain: {
          type: 'string',
          description: 'Domain for the pattern (e.g., "coding", "writing")'
        },
        pattern: {
          type: 'object',
          properties: {
            triggerKeywords: {
              type: 'array',
              items: { type: 'string' },
              description: 'Keywords that trigger this pattern'
            },
            enhancements: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string' },
                  value: { type: 'string' }
                },
                required: ['type', 'value']
              },
              description: 'Enhancement rules to apply'
            }
          }
        }
      },
      required: ['action']
    }
  }];

// Bridge function to communicate with MCPify
async function callMCPifyTool(toolName, args) {
  const config = getConfig();
  
  return new Promise((resolve, reject) => {
    const eventSource = new EventSource(config.mcpifyServerUrl);
    let responseData = '';
    
    // Send tool call request
    const request = {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args
      },
      id: Date.now()
    };
    
    // MCPify uses SSE, so we need to handle the response stream
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.id === request.id) {
          if (data.result) {
            resolve(data.result);
          } else if (data.error) {
            reject(new Error(data.error.message || 'Tool call failed'));
          }          eventSource.close();
        }
      } catch (err) {
        responseData += event.data;
      }
    };
    
    eventSource.onerror = (err) => {
      eventSource.close();
      reject(new Error(`MCPify connection error: ${err.message}`));
    };
    
    // Send the request (Note: This is a simplified version - actual implementation 
    // would need to handle MCPify's specific protocol)
    setTimeout(() => {
      if (responseData) {
        resolve({ content: [{ type: 'text', text: responseData }] });
      } else {
        reject(new Error('No response from MCPify'));
      }
      eventSource.close();
    }, 5000); // 5 second timeout
  });
}

// Create the Smithery server
const server = createServer({
  name: 'promptforge',
  version: '1.0.0',
  description: 'Advanced prompt optimization server with pattern management and analytics',  
  async listTools() {
    return TOOLS;
  },
  
  async callTool(name, args) {
    console.log(`Calling tool: ${name}`, args);
    
    try {
      // Route to MCPify
      const result = await callMCPifyTool(name, args);
      return result;
    } catch (error) {
      console.error(`Tool call error: ${error.message}`);
      throw error;
    }
  }
});

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`PromptForge server running on port ${PORT}`);
  console.log(`MCPify endpoint: ${getConfig().mcpifyServerUrl}`);
});
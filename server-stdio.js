#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { server as promptForgeServer } from './server.js';

// Start the server
const transport = new StdioServerTransport();

promptForgeServer.connect(transport).then(() => {
  console.error('PromptForge MCP Server 2.0 started successfully');
}).catch((error) => {
  console.error('Failed to start PromptForge MCP Server:', error);
  process.exit(1);
});
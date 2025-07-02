#!/usr/bin/env node

import { StdioTransport } from '@modelcontextprotocol/sdk/transport/stdio.js';
import { createMcpServer } from './server.js';

// Quick startup for Smithery deployment
const transport = new StdioTransport();
const server = createMcpServer({});

transport.handle((request) => server.handle(request));

// Minimal startup message
console.error('[PromptForge] Starting stdio server...');

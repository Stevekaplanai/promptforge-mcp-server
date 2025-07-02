# PromptForge MCP Server

✨ **Advanced AI Prompt Optimization with Pattern Management and Analytics**

## Overview

PromptForge is a Model Context Protocol (MCP) server that enhances AI prompts through intelligent optimization patterns, context injection, and performance analytics. It helps users craft more effective prompts that yield better AI responses.

## Features

- 🚀 **Smart Prompt Optimization**: Automatically enhance prompts with proven patterns
- 📊 **Analytics Tracking**: Monitor prompt performance and optimization metrics
- 🎯 **Pattern Management**: Create, update, and manage optimization patterns
- 🔧 **Domain-Specific Tuning**: Optimize prompts for specific contexts and use cases
- 📈 **Performance Insights**: Track and improve prompt effectiveness over time

## Installation

### Via Smithery (Recommended)

```bash
npx @smithery/cli install promptforge
```

### Manual Installation

```bash
git clone https://github.com/yourusername/promptforge-mcp-server
cd promptforge-mcp-server
npm install
```

## Configuration

The server can be configured through environment variables or the Smithery configuration:

- `MCPIFY_SERVER_URL`: MCPify endpoint URL (optional)
- `API_KEY`: Your PromptForge API key (optional)
- `ANALYTICS_ENABLED`: Enable/disable analytics (default: true)

## Available Tools

### 1. optimize_prompt
Enhances user prompts with optimization patterns and context injection.

**Parameters:**
- `prompt` (required): The prompt to optimize
- `domain` (optional): The domain/context for optimization

**Example:**
```json
{
  "prompt": "Write a blog post about AI",
  "domain": "marketing"
}
```

### 2. track_analytics
Records and queries prompt optimization analytics.

**Parameters:**
- `action` (required): Either "record" or "query"

### 3. manage_patterns
Manages the prompt optimization patterns library.

**Parameters:**
- `action` (required): One of "get", "add", "update", "delete"

## Use Cases

- **Content Creation**: Optimize prompts for blog posts, articles, and creative writing
- **Technical Documentation**: Enhance prompts for clear technical explanations
- **Marketing Copy**: Craft compelling marketing messages with optimized prompts
- **Code Generation**: Improve prompts for better code generation results
- **Research Queries**: Formulate more effective research questions

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © Steve Kaplan

## Support

For issues and feature requests, please visit the [GitHub repository](https://github.com/yourusername/promptforge-mcp-server).

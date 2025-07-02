# PromptForge MCP Server

Advanced prompt optimization server that enhances AI interactions through intelligent domain-specific patterns, context injection, and formatting suggestions.

## Features

- 🎯 **Smart Optimization**: Automatically enhance prompts with domain-specific patterns
- 📊 **Analytics Tracking**: Monitor prompt performance and user interactions  
- 🔧 **Pattern Management**: Create and manage custom prompt patterns
- 🚀 **High Performance**: Built with HTTP transport for optimal performance

## Quick Start

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/promptforge-mcp-server.git
cd promptforge-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your MCPify server URL and API key
```
4. Run the server:
```bash
npm start
```

### Deployment to Smithery

This server is designed to be deployed on [Smithery](https://smithery.ai), the MCP server registry.

## Tools

### optimize_prompt

Enhances user prompts with intelligent optimization:

```json
{
  "prompt": "Write a function to sort an array",
  "domain": "coding",
  "desiredFormat": "detailed",
  "intent": "create"
}
```

### track_analytics

Track and query prompt performance metrics:

```json
{
  "action": "record",
  "data": {
    "originalPrompt": "...",    "optimizedPrompt": "...",
    "confidence": 0.85
  }
}
```

### manage_patterns

Manage optimization patterns library:

```json
{
  "action": "add",
  "domain": "coding",
  "pattern": {
    "triggerKeywords": ["function", "implement"],
    "enhancements": [
      {
        "type": "context",
        "value": "Include error handling and edge cases"
      }
    ]
  }
}
```

## Configuration

Configure through environment variables or Smithery's config:

- `MCPIFY_SERVER_URL`: Your MCPify server endpoint
- `API_KEY`: Optional API key for enhanced features
- `ANALYTICS_ENABLED`: Enable/disable analytics (default: true)

## License

MIT
# PromptForge MCP Server

Intelligent prompt optimization middleware that enhances user prompts before execution.

## Features

- 🎯 **Smart Pattern Matching** - Automatically detects prompt intent and applies relevant optimizations
- 📊 **Analytics Tracking** - Monitor optimization performance and patterns
- 🔧 **Customizable Patterns** - Add and modify optimization patterns for your specific needs
- 🚀 **Domain-Specific Enhancements** - Pre-configured patterns for marketing, data analysis, tax/accounting, and code generation
- 💾 **External Service Integration** - Uses JSONBin for pattern storage and Supabase for analytics

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure External Services

#### JSONBin.io (Pattern Storage)
1. Create account at https://jsonbin.io
2. Create a new bin with initial patterns
3. Copy your bin ID and API key

#### Supabase (Analytics)
1. Create account at https://supabase.com
2. Create a new project
3. Create a table called `prompt_analytics` with this schema:
   - id (uuid, primary key)
   - original_prompt (text)
   - optimized_prompt (text)
   - domain (text)
   - confidence (float)
   - modifications (json)
   - user_feedback (json, nullable)
   - performance_metrics (json, nullable)
   - created_at (timestamp with timezone)

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your API credentials:

```bash
cp .env.example .env
```

### 4. Test Your Setup

```bash
npm test
```

## Available Tools

### optimize_prompt
Optimizes a prompt using intelligent pattern matching.

```json
{
  "tool": "optimize_prompt",
  "arguments": {
    "prompt": "Write an email about our services",
    "domain": "marketing_copy",
    "context": {
      "company": "Your Company",
      "audience": "B2B customers"
    }
  }
}
```

### get_patterns
Retrieve current optimization patterns.

```json
{
  "tool": "get_patterns",
  "arguments": {
    "domain": "marketing_copy"
  }
}
```

### update_pattern
Update or add a pattern in the library.

```json
{
  "tool": "update_pattern",
  "arguments": {
    "domain": "custom_domain",
    "pattern": {
      "triggerKeywords": ["keyword1", "keyword2"],
      "enhancements": [
        {
          "type": "role_addition",
          "value": "You are an expert..."
        }
      ]
    }
  }
}
```

### get_analytics_summary
Get analytics summary for optimizations.

```json
{
  "tool": "get_analytics_summary",
  "arguments": {
    "timeRange": "week",
    "domain": "marketing_copy"
  }
}
```

### test_optimization
Test optimization with before/after comparison.

```json
{
  "tool": "test_optimization",
  "arguments": {
    "prompt": "analyze our sales data",
    "showDiff": true
  }
}
```

## Deployment to mcpify.ai

1. **Create New MCP Server** on mcpify.ai
   - Name: `promptforge`
   - Description: "Intelligent prompt optimization for consistent AI outputs"

2. **Upload Files**
   - Copy the contents of `server.js` to mcpify.ai
   - Add environment variables from your `.env` file

3. **Configure Tools**
   - The server automatically exposes all tools defined in `getTools()`

## Default Patterns

The server includes pre-configured patterns for:

- **Marketing Copy** - Copywriting, emails, landing pages, ads
- **Data Analysis** - Analytics, reports, insights, metrics
- **Tax & Accounting** - Financial planning, tax optimization, compliance
- **Code Generation** - Programming, debugging, implementation
- **General** - Fallback for unmatched prompts

## For Schapira CPA Integration

This server is optimized for use with Schapira CPA's services:

```json
{
  "context": {
    "company": "Schapira CPA",
    "industry": "Tax and Accounting Services",
    "audience": "Mid-market owner-operated businesses",
    "tone": "professional"
  }
}
```

## License

MIT - Feel free to customize for your needs!

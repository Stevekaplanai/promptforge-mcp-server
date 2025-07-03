# Deploying to mcpify.ai

Follow these steps to deploy PromptForge to mcpify.ai:

## 1. Prepare Your Code

The main file you need is `server.js`. This contains the complete MCP server implementation.

## 2. Set Up External Services

Before deploying, you need API keys from:

### JSONBin.io (Required for Pattern Storage)
1. Go to https://jsonbin.io
2. Sign up for a free account
3. Create a new bin
4. Copy the contents of `initial-patterns.json` into the bin
5. Save the bin and copy:
   - Your Bin ID (from the URL)
   - Your Master Key (from account settings)

### Supabase (Optional but Recommended for Analytics)
1. Go to https://supabase.com
2. Create a free account and new project
3. In SQL Editor, run this query to create the analytics table:

```sql
CREATE TABLE prompt_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_prompt TEXT NOT NULL,
  optimized_prompt TEXT NOT NULL,
  domain TEXT NOT NULL,
  confidence FLOAT NOT NULL,
  modifications JSONB,
  user_feedback JSONB,
  performance_metrics JSONB,
  context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX idx_prompt_analytics_created_at ON prompt_analytics(created_at DESC);
CREATE INDEX idx_prompt_analytics_domain ON prompt_analytics(domain);
```

4. Copy your project URL and anon key from Project Settings > API

## 3. Deploy to mcpify.ai

1. Go to https://mcpify.ai
2. Click "Create New MCP Server"
3. Fill in the details:
   - **Name**: promptforge
   - **Description**: Intelligent prompt optimization for consistent AI outputs
   - **Version**: 1.0.0

4. In the code editor, copy the entire contents of `server.js`

5. Add these environment variables:
   ```
   PATTERNS_API_ENDPOINT=https://api.jsonbin.io/v3/b/YOUR_BIN_ID
   PATTERNS_API_KEY=YOUR_JSONBIN_MASTER_KEY
   ANALYTICS_API_ENDPOINT=https://YOUR_PROJECT.supabase.co/rest/v1/prompt_analytics
   ANALYTICS_API_KEY=YOUR_SUPABASE_ANON_KEY
   ```

6. Save and deploy

## 4. Test Your Deployment

Use these test commands in any MCP client:

```json
// Test basic optimization
{
  "tool": "optimize_prompt",
  "arguments": {
    "prompt": "Write an email about tax planning services",
    "context": {
      "company": "Schapira CPA",
      "audience": "mid-market business owners"
    }
  }
}

// Check patterns
{
  "tool": "get_patterns",
  "arguments": {}
}
```

## 5. Customization for Your Business

### For Schapira CPA
Update the tax_accounting pattern in JSONBin to include specific services:

```json
{
  "tax_accounting": {
    "triggerKeywords": ["tax", "accounting", "CPA", "quarterly review", "entity selection", "cost segregation", "R&D credit"],
    "enhancements": [
      {
        "type": "role_addition",
        "value": "You are a Schapira CPA tax professional specializing in mid-market businesses, offering comprehensive tax planning, quarterly reviews, and CFO-level insights."
      }
    ]
  }
}
```

### For GTMVP/Marketing Tools
Add patterns for your specific marketing needs:

```json
{
  "gtmvp_marketing": {
    "triggerKeywords": ["GTMVP", "growth", "AI marketing", "automation"],
    "enhancements": [
      {
        "type": "role_addition",
        "value": "You are an AI-driven marketing strategist focused on growth hacking and marketing automation."
      }
    ]
  }
}
```

## Troubleshooting

- **Pattern Loading Issues**: Check JSONBin API key and bin ID
- **Analytics Not Recording**: Verify Supabase credentials and table exists
- **Low Confidence Scores**: Add more specific trigger keywords to patterns

## Support

For issues specific to the MCP server code, check the test results:
```bash
npm test
```

For mcpify.ai platform issues, contact their support.

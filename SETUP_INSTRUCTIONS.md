# 🚀 PromptForge Setup Instructions

Follow these steps to get your PromptForge MCP Server running:

## Step 1: JSONBin Setup (Required - 5 mins)

1. Open https://jsonbin.io in your browser
2. Sign up (use Google for quick access)
3. Once logged in, click "Create Bin"
4. Copy ALL contents from `initial-patterns.json` 
5. Paste into the bin editor
6. Name it "promptforge-patterns" and save

**Get your credentials:**
- Bin ID: Check the URL after saving (e.g., `671f8e3ce41b4d34e44f9a2b`)
- API Key: Click profile → API Keys → copy "X-Master-Key"

**Update .env file:**
```
PATTERNS_API_ENDPOINT=https://api.jsonbin.io/v3/b/YOUR_BIN_ID
PATTERNS_API_KEY=$2a$10$YOUR_MASTER_KEY_HERE
```

## Step 2: Supabase Setup (Recommended - 10 mins)

1. Open https://supabase.com
2. Sign up and create a new project called "promptforge"
3. Wait for project to initialize (~2 mins)
4. Go to SQL Editor (left sidebar)
5. Click "New Query"
6. Copy contents from `supabase-setup.sql` and run it
7. You should see "Success. No rows returned"

**Get your credentials:**
- Go to Settings → API
- Copy the "URL" (e.g., https://abcdefgh.supabase.co)
- Copy the "anon public" key

**Update .env file:**
```
ANALYTICS_API_ENDPOINT=YOUR_SUPABASE_URL/rest/v1/prompt_analytics
ANALYTICS_API_KEY=YOUR_ANON_KEY
```

## Step 3: Install & Test Locally

1. **Install dependencies:**
   ```bash
   cd C:\Users\steve\Documents\promptforge-mcp
   npm install
   ```

2. **Verify setup:**
   ```bash
   node quick-setup.js
   ```
   
   You should see:
   - ✅ Environment variables are set
   - ✅ JSONBin connection successful

3. **Run full test:**
   ```bash
   npm test
   ```

## Step 4: Deploy to mcpify.ai

1. Go to https://mcpify.ai
2. Create new MCP server named "promptforge"
3. Copy entire contents of `server.js`
4. Add your environment variables from `.env`
5. Deploy!

## Quick Test Commands

Once deployed, test with these:

```json
// Basic test
{
  "tool": "test_optimization",
  "arguments": {
    "prompt": "write email about tax services"
  }
}

// With context
{
  "tool": "optimize_prompt",
  "arguments": {
    "prompt": "create landing page for accounting firm",
    "context": {
      "company": "Schapira CPA",
      "audience": "mid-market businesses"
    }
  }
}
```

## Troubleshooting

- **"Pattern loading failed"**: Check JSONBin credentials
- **"Analytics not configured"**: Supabase is optional, this is just a warning
- **Low confidence scores**: Normal for short/generic prompts

## Need Help?

1. Check error messages in `npm test`
2. Verify credentials in `.env` file
3. Run `node quick-setup.js` to diagnose issues

Ready to optimize prompts! 🎯

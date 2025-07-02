# PromptForge Deployment Guide

## Complete Deployment Process to Smithery

### Step 1: Prepare Your Repository

1. Create a new GitHub repository for your PromptForge server
2. Add all the files created above to your repository:
   - package.json
   - smithery.yaml
   - Dockerfile
   - .dockerignore
   - .gitignore
   - .env.example
   - server.js
   - README.md

### Step 2: Initialize and Push to GitHub

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: PromptForge MCP Server"

# Add your GitHub repository as origin
git remote add origin https://github.com/YOUR_USERNAME/promptforge-mcp-server.git
# Push to GitHub
git push -u origin main
```

### Step 3: Test Locally First

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Run locally
npm start

# In another terminal, test with Smithery CLI
npx @smithery/cli dev server.js --port 3000
```

### Step 4: Deploy to Smithery

1. **Login to Smithery:**
   ```bash
   npx @smithery/cli login
   ```

2. **Navigate to Smithery's new server page:**
   https://smithery.ai/new

3. **Connect your GitHub account** and select your repository
4. **Configure deployment settings:**
   - Runtime: Container
   - Start command type: HTTP
   - Port: 8000

5. **Deploy:**
   ```bash
   npx @smithery/cli deploy
   ```

### Step 5: Verify Deployment

1. Check deployment status on Smithery dashboard
2. Test your server using the provided endpoint
3. Monitor logs for any issues

### Step 6: Submit to Smithery Registry

1. Once deployed successfully, navigate to your server page
2. Click "Submit to Registry"
3. Fill in the listing information:
   - **Title**: PromptForge - Advanced Prompt Optimization Server
   - **Description**: (Use the description provided earlier)
   - **Categories**: Select relevant categories (AI, Productivity, Development)
   - **Documentation**: Link to your GitHub README

### Troubleshooting

**Connection Issues:**
- Verify MCPify server URL is correct
- Check firewall/network settings- Ensure Docker container has internet access

**Tool Errors:**
- Check server logs: `npx @smithery/cli logs`
- Verify tool schemas match MCPify expectations
- Test with simple prompts first

**Deployment Failures:**
- Ensure Dockerfile builds successfully locally
- Check Node.js version compatibility
- Verify all dependencies are listed in package.json

### Advanced Configuration

For production use, consider:

1. **Add monitoring:**
   ```javascript
   // Add to server.js
   server.on('error', (error) => {
     console.error('Server error:', error);
     // Send to monitoring service
   });
   ```

2. **Implement caching:**
   ```javascript
   const patternCache = new Map();
   // Cache frequently used patterns
   ```

3. **Add rate limiting:**
   ```javascript
   const rateLimit = new Map();   // Implement per-user rate limits
   ```

### Next Steps

1. **Monitor usage** through Smithery dashboard
2. **Collect feedback** from users
3. **Iterate on patterns** based on analytics
4. **Add more domains** and optimization strategies
5. **Consider OAuth** implementation for enhanced security
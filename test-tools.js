// test-tools.js - Test script for PromptForge MCP Server
require('dotenv').config();
const PromptForgeMCPServer = require('./server');

async function testServer() {
  console.log('🧪 Testing PromptForge MCP Server...\n');
  
  const server = new PromptForgeMCPServer();
  
  // Test 1: Basic optimization
  console.log('📝 Test 1: Basic optimization');
  try {
    const result = await server.handleToolCall('optimize_prompt', {
      prompt: "Write an email about our tax services",
      context: {
        company: "Schapira CPA",
        audience: "mid-market businesses"
      }
    });
    console.log('✅ Success:', result.optimized ? 'Optimized' : 'Not optimized');
    console.log('Domain:', result.domain);
    console.log('Confidence:', result.confidence);
    console.log('---\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  // Test 2: Get patterns
  console.log('📋 Test 2: Get patterns');
  try {
    const result = await server.handleToolCall('get_patterns', {});
    console.log('✅ Patterns loaded:', Object.keys(result.patterns || {}).join(', '));
    console.log('---\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  // Test 3: Test optimization
  console.log('🔍 Test 3: Test optimization with comparison');
  try {
    const result = await server.handleToolCall('test_optimization', {
      prompt: "analyze last quarter sales data",
      showDiff: true
    });
    console.log('✅ Original length:', result.comparison?.originalLength);
    console.log('Optimized length:', result.comparison?.optimizedLength);
    console.log('Length increase:', result.comparison?.lengthIncrease);
    console.log('---\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  // Test 4: Analytics summary (if configured)
  console.log('📊 Test 4: Analytics summary');
  try {
    const result = await server.handleToolCall('get_analytics_summary', {
      timeRange: 'week'
    });
    if (result.success) {
      console.log('✅ Total optimizations:', result.totalOptimizations);
      console.log('Average confidence:', result.averageConfidence);
    } else {
      console.log('⚠️  Analytics not configured:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  console.log('\n✨ Testing complete!');
}

// Run tests
testServer().catch(console.error);

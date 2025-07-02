// test.js - Simple test for PromptForge MCP Server
import { PromptForge } from './server.js';

console.log('Testing PromptForge 2.0.1...\n');

const forge = new PromptForge();
// Initialize the forge
forge.initialize();

// Test 1: Basic optimization
console.log('Test 1: Basic Optimization');
const result1 = forge.optimizePrompt('Write a function to sort an array');
console.log('Original:', result1.original);
console.log('Optimized (truncated):', result1.optimized.substring(0, 100) + '...');
console.log('Domain:', result1.metadata.detectedDomain);
console.log('Confidence:', result1.confidence);
console.log('Modifications:', result1.modifications.length);
console.log('---\n');

// Test 2: CPA Marketing optimization
console.log('Test 2: CPA Marketing Optimization');
const result2 = forge.optimizePrompt('Create landing page copy for tax planning services', {
  domain: 'cpa-marketing',
  includeExamples: true
});
console.log('Domain:', result2.metadata.detectedDomain);
console.log('Modifications:', result2.modifications.map(m => m.type).join(', '));
console.log('---\n');

// Test 3: AI Marketing Automation
console.log('Test 3: AI Marketing Automation');
const result3 = forge.optimizePrompt('Set up PPC campaign for home services');
console.log('Detected Domain:', result3.metadata.detectedDomain);
console.log('Confidence:', result3.confidence);
console.log('---\n');

// Test 4: Analytics
console.log('Test 4: Analytics');
const analytics = forge.getAnalytics();
console.log('Total Optimizations:', analytics.metrics.totalOptimizations);
console.log('Domain Distribution:', analytics.metrics.domainDistribution);
console.log('---\n');

// Test 5: Pattern Management
console.log('Test 5: Pattern Management');
const patterns = Array.from(forge.patterns.keys());
console.log('Available Patterns:', patterns.join(', '));

console.log('\nAll tests completed successfully! ✅');

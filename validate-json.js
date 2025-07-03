// validate-json.js - Validate the initial-patterns.json file
const fs = require('fs');
const path = require('path');

console.log('🔍 Validating initial-patterns.json...\n');

try {
  // Read the file
  const filePath = path.join(__dirname, 'initial-patterns.json');
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Try to parse it
  const patterns = JSON.parse(content);
  
  console.log('✅ JSON is valid!');
  console.log('\n📋 Pattern Summary:');
  
  Object.entries(patterns).forEach(([key, pattern]) => {
    console.log(`\n${pattern.name}:`);
    console.log(`  - Trigger Keywords: ${pattern.triggerKeywords.length}`);
    console.log(`  - Enhancements: ${pattern.enhancements.length}`);
    console.log(`  - Types: ${pattern.enhancements.map(e => e.type).join(', ')}`);
  });
  
  console.log('\n✨ You can now copy this file to JSONBin!');
  
} catch (error) {
  console.error('❌ JSON validation failed!');
  console.error('Error:', error.message);
  
  // Try to find the line with the error
  if (error.message.includes('position')) {
    const position = parseInt(error.message.match(/position (\d+)/)[1]);
    const lines = content.substring(0, position).split('\n');
    console.error(`\nError near line ${lines.length}`);
  }
}

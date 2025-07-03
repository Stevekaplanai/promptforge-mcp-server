const fs = require('fs');
require('dotenv').config();

console.log("🔧 PromptForge Quick Setup Checker\n");

// Check environment variables
console.log("📋 Checking environment variables...");
const envVars = [
    'PATTERNS_API_ENDPOINT',
    'PATTERNS_API_KEY', 
    'ANALYTICS_API_ENDPOINT',
    'ANALYTICS_API_KEY'
];

let allEnvSet = true;
for (const envVar of envVars) {
    if (process.env[envVar]) {
        console.log(`✅ ${envVar} is set`);
    } else {
        console.log(`❌ ${envVar} is NOT set`);
        allEnvSet = false;
    }
}

// Test JSONBin connection
console.log("\n🔌 Testing JSONBin connection...");
async function testConnection() {
    try {
        // Dynamic import for node-fetch (ESM module)
        const fetch = (await import('node-fetch')).default;
        
        const response = await fetch(process.env.PATTERNS_API_ENDPOINT, {
            headers: {
                'X-Master-Key': process.env.PATTERNS_API_KEY,
                'X-Access-Key': process.env.PATTERNS_API_KEY
            }
        });
        
        if (response.ok) {
            console.log("✅ JSONBin connection successful!");
            return true;
        } else {
            console.log(`❌ JSONBin connection failed: ${response.status} ${response.statusText}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ JSONBin connection failed: ${error.message}`);
        return false;
    }
}

// Run tests
(async () => {
    const connectionOk = await testConnection();
    
    console.log("\n==================================================");
    if (allEnvSet && connectionOk) {
        console.log("✅ Everything looks good! You can now run: npm start");
    } else {
        console.log("❌ Please fix the issues above before proceeding");
    }
})();

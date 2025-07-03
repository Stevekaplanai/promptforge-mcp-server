# Start server locally to test
echo "Starting PromptForge MCP server..."
node smithery-final.js &
SERVER_PID=$!

echo "Waiting for server to start..."
sleep 3

echo "Running tests..."
node test-local.js

echo "Stopping server..."
kill $SERVER_PID

echo "Done!"
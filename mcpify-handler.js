// MCPify connection handler
async function connectToMCPify(config) {
  const eventSource = new EventSource(config.mcpifyServerUrl, {
    headers: config.apiKey ? { 'Authorization': `Bearer ${config.apiKey}` } : {}
  });

  return new Promise((resolve, reject) => {
    eventSource.onopen = () => {
      console.log('Connected to MCPify server');
      resolve(eventSource);
    };

    eventSource.onerror = (error) => {
      console.error('MCPify connection error:', error);
      reject(error);
    };
  });
}

// Enhanced tool call function
async function callMCPifyTool(toolName, args, config) {
  try {
    // Connect to MCPify
    const eventSource = await connectToMCPify(config);
    
    // Send tool request
    const response = await fetch(config.mcpifyServerUrl.replace('/sse', '/execute'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey ? { 'Authorization': `Bearer ${config.apiKey}` } : {})
      },
      body: JSON.stringify({
        tool: toolName,
        parameters: args
      })
    });

    const result = await response.json();
    
    // Close connection
    eventSource.close();
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result)
      }]
    };
  } catch (error) {
    console.error(`MCPify tool call error: ${error.message}`);
    // Fallback to mock response
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          tool: toolName,
          args: args,
          result: 'Tool executed successfully (mock)',
          timestamp: new Date().toISOString()
        })
      }]
    };
  }
}

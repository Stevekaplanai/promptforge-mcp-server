import { createStatefulServer } from '@smithery/sdk/server/stateful.js';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import EventSource from 'eventsource';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// PromptForge 2.0 - Advanced Prompt Optimization System
class PromptForge {
  constructor() {
    this.version = '2.0.0';
    this.patterns = new Map();
    this.templates = new Map();
    this.analytics = new AnalyticsEngine();
    this.domainDetector = new DomainDetector();
    this.feedbackLearner = new FeedbackLearner();
    
    this.initializeDefaultPatterns();
    this.initializeTemplates();
  }

  // Enhanced domain detection with ML-based classification
  detectDomain(prompt, context = {}) {
    const features = this.extractFeatures(prompt);
    const keywordMatches = this.matchKeywords(prompt);
    
    // Weighted scoring system
    const domainScores = new Map();
    
    for (const [domain, pattern] of this.patterns) {
      let score = 0;
      pattern.triggerKeywords.forEach(keyword => {
        if (prompt.toLowerCase().includes(keyword.toLowerCase())) {
          score += pattern.keywordWeights?.get(keyword) || 1;
        }
      });
      
      features.forEach(feature => {
        if (pattern.features?.includes(feature)) {
          score += 0.5;
        }
      });
      
      domainScores.set(domain, score);
    }
    
    const sortedDomains = Array.from(domainScores.entries())
      .sort((a, b) => b[1] - a[1]);
    
    const topDomain = sortedDomains[0];
    const confidence = topDomain ? topDomain[1] / (topDomain[1] + 5) : 0;
    
    return {
      domain: topDomain ? topDomain[0] : 'general',
      confidence: Math.min(confidence, 0.99),
      alternatives: sortedDomains.slice(1, 3).map(([d, s]) => ({ domain: d, score: s }))
    };
  }

  // Advanced prompt optimization
  optimizePrompt(prompt, options = {}) {
    const {
      domain = null,
      intent = null,
      targetModel = 'general',
      optimization = 'balanced',
      includeExamples = false,
      chainOfThought = false,
      outputFormat = null,
      temperature = null,
      bypassOptimization = false
    } = options;
    
    if (bypassOptimization) {
      return { optimized: prompt, modifications: [], confidence: 1.0 };
    }
    
    // Detect domain if not provided
    const detectedDomain = domain || this.detectDomain(prompt, { intent }).domain;
    const pattern = this.patterns.get(detectedDomain) || this.patterns.get('general');
    
    let optimized = prompt;
    const modifications = [];
    
    // Apply pattern enhancements
    pattern.enhancements.forEach(enhancement => {
      const result = this.applyEnhancement(optimized, enhancement, {
        intent,
        optimization
      });
      if (result.modified) {
        optimized = result.text;
        modifications.push({
          type: enhancement.type,
          reason: enhancement.reason || 'pattern_based',
          text: result.modification
        });
      }
    });
    
    // Apply chain of thought if requested
    if (chainOfThought && !optimized.includes('step-by-step')) {
      optimized = this.addChainOfThought(optimized);
      modifications.push({
        type: 'chain_of_thought',
        reason: 'requested',
        text: 'Added step-by-step reasoning'
      });
    }
    
    // Apply output format if specified
    if (outputFormat) {
      optimized = this.formatOutput(optimized, outputFormat);
      modifications.push({
        type: 'output_formatting',
        reason: 'requested',
        text: `Formatted output as ${outputFormat}`
      });
    }
    
    // Add examples if requested
    if (includeExamples) {
      const examples = this.getExamplesForDomain(detectedDomain);
      if (examples.length > 0) {
        optimized = this.addExamples(optimized, examples);
        modifications.push({
          type: 'examples',
          reason: 'requested',
          text: `Added ${examples.length} relevant examples`
        });
      }
    }
    
    // Track analytics
    this.analytics.track('optimization', {
      domain: detectedDomain,
      originalLength: prompt.length,
      optimizedLength: optimized.length,
      modifications: modifications.length,
      options
    });
    
    return {
      original: prompt,
      optimized: optimized,
      modifications: modifications,
      confidence: this.calculateConfidence(modifications),
      metadata: {
        detectedDomain,
        timestamp: new Date().toISOString(),
        version: this.version
      }
    };
  }
  
  // Feature extraction for ML-based detection
  extractFeatures(prompt) {
    const features = [];
    
    if (prompt.includes('function') || prompt.includes('code')) features.push('programming');
    if (prompt.includes('analyze') || prompt.includes('data')) features.push('analytical');
    if (prompt.includes('create') || prompt.includes('write')) features.push('creative');
    if (prompt.includes('tax') || prompt.includes('accounting')) features.push('financial');
    if (prompt.includes('campaign') || prompt.includes('marketing')) features.push('marketing');
    if (prompt.includes('API') || prompt.includes('integrate')) features.push('technical');
    
    return features;
  }
  
  // Keyword matching
  matchKeywords(prompt) {
    const matches = [];
    const promptLower = prompt.toLowerCase();
    
    for (const [domain, pattern] of this.patterns) {
      pattern.triggerKeywords.forEach(keyword => {
        if (promptLower.includes(keyword.toLowerCase())) {
          matches.push({ domain, keyword });
        }
      });
    }
    
    return matches;
  }
  
  // Apply enhancement to prompt
  applyEnhancement(prompt, enhancement, context) {
    let modified = false;
    let text = prompt;
    let modification = '';
    
    switch (enhancement.type) {
      case 'clarity':
        if (!prompt.includes('specific')) {
          text = `${prompt}\n\nBe specific and provide detailed explanations.`;
          modification = 'Added clarity instruction';
          modified = true;
        }
        break;
        
      case 'structure':
        if (!prompt.includes('format')) {
          text = `${prompt}\n\nStructure your response with clear sections and formatting.`;
          modification = 'Added structure guidance';
          modified = true;
        }
        break;
        
      case 'constraint':
        if (enhancement.value && !prompt.includes(enhancement.value)) {
          text = `${prompt}\n\nConstraint: ${enhancement.value}`;
          modification = `Added constraint: ${enhancement.value}`;
          modified = true;
        }
        break;
        
      case 'context':
        if (enhancement.value && !prompt.includes(enhancement.value)) {
          text = `Context: ${enhancement.value}\n\n${prompt}`;
          modification = `Added context: ${enhancement.value}`;
          modified = true;
        }
        break;
        
      case 'examples':
        if (enhancement.value && !prompt.includes('example')) {
          text = `${prompt}\n\nExample: ${enhancement.value}`;
          modification = 'Added example';
          modified = true;
        }
        break;
    }
    
    return { modified, text, modification };
  }
  
  // Add chain of thought reasoning
  addChainOfThought(prompt) {
    return `${prompt}\n\nThink through this step-by-step:
1. First, identify the key requirements
2. Break down the problem into components
3. Address each component systematically
4. Provide clear reasoning for your approach`;
  }
  
  // Format output
  formatOutput(prompt, format) {
    const formats = {
      json: '\n\nProvide your response in valid JSON format.',
      markdown: '\n\nFormat your response using Markdown with headers and proper formatting.',
      list: '\n\nProvide your response as a numbered list.',
      table: '\n\nFormat your response as a table with clear columns and rows.',
      code: '\n\nProvide your response with proper code formatting and syntax highlighting.'
    };
    
    return prompt + (formats[format] || '');
  }
  
  // Get examples for domain
  getExamplesForDomain(domain) {
    const domainExamples = {
      programming: [
        'Input: "Sort an array" → Output: "Write a function that implements an efficient sorting algorithm (e.g., quicksort or mergesort) with O(n log n) time complexity"'
      ],
      'cpa-marketing': [
        'Input: "Create tax planning content" → Output: "Develop comprehensive tax planning strategies for business owners including entity selection, depreciation methods, and R&D tax credits"'
      ],
      'ai-automation': [
        'Input: "Automate PPC campaigns" → Output: "Design an AI-driven PPC automation system with bid optimization, keyword discovery, and performance tracking"'
      ]
    };
    
    return domainExamples[domain] || [];
  }
  
  // Add examples to prompt
  addExamples(prompt, examples) {
    const exampleText = examples.map((ex, i) => `Example ${i + 1}: ${ex}`).join('\n');
    return `${prompt}\n\nHere are some relevant examples:\n${exampleText}`;
  }
  
  // Calculate confidence score
  calculateConfidence(modifications) {
    const baseConfidence = 0.7;
    const modificationBoost = modifications.length * 0.05;
    return Math.min(baseConfidence + modificationBoost, 0.99);
  }
  
  // Initialize default patterns
  initializeDefaultPatterns() {
    // Programming patterns
    this.patterns.set('programming', {
      triggerKeywords: ['function', 'code', 'algorithm', 'implement', 'debug', 'API'],
      keywordWeights: new Map([
        ['function', 2],
        ['algorithm', 2],
        ['implement', 1.5]
      ]),
      features: ['programming', 'technical'],
      enhancements: [
        { type: 'clarity', value: 'Be specific about requirements and edge cases' },
        { type: 'structure', value: 'Include error handling and documentation' },
        { type: 'constraint', value: 'Follow best practices and design patterns' }
      ]
    });
    
    // CPA Marketing patterns (for Schapira CPA)
    this.patterns.set('cpa-marketing', {
      triggerKeywords: ['tax', 'accounting', 'CPA', 'financial', 'audit', 'bookkeeping', 'Schapira'],
      keywordWeights: new Map([
        ['tax', 3],
        ['CPA', 3],
        ['Schapira', 5],
        ['audit', 2]
      ]),
      features: ['financial', 'analytical'],
      enhancements: [
        { type: 'context', value: 'Focus on relationship-driven accounting services for mid-market businesses' },
        { type: 'structure', value: 'Include tax planning strategies and quarterly review processes' },
        { type: 'constraint', value: 'Emphasize creativity in tax planning and dedicated accountant support' }
      ]
    });
    
    // AI Marketing Automation patterns
    this.patterns.set('ai-automation', {
      triggerKeywords: ['PPC', 'SEO', 'ABM', 'campaign', 'automation', 'marketing', 'AI'],
      keywordWeights: new Map([
        ['automation', 3],
        ['AI', 3],
        ['PPC', 2],
        ['campaign', 2]
      ]),
      features: ['marketing', 'technical'],
      enhancements: [
        { type: 'clarity', value: 'Specify metrics, KPIs, and automation workflows' },
        { type: 'structure', value: 'Include data-driven strategies and measurable results' },
        { type: 'context', value: 'Focus on AI as augmentation for marketing effectiveness' }
      ]
    });
    
    // General patterns
    this.patterns.set('general', {
      triggerKeywords: [],
      features: [],
      enhancements: [
        { type: 'clarity', value: 'Be clear and specific' },
        { type: 'structure', value: 'Organize your response logically' }
      ]
    });
  }
  
  // Initialize templates
  initializeTemplates() {
    this.templates.set('problem-solution', {
      structure: `Problem Statement:
[Define the problem clearly]

Requirements:
[List specific requirements]

Solution Approach:
[Describe your approach]

Implementation Details:
[Provide specific details]

Expected Outcomes:
[Define success metrics]`
    });
    
    this.templates.set('marketing-campaign', {
      structure: `Campaign Overview:
- Objective: [Define goal]
- Target Audience: [Specify demographics]
- Budget: [Set budget]

Strategy:
- Channels: [List channels]
- Messaging: [Key messages]
- Timeline: [Campaign duration]

Metrics:
- KPIs: [Define success metrics]
- Tracking: [Measurement methods]`
    });
  }
  
  // Get analytics
  getAnalytics() {
    return this.analytics.getReport();
  }
  
  // Manage patterns
  addPattern(domain, pattern) {
    this.patterns.set(domain, pattern);
    return { success: true, domain };
  }
  
  updatePattern(domain, updates) {
    const existing = this.patterns.get(domain);
    if (!existing) return { success: false, error: 'Pattern not found' };
    
    this.patterns.set(domain, { ...existing, ...updates });
    return { success: true, domain };
  }
  
  deletePattern(domain) {
    return this.patterns.delete(domain);
  }
  
  getPattern(domain) {
    return this.patterns.get(domain);
  }
}

// Analytics Engine
class AnalyticsEngine {
  constructor() {
    this.metrics = {
      totalOptimizations: 0,
      domainDistribution: new Map(),
      averageConfidence: 0,
      modificationTypes: new Map(),
      performanceMetrics: []
    };
    this.history = [];
  }
  
  track(event, data) {
    const timestamp = Date.now();
    this.history.push({ event, data, timestamp });
    
    if (event === 'optimization') {
      this.metrics.totalOptimizations++;
      
      const domain = data.domain;
      this.metrics.domainDistribution.set(
        domain, 
        (this.metrics.domainDistribution.get(domain) || 0) + 1
      );
      
      data.modifications.forEach(mod => {
        this.metrics.modificationTypes.set(
          mod.type,
          (this.metrics.modificationTypes.get(mod.type) || 0) + 1
        );
      });
    }
  }
  
  getReport() {
    return {
      metrics: {
        totalOptimizations: this.metrics.totalOptimizations,
        domainDistribution: Object.fromEntries(this.metrics.domainDistribution),
        modificationTypes: Object.fromEntries(this.metrics.modificationTypes),
        averageConfidence: this.calculateAverageConfidence()
      },
      recentActivity: this.history.slice(-20)
    };
  }
  
  calculateAverageConfidence() {
    const confidenceValues = this.history
      .filter(h => h.event === 'optimization' && h.data.confidence)
      .map(h => h.data.confidence);
    
    if (confidenceValues.length === 0) return 0;
    return confidenceValues.reduce((a, b) => a + b, 0) / confidenceValues.length;
  }
}

// Domain Detector with ML capabilities
class DomainDetector {
  constructor() {
    this.domainFeatures = new Map([
      ['programming', ['function', 'code', 'algorithm', 'debug', 'implement']],
      ['cpa-marketing', ['tax', 'accounting', 'audit', 'financial', 'bookkeeping']],
      ['ai-automation', ['AI', 'automation', 'PPC', 'SEO', 'campaign']]
    ]);
  }
  
  detect(text, context = {}) {
    const scores = new Map();
    
    this.domainFeatures.forEach((features, domain) => {
      let score = 0;
      features.forEach(feature => {
        if (text.toLowerCase().includes(feature.toLowerCase())) {
          score += 1;
        }
      });
      scores.set(domain, score);
    });
    
    const sorted = Array.from(scores.entries()).sort((a, b) => b[1] - a[1]);
    return sorted[0] ? sorted[0][0] : 'general';
  }
}

// Feedback Learning System
class FeedbackLearner {
  constructor() {
    this.feedback = [];
    this.patterns = new Map();
  }
  
  recordFeedback(optimization, rating, comments) {
    this.feedback.push({
      optimization,
      rating,
      comments,
      timestamp: Date.now()
    });
    
    this.updatePatterns();
  }
  
  updatePatterns() {
    // Simple pattern learning from feedback
    const positiveFeedback = this.feedback.filter(f => f.rating >= 4);
    
    positiveFeedback.forEach(feedback => {
      const domain = feedback.optimization.metadata.detectedDomain;
      const modifications = feedback.optimization.modifications;
      
      if (!this.patterns.has(domain)) {
        this.patterns.set(domain, []);
      }
      
      this.patterns.get(domain).push({
        modifications,
        rating: feedback.rating
      });
    });
  }
  
  getSuggestions(domain) {
    const domainPatterns = this.patterns.get(domain) || [];
    return domainPatterns
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3)
      .map(p => p.modifications);
  }
}

// Main server implementation
const server = new McpServer({
  name: "promptforge-mcp-server",
  version: "2.0.0"
});

// Initialize PromptForge
const promptForge = new PromptForge();

// Register handlers
server.setRequestHandler('initialize', () => ({
  protocolVersion: "1.0.0",
  serverInfo: {
    name: "promptforge-mcp-server",
    version: "2.0.0"
  },
  capabilities: {
    tools: {}
  }
}));

// Tool: optimize_prompt
server.setRequestHandler('tools/list', () => ({
  tools: [
    {
      name: "optimize_prompt",
      description: "Analyzes and enhances a user prompt by applying optimization patterns, injecting context, and formatting for better results",
      inputSchema: {
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "The prompt to optimize"
          },
          domain: {
            type: "string",
            description: "Target domain (optional - will be auto-detected)"
          },
          intent: {
            type: "string",
            description: "User's intent or goal"
          },
          bypassOptimization: {
            type: "boolean",
            description: "Skip optimization and return prompt as-is"
          },
          includeExamples: {
            type: "boolean",
            description: "Include relevant examples"
          },
          chainOfThought: {
            type: "boolean",
            description: "Add chain-of-thought reasoning"
          },
          outputFormat: {
            type: "string",
            enum: ["json", "markdown", "list", "table", "code"],
            description: "Desired output format"
          }
        },
        required: ["prompt"]
      }
    },
    {
      name: "manage_patterns",
      description: "Manages the prompt optimization patterns library - add, update, delete, or retrieve patterns",
      inputSchema: {
        type: "object",
        properties: {
          action: {
            type: "string",
            enum: ["get", "add", "update", "delete"],
            description: "Action to perform"
          },
          domain: {
            type: "string",
            description: "Domain name for the pattern"
          },
          pattern: {
            type: "object",
            description: "Pattern configuration"
          }
        },
        required: ["action", "domain"]
      }
    },
    {
      name: "track_analytics",
      description: "Tracks prompt optimization analytics and performance metrics",
      inputSchema: {
        type: "object",
        properties: {
          action: {
            type: "string",
            enum: ["record", "query"],
            description: "Action to perform"
          },
          data: {
            type: "object",
            description: "Analytics data to record"
          },
          queryParams: {
            type: "object",
            description: "Parameters for querying analytics"
          }
        },
        required: ["action"]
      }
    }
  ]
}));

// Handle tool calls
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    switch (name) {
      case 'optimize_prompt': {
        const result = promptForge.optimizePrompt(args.prompt, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case 'manage_patterns': {
        let result;
        switch (args.action) {
          case 'get':
            result = promptForge.getPattern(args.domain);
            break;
          case 'add':
            result = promptForge.addPattern(args.domain, args.pattern);
            break;
          case 'update':
            result = promptForge.updatePattern(args.domain, args.pattern);
            break;
          case 'delete':
            result = promptForge.deletePattern(args.domain);
            break;
        }
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case 'track_analytics': {
        let result;
        if (args.action === 'record') {
          promptForge.analytics.track(args.data.event, args.data);
          result = { success: true };
        } else {
          result = promptForge.getAnalytics();
        }
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({ error: error.message }, null, 2) 
      }]
    };
  }
});

// Export for testing
export { PromptForge, server };

// Create stateful server
const statefulServer = createStatefulServer(server);

// Export server instance
export default statefulServer;
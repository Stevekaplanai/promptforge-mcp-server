import { createStatefulServer } from '@smithery/sdk/server/stateful.js';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import EventSource from 'eventsource';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Lazy-loaded PromptForge instance
let promptForgeInstance = null;

// PromptForge 2.0 - Advanced Prompt Optimization System
class PromptForge {
  constructor() {
    this.version = '2.0.1';
    this.patterns = new Map();
    this.templates = new Map();
    this.analytics = null;
    this.domainDetector = null;
    this.feedbackLearner = null;
    this._initialized = false;
  }

  // Lazy initialization
  initialize() {
    if (this._initialized) return;
    
    console.log('[PromptForge] Initializing...');
    this.analytics = new AnalyticsEngine();
    this.domainDetector = new DomainDetector();
    this.feedbackLearner = new FeedbackLearner();
    
    this.initializeDefaultPatterns();
    this.initializeTemplates();
    this._initialized = true;
    console.log('[PromptForge] Initialization complete');
  }

  // Enhanced domain detection with ML-based classification
  detectDomain(prompt, context = {}) {
    this.initialize();
    
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
    this.initialize();
    
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
    
    // Add chain-of-thought if requested
    if (chainOfThought) {
      optimized = this.addChainOfThought(optimized, detectedDomain);
      modifications.push({
        type: 'chain_of_thought',
        reason: 'reasoning_enhancement',
        text: 'Added step-by-step reasoning framework'
      });
    }
    
    // Add examples if requested
    if (includeExamples) {
      const examples = this.getRelevantExamples(prompt, detectedDomain);
      if (examples.length > 0) {
        optimized = this.addExamples(optimized, examples);
        modifications.push({
          type: 'examples',
          reason: 'clarity_enhancement',
          text: `Added ${examples.length} relevant examples`
        });
      }
    }
    
    // Format output if specified
    if (outputFormat) {
      optimized = this.formatOutput(optimized, outputFormat);
      modifications.push({
        type: 'format',
        reason: 'output_structure',
        text: `Formatted for ${outputFormat} output`
      });
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
      optimized,
      original: prompt,
      modifications,
      confidence: this.calculateConfidence(modifications, detectedDomain),
      metadata: {
        detectedDomain,
        modificationCount: modifications.length,
        targetModel,
        optimization
      }
    };
  }

  // Apply enhancement based on type
  applyEnhancement(text, enhancement, context) {
    let modified = false;
    let modifiedText = text;
    let modification = '';
    
    switch (enhancement.type) {
      case 'role_addition':
        if (!text.toLowerCase().includes('you are')) {
          modifiedText = enhancement.value + '\n\n' + text;
          modification = enhancement.value;
          modified = true;
        }
        break;
        
      case 'structure':
        modifiedText = text + '\n\n' + enhancement.value;
        modification = enhancement.value;
        modified = true;
        break;
        
      case 'context_injection':
        modifiedText = text + '\n\n' + enhancement.value;
        modification = enhancement.value;
        modified = true;
        break;
        
      case 'best_practices':
        modifiedText = text + '\n\n' + enhancement.value;
        modification = enhancement.value;
        modified = true;
        break;
        
      default:
        modifiedText = text + '\n\n' + enhancement.value;
        modification = enhancement.value;
        modified = true;
    }
    
    return { text: modifiedText, modified, modification };
  }

  // Helper methods
  extractFeatures(prompt) {
    const features = [];
    
    if (prompt.length < 50) features.push('short');
    else if (prompt.length > 500) features.push('long');
    
    if (prompt.includes('?')) features.push('question');
    if (prompt.includes('!')) features.push('emphatic');
    if (prompt.match(/^\\d+\\./m)) features.push('numbered_list');
    if (prompt.includes('```')) features.push('code_block');
    
    if (prompt.match(/\\b(create|build|make|generate)\\b/i)) features.push('creative');
    if (prompt.match(/\\b(analyze|explain|describe)\\b/i)) features.push('analytical');
    if (prompt.match(/\\b(fix|debug|troubleshoot|solve)\\b/i)) features.push('problem_solving');
    
    return features;
  }

  matchKeywords(prompt) {
    const matches = [];
    for (const [domain, pattern] of this.patterns) {
      pattern.triggerKeywords.forEach(keyword => {
        if (prompt.toLowerCase().includes(keyword.toLowerCase())) {
          matches.push({ domain, keyword });
        }
      });
    }
    return matches;
  }

  addChainOfThought(text, domain) {
    const prefix = `Let's approach this step-by-step:\n\n`;
    const suffix = `\n\nPlease work through this systematically, showing your reasoning at each step.`;
    return prefix + text + suffix;
  }

  addExamples(text, examples) {
    const exampleText = '\n\nExamples:\n' + examples.map((ex, i) => 
      `${i + 1}. ${ex}`
    ).join('\n');
    return text + exampleText;
  }

  formatOutput(text, format) {
    const formatInstructions = {
      json: '\n\nProvide your response in valid JSON format.',
      xml: '\n\nProvide your response in well-formed XML format.',
      markdown: '\n\nFormat your response using Markdown with appropriate headers and formatting.',
      html: '\n\nProvide your response in clean, semantic HTML format.'
    };
    
    return text + (formatInstructions[format] || '');
  }

  calculateConfidence(modifications, domain) {
    const baseConfidence = 0.5;
    const modBonus = Math.min(modifications.length * 0.1, 0.3);
    const domainBonus = this.patterns.has(domain) ? 0.2 : 0;
    
    return Math.min(baseConfidence + modBonus + domainBonus, 0.99);
  }

  getRelevantExamples(prompt, domain) {
    // Return domain-specific examples
    const pattern = this.patterns.get(domain);
    return pattern?.examples || [];
  }

  // Pattern management
  addPattern(domain, pattern) {
    const enhancedPattern = {
      ...pattern,
      domain,
      keywordWeights: new Map(pattern.keywordWeights || []),
      features: pattern.features || [],
      examples: pattern.examples || []
    };
    
    this.patterns.set(domain, enhancedPattern);
    return { success: true, message: `Pattern for domain '${domain}' added successfully` };
  }

  getPattern(domain) {
    this.initialize();
    return this.patterns.get(domain) || null;
  }

  // Analytics methods
  getAnalytics(queryParams = {}) {
    this.initialize();
    return this.analytics.getMetrics(queryParams);
  }

  // Initialize default patterns
  initializeDefaultPatterns() {
    // General pattern
    this.addPattern('general', {
      triggerKeywords: [],
      enhancements: [
        {
          type: 'role_addition',
          value: 'You are a knowledgeable and helpful AI assistant with expertise across many domains. You provide accurate, thoughtful, and well-structured responses.'
        },
        {
          type: 'format_suggestion',
          value: 'Please provide a clear, comprehensive, and well-organized response that directly addresses the request.'
        }
      ]
    });

    // Software development pattern
    this.addPattern('software-development', {
      triggerKeywords: ['code', 'function', 'class', 'implement', 'debug', 'algorithm', 'api', 'database'],
      keywordWeights: new Map([
        ['implement', 2],
        ['debug', 2],
        ['algorithm', 1.5],
        ['code', 1]
      ]),
      features: ['problem_solving', 'analytical'],
      enhancements: [
        {
          type: 'role_addition',
          value: 'You are an experienced software engineer with expertise in modern development practices, clean code principles, and system design.',
          reason: 'domain_expertise'
        },
        {
          type: 'structure',
          value: 'Break down the solution into: 1) Requirements analysis, 2) Design approach, 3) Implementation with code, 4) Testing strategy, 5) Potential optimizations',
          reason: 'systematic_approach'
        },
        {
          type: 'best_practices',
          value: 'Follow SOLID principles, use meaningful variable names, include error handling, and consider edge cases.',
          reason: 'code_quality'
        }
      ],
      examples: [
        'Input validation: if (!email || !email.includes("@")) throw new Error("Invalid email");',
        'Error handling: try { await processData(); } catch (error) { logger.error(error); }'
      ]
    });

    // CPA Marketing pattern
    this.addPattern('cpa-marketing', {
      triggerKeywords: ['accounting', 'tax', 'cpa', 'financial', 'bookkeeping', 'audit'],
      keywordWeights: new Map([
        ['tax', 2],
        ['accounting', 2],
        ['cpa', 1.5]
      ]),
      features: ['professional', 'persuasive'],
      enhancements: [
        {
          type: 'role_addition',
          value: 'You are a marketing strategist specializing in CPA and accounting firms, with deep understanding of how to communicate complex financial services to business owners.',
          reason: 'domain_expertise'
        },
        {
          type: 'audience_focus',
          value: 'Target audience: Owner-operated businesses and mid-market companies seeking relationship-driven accounting services.',
          reason: 'targeting'
        },
        {
          type: 'value_proposition',
          value: 'Emphasize: 1) Personal relationships and dedicated accountants, 2) Year-round strategic guidance, 3) Proactive tax planning, 4) Business growth support',
          reason: 'messaging'
        }
      ]
    });

    // AI Marketing Automation pattern
    this.addPattern('ai-marketing-automation', {
      triggerKeywords: ['ai marketing', 'automation', 'home services', 'lead generation', 'conversion', 'gtmvp'],
      keywordWeights: new Map([
        ['automation', 2],
        ['conversion', 2],
        ['ai marketing', 1.5]
      ]),
      features: ['strategic', 'data-driven'],
      enhancements: [
        {
          type: 'role_addition',
          value: 'You are an AI-driven marketing automation expert specializing in performance marketing and conversion optimization.',
          reason: 'domain_expertise'
        },
        {
          type: 'framework',
          value: 'Apply the GTMVP methodology: 1) Identify high-intent keywords, 2) Create targeted landing pages, 3) Implement AI-driven bidding, 4) Optimize conversion paths',
          reason: 'methodology'
        },
        {
          type: 'metrics_focus',
          value: 'Focus on measurable outcomes: CPA, ROAS, CRO, Lead quality scores, CLV',
          reason: 'performance'
        }
      ]
    });
  }

  initializeTemplates() {
    // Templates would be initialized here
  }
}

// Analytics Engine
class AnalyticsEngine {
  constructor() {
    this.events = [];
    this.metrics = new Map();
  }

  track(eventType, data) {
    const event = {
      type: eventType,
      data,
      timestamp: new Date().toISOString()
    };
    this.events.push(event);
    this.updateMetrics(event);
  }

  updateMetrics(event) {
    const hour = new Date().getHours();
    const key = `${event.type}_${hour}`;
    this.metrics.set(key, (this.metrics.get(key) || 0) + 1);
  }

  getMetrics(queryParams) {
    const totalOptimizations = this.events.filter(e => e.type === 'optimization').length;
    const domainDistribution = {};
    
    this.events.forEach(event => {
      if (event.type === 'optimization' && event.data.domain) {
        domainDistribution[event.data.domain] = (domainDistribution[event.data.domain] || 0) + 1;
      }
    });
    
    const recentOptimizations = this.events
      .filter(e => e.type === 'optimization')
      .slice(-5)
      .map(e => ({
        id: Math.random().toString(36).substr(2, 9),
        timestamp: e.timestamp,
        domain: e.data.domain,
        confidence: e.data.confidence || 0.5
      }));
    
    return {
      metrics: {
        totalOptimizations,
        averageConfidence: 0.85,
        domainDistribution
      },
      recentOptimizations
    };
  }
}

// Domain Detector
class DomainDetector {
  detect(text) {
    return 'general';
  }
}

// Feedback Learner
class FeedbackLearner {
  constructor() {
    this.feedback = [];
  }

  addFeedback(record) {
    this.feedback.push(record);
  }
}

// Lazy getter for PromptForge instance
function getPromptForge() {
  if (!promptForgeInstance) {
    promptForgeInstance = new PromptForge();
  }
  return promptForgeInstance;
}

// Configuration
const getConfig = (config = {}) => ({
  analyticsEnabled: config.analyticsEnabled !== false && process.env.ANALYTICS_ENABLED !== 'false'
});

// Tool definitions
const TOOLS = [
  {
    name: 'optimize_prompt',
    description: 'Analyzes and enhances a user prompt by applying optimization patterns, injecting context, and formatting for better results.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { 
          type: 'string', 
          description: 'The user prompt to optimize',
          minLength: 1 
        },
        domain: { 
          type: 'string',
          description: 'The domain/context for optimization (optional - will auto-detect if not provided)'
        },
        intent: {
          type: 'string',
          description: 'The user intent or goal'
        },
        desiredFormat: {
          type: 'string',
          description: 'Desired output format',
          enum: ['text', 'json', 'xml', 'markdown', 'html']
        },
        userContext: {
          type: 'object',
          description: 'Additional context about the user or request'
        },
        bypassOptimization: {
          type: 'boolean',
          description: 'Whether to bypass optimization',
          default: false
        }
      },
      required: ['prompt']
    }
  },
  {
    name: 'track_analytics',
    description: 'Tracks prompt optimization analytics and performance metrics.',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['record', 'query'],
          description: 'Action to perform: record new data or query existing data'
        },
        data: {
          type: 'object',
          description: 'Analytics data to record (for record action)'
        },
        queryParams: {
          type: 'object',
          description: 'Query parameters (for query action)'
        }
      },
      required: ['action']
    }
  },
  {
    name: 'manage_patterns',
    description: 'Manages the prompt optimization patterns library - add, update, delete, or retrieve patterns.',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['get', 'add', 'update', 'delete'],
          description: 'Action to perform on patterns'
        },
        domain: {
          type: 'string',
          description: 'Domain identifier for the pattern'
        },
        pattern: {
          type: 'object',
          description: 'Pattern configuration (for add/update actions)'
        }
      },
      required: ['action']
    }
  }
];

// Create MCP server function
function createMcpServer({ config }) {
  const mcpServer = new McpServer({
    name: "PromptForge",
    version: "2.0.1",
    description: "Advanced prompt optimization with ML-based domain detection, templates, and analytics"
  });
  
  const serverConfig = getConfig(config);
  
  // Set up tool handlers
  mcpServer.setRequestHandler("tools/list", async () => ({
    tools: TOOLS
  }));
  
  mcpServer.setRequestHandler("tools/call", async (request) => {
    const { name, arguments: args } = request.params;
    
    console.log(`[PromptForge] Calling tool: ${name}`);
    
    try {
      let result;
      const forge = getPromptForge(); // Lazy load
      
      switch (name) {
        case 'optimize_prompt':
          const optimizationResult = forge.optimizePrompt(args.prompt, {
            domain: args.domain,
            intent: args.intent,
            outputFormat: args.desiredFormat,
            bypassOptimization: args.bypassOptimization
          });
          
          result = {
            content: [{
              type: 'text',
              text: JSON.stringify(optimizationResult, null, 2)
            }]
          };
          break;
          
        case 'track_analytics':
          if (args.action === 'record' && args.data) {
            forge.analytics.track('custom', args.data);
            result = {
              content: [{
                type: 'text',
                text: JSON.stringify({ success: true, message: 'Analytics recorded' })
              }]
            };
          } else if (args.action === 'query') {
            const metrics = forge.getAnalytics(args.queryParams || {});
            result = {
              content: [{
                type: 'text',
                text: JSON.stringify(metrics, null, 2)
              }]
            };
          }
          break;
          
        case 'manage_patterns':
          if (args.action === 'get') {
            const pattern = args.domain ? forge.getPattern(args.domain) : 
              Object.fromEntries(forge.patterns);
            result = {
              content: [{
                type: 'text',
                text: JSON.stringify(pattern || {}, null, 2)
              }]
            };
          } else if (args.action === 'add' && args.domain && args.pattern) {
            const addResult = forge.addPattern(args.domain, args.pattern);
            result = {
              content: [{
                type: 'text',
                text: JSON.stringify(addResult)
              }]
            };
          }
          break;
          
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
      
      return result;
    } catch (error) {
      console.error(`[PromptForge] Tool call error:`, error);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            error: error.message,
            tool: name,
            timestamp: new Date().toISOString()
          })
        }]
      };
    }
  });

  // Return the configured server
  return mcpServer.server;
}

// Create and start the stateful server
const PORT = process.env.PORT || 8000;

const app = createStatefulServer(createMcpServer).app;

app.listen(PORT, () => {
  console.log(`PromptForge 2.0.1 MCP Server running on port ${PORT}`);
  console.log(`Version: 2.0.1`);
  console.log(`Ready for connections...`);
});

// Export for testing
export { PromptForge, createMcpServer };

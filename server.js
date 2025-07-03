// promptforge-mcp server.js
// Intelligent prompt optimization server for mcpify.ai

require('dotenv').config();
const fetch = require('node-fetch').default;

class PromptForgeMCPServer {
  constructor() {
    this.name = "promptforge";
    this.version = "1.0.0";
    this.description = "Intelligent prompt optimization with external service integration";
    
    // Cache for patterns to reduce API calls
    this.patternsCache = null;
    this.cacheExpiry = null;
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    
    // Validate environment variables
    this.validateEnvironment();
  }
  
  validateEnvironment() {
    const required = [
      'PATTERNS_API_ENDPOINT',
      'PATTERNS_API_KEY',
      'ANALYTICS_API_ENDPOINT',
      'ANALYTICS_API_KEY'
    ];
    
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
      console.warn(`Warning: Missing environment variables: ${missing.join(', ')}`);
    }
  }

  // Tool definitions for mcpify.ai
  getTools() {
    return [
      {
        name: "optimize_prompt",
        description: "Optimize a prompt using intelligent pattern matching",
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "The original prompt to optimize"
            },
            domain: {
              type: "string",
              description: "Domain context (marketing, data_analysis, tax_accounting, etc.)",
              enum: ["marketing_copy", "data_analysis", "tax_accounting", "code_generation", "general"]
            },
            context: {
              type: "object",
              description: "Additional context for optimization",
              properties: {
                company: { type: "string" },
                industry: { type: "string" },
                audience: { type: "string" },
                tone: { type: "string", enum: ["professional", "casual", "technical", "persuasive"] },
                goals: { type: "string" }
              }
            },
            recordAnalytics: {
              type: "boolean",
              description: "Whether to record analytics for this optimization",
              default: true
            },
            forceOptimize: {
              type: "boolean",
              description: "Force optimization even with low confidence",
              default: false
            }
          },
          required: ["prompt"]
        }
      },
      {
        name: "get_patterns",
        description: "Retrieve current optimization patterns",
        inputSchema: {
          type: "object",
          properties: {
            domain: {
              type: "string",
              description: "Filter patterns by domain (optional)"
            },
            forceRefresh: {
              type: "boolean",
              description: "Force refresh from API, bypassing cache",
              default: false
            }
          }
        }
      },
      {
        name: "update_pattern",
        description: "Update or add a pattern in the library",
        inputSchema: {
          type: "object",
          properties: {
            domain: {
              type: "string",
              description: "Domain identifier for the pattern"
            },
            pattern: {
              type: "object",
              properties: {
                triggerKeywords: {
                  type: "array",
                  items: { type: "string" },
                  description: "Keywords that trigger this pattern"
                },
                enhancements: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: {
                        type: "string",
                        enum: ["role_addition", "context_injection", "format_suggestion", "constraint_addition"]
                      },
                      value: { type: "string" }
                    }
                  }
                }
              }
            }
          },
          required: ["domain", "pattern"]
        }
      },
      {
        name: "get_analytics_summary",
        description: "Get analytics summary for optimizations",
        inputSchema: {
          type: "object",
          properties: {
            timeRange: {
              type: "string",
              description: "Time range for analytics",
              enum: ["today", "week", "month", "all"],
              default: "week"
            },
            domain: {
              type: "string",
              description: "Filter by domain (optional)"
            }
          }
        }
      },
      {
        name: "test_optimization",
        description: "Test optimization with before/after comparison",
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "Prompt to test"
            },
            showDiff: {
              type: "boolean",
              description: "Show detailed differences",
              default: true
            }
          },
          required: ["prompt"]
        }
      }
    ];
  }

  // Main tool handler for mcpify.ai
  async handleToolCall(name, args) {
    try {
      switch (name) {
        case "optimize_prompt":
          return await this.optimizePrompt(args);
        case "get_patterns":
          return await this.getPatterns(args);
        case "update_pattern":
          return await this.updatePattern(args);
        case "get_analytics_summary":
          return await this.getAnalyticsSummary(args);
        case "test_optimization":
          return await this.testOptimization(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Core optimization logic
  async optimizePrompt(args) {
    const { prompt, domain, context, recordAnalytics, forceOptimize } = args;
    
    // Load patterns
    const patterns = await this.loadPatterns();
    
    // Determine domain if not specified
    const detectedDomain = domain || this.detectDomain(prompt, patterns);
    
    // Get pattern for domain
    const pattern = patterns[detectedDomain] || patterns.general;
    
    // Calculate confidence
    const confidence = this.calculateConfidence(prompt, pattern);
    
    // Check if we should optimize
    if (!forceOptimize && confidence < 0.3) {
      return {
        success: true,
        optimized: false,
        original: prompt,
        reason: "Low confidence in optimization benefit",
        confidence: confidence,
        domain: detectedDomain
      };
    }
    
    // Build optimized prompt
    const optimized = this.buildOptimizedPrompt(prompt, pattern, context);
    
    // Record analytics if requested
    if (recordAnalytics && process.env.ANALYTICS_API_ENDPOINT) {
      await this.recordAnalytics({
        originalPrompt: prompt,
        optimizedPrompt: optimized.prompt,
        domain: detectedDomain,
        confidence: confidence,
        modifications: optimized.modifications,
        context: context
      });
    }
    
    return {
      success: true,
      optimized: true,
      original: prompt,
      enhanced: optimized.prompt,
      domain: detectedDomain,
      confidence: confidence,
      modifications: optimized.modifications,
      explanation: optimized.explanation
    };
  }
  
  // Test optimization
  async testOptimization(args) {
    const { prompt, showDiff } = args;
    
    // Run optimization with analytics disabled
    const result = await this.optimizePrompt({
      prompt: prompt,
      recordAnalytics: false,
      forceOptimize: true
    });
    
    const response = {
      original: prompt,
      optimized: result.enhanced || result.original,
      domain: result.domain,
      confidence: result.confidence,
      wasOptimized: result.optimized
    };
    
    if (showDiff && result.optimized) {
      response.comparison = {
        originalLength: prompt.length,
        optimizedLength: response.optimized.length,
        lengthIncrease: `${Math.round((response.optimized.length / prompt.length - 1) * 100)}%`,
        modifications: result.modifications
      };
    }
    
    return response;
  }

  // Pattern management
  async loadPatterns(forceRefresh = false) {
    // Check cache
    if (!forceRefresh && this.patternsCache && this.cacheExpiry > Date.now()) {
      return this.patternsCache;
    }
    
    try {
      if (!process.env.PATTERNS_API_ENDPOINT) {
        throw new Error('Patterns API endpoint not configured');
      }
      
      const response = await fetch(process.env.PATTERNS_API_ENDPOINT, {
        headers: {
          'X-Master-Key': process.env.PATTERNS_API_KEY,
          'X-Bin-Meta': 'false'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load patterns: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update cache
      this.patternsCache = data;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;
      
      return data;
    } catch (error) {
      console.error('Error loading patterns:', error);
      // Fallback to default patterns
      return this.getDefaultPatterns();
    }
  }

  async getPatterns(args) {
    const { domain, forceRefresh } = args;
    const patterns = await this.loadPatterns(forceRefresh);
    
    if (domain) {
      return {
        success: true,
        domain: domain,
        pattern: patterns[domain] || null
      };
    }
    
    return {
      success: true,
      patterns: patterns,
      count: Object.keys(patterns).length
    };
  }
  
  async updatePattern(args) {
    const { domain, pattern } = args;
    
    if (!process.env.PATTERNS_API_ENDPOINT) {
      return {
        success: false,
        error: "Pattern storage not configured"
      };
    }
    
    // Load current patterns
    const patterns = await this.loadPatterns(true);
    
    // Update pattern
    patterns[domain] = pattern;
    
    // Save to JSONBin
    try {
      const response = await fetch(process.env.PATTERNS_API_ENDPOINT, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': process.env.PATTERNS_API_KEY
        },
        body: JSON.stringify(patterns)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update patterns: ${response.status}`);
      }
      
      // Clear cache
      this.patternsCache = null;
      
      return {
        success: true,
        message: `Pattern for ${domain} updated successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Analytics integration
  async recordAnalytics(data) {
    try {
      const response = await fetch(process.env.ANALYTICS_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.ANALYTICS_API_KEY,
          'Authorization': `Bearer ${process.env.ANALYTICS_API_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          ...data,
          user_feedback: null,
          performance_metrics: null,
          created_at: new Date().toISOString()
        })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Analytics recording failed:', error);
      return false;
    }
  }
  
  async getAnalyticsSummary(args) {
    const { timeRange, domain } = args;
    
    if (!process.env.ANALYTICS_API_ENDPOINT) {
      return {
        success: false,
        error: "Analytics not configured"
      };
    }
    
    // Calculate date range
    const now = new Date();
    let fromDate = new Date();
    
    switch (timeRange) {
      case 'today':
        fromDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        fromDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        fromDate.setMonth(now.getMonth() - 1);
        break;
      default:
        fromDate = new Date(0); // All time
    }
    
    // Build query
    let query = `created_at=gte.${fromDate.toISOString()}`;
    if (domain) {
      query += `&domain=eq.${domain}`;
    }
    
    try {
      const response = await fetch(`${process.env.ANALYTICS_API_ENDPOINT}?${query}`, {
        headers: {
          'apikey': process.env.ANALYTICS_API_KEY,
          'Authorization': `Bearer ${process.env.ANALYTICS_API_KEY}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Calculate summary statistics
      const summary = {
        totalOptimizations: data.length,
        averageConfidence: data.length > 0 
          ? (data.reduce((sum, item) => sum + item.confidence, 0) / data.length).toFixed(2)
          : 0,
        domainBreakdown: {},
        timeRange: timeRange,
        fromDate: fromDate.toISOString(),
        toDate: now.toISOString()
      };
      
      // Domain breakdown
      data.forEach(item => {
        summary.domainBreakdown[item.domain] = (summary.domainBreakdown[item.domain] || 0) + 1;
      });
      
      return {
        success: true,
        ...summary
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timeRange: timeRange
      };
    }
  }

  // Helper methods
  detectDomain(prompt, patterns) {
    const promptLower = prompt.toLowerCase();
    let bestMatch = 'general';
    let highestScore = 0;
    
    for (const [domain, pattern] of Object.entries(patterns)) {
      const keywords = pattern.triggerKeywords || [];
      const matchCount = keywords.filter(keyword => promptLower.includes(keyword)).length;
      const score = keywords.length > 0 ? matchCount / keywords.length : 0;
      
      if (score > highestScore && score > 0.3) {
        highestScore = score;
        bestMatch = domain;
      }
    }
    
    return bestMatch;
  }
  
  calculateConfidence(prompt, pattern) {
    const promptLower = prompt.toLowerCase();
    const keywords = pattern.triggerKeywords || [];
    const matchCount = keywords.filter(keyword => promptLower.includes(keyword)).length;
    
    // Base confidence on keyword matches
    let confidence = keywords.length > 0 ? matchCount / keywords.length : 0.5;
    
    // Adjust for prompt length (longer prompts = slightly lower confidence)
    const wordCount = prompt.split(' ').length;
    const lengthFactor = Math.min(1, 50 / wordCount);
    confidence = confidence * 0.8 + lengthFactor * 0.2;
    
    return Math.round(confidence * 100) / 100;
  }

  buildOptimizedPrompt(originalPrompt, pattern, context) {
    const modifications = [];
    let optimizedPrompt = "";
    
    // Apply enhancements
    pattern.enhancements.forEach(enhancement => {
      switch (enhancement.type) {
        case 'role_addition':
          optimizedPrompt += enhancement.value + "\n\n";
          modifications.push({ 
            type: 'role_addition', 
            description: 'Added expert role context'
          });
          break;
          
        case 'context_injection':
          if (context && Object.keys(context).length > 0) {
            const contextParts = [];
            if (context.company) contextParts.push(`Company: ${context.company}`);
            if (context.industry) contextParts.push(`Industry: ${context.industry}`);
            if (context.audience) contextParts.push(`Target Audience: ${context.audience}`);
            if (context.tone) contextParts.push(`Tone: ${context.tone}`);
            if (context.goals) contextParts.push(`Goals: ${context.goals}`);
            
            if (contextParts.length > 0) {
              const contextStr = contextParts.join('\n');
              optimizedPrompt += `Context:\n${contextStr}\n\n`;
              modifications.push({ 
                type: 'context_injection', 
                description: 'Added business context'
              });
            }
          }
          break;
      }
    });
    
    // Add original prompt
    optimizedPrompt += `Request: ${originalPrompt}\n\n`;
    
    // Add format suggestions
    const formatSuggestion = pattern.enhancements.find(e => e.type === 'format_suggestion');
    if (formatSuggestion) {
      optimizedPrompt += formatSuggestion.value;
      modifications.push({ 
        type: 'format_suggestion', 
        description: 'Added output structure guidance'
      });
    }
    
    // Add constraints if any
    const constraints = pattern.enhancements.find(e => e.type === 'constraint_addition');
    if (constraints) {
      optimizedPrompt += "\n\n" + constraints.value;
      modifications.push({ 
        type: 'constraint_addition', 
        description: 'Added quality constraints'
      });
    }
    
    return {
      prompt: optimizedPrompt.trim(),
      modifications: modifications,
      explanation: `Applied ${modifications.length} enhancements based on ${pattern.name || 'detected'} pattern`
    };
  }

  getDefaultPatterns() {
    return {
      marketing_copy: {
        name: "Marketing Copy",
        triggerKeywords: ["write", "create", "generate", "copy", "content", "marketing", "email", "landing", "ad"],
        enhancements: [
          { 
            type: "role_addition", 
            value: "You are an expert copywriter with 10+ years experience in conversion optimization and brand messaging." 
          },
          { 
            type: "format_suggestion", 
            value: "Structure your response with:\n1. Attention-grabbing headline\n2. Problem identification\n3. Solution presentation\n4. Social proof/benefits\n5. Clear call-to-action\n\nUse active voice, focus on benefits over features, and keep sentences concise and scannable." 
          }
        ]
      },
      data_analysis: {
        name: "Data Analysis",
        triggerKeywords: ["analyze", "data", "metrics", "insights", "report", "statistics", "performance"],
        enhancements: [
          { 
            type: "role_addition", 
            value: "You are a data analyst expert skilled in extracting actionable insights from complex data." 
          },
          { 
            type: "format_suggestion", 
            value: "Provide your analysis in this structure:\n1. Executive Summary (key takeaways)\n2. Data Overview\n3. Key Findings (with supporting data)\n4. Actionable Recommendations\n5. Next Steps\n\nSupport all claims with specific data points." 
          }
        ]
      }
    };
  }
}

// Default patterns for different domains
const DEFAULT_PATTERNS = {
  marketing_copy: {
    name: "Marketing Copy",
    triggerKeywords: ["write", "create", "generate", "copy", "content", "marketing", "email", "landing", "ad"],
    enhancements: [
      { 
        type: "role_addition", 
        value: "You are an expert copywriter with 10+ years experience in conversion optimization and brand messaging." 
      },
      { 
        type: "format_suggestion", 
        value: "Structure your response with:\n1. Attention-grabbing headline\n2. Problem identification\n3. Solution presentation\n4. Social proof/benefits\n5. Clear call-to-action\n\nUse active voice, focus on benefits over features, and keep sentences concise and scannable." 
      }
    ]
  },
  tax_accounting: {
        name: "Tax & Accounting",
        triggerKeywords: ["tax", "accounting", "CPA", "financial", "bookkeeping", "IRS", "deduction", "audit"],
        enhancements: [
          { 
            type: "role_addition", 
            value: "You are a certified tax professional with expertise in mid-market business taxation and comprehensive financial planning." 
          },
          { 
            type: "format_suggestion", 
            value: "Structure your response to address:\n1. Current situation/challenge\n2. Tax implications and compliance requirements\n3. Optimization opportunities\n4. Recommended approach\n5. Potential savings/benefits\n6. Next steps\n\nEnsure accuracy and highlight both risks and opportunities." 
          },
          {
            type: "context_injection",
            value: "Consider current tax regulations and best practices for business financial management."
          }
        ]
      },
      code_generation: {
        name: "Code Generation",
        triggerKeywords: ["code", "function", "implement", "program", "script", "algorithm", "debug", "fix"],
        enhancements: [
          { 
            type: "role_addition", 
            value: "You are an experienced software engineer focused on writing clean, efficient, and maintainable code." 
          },
          { 
            type: "format_suggestion", 
            value: "Provide:\n1. Complete code implementation\n2. Clear comments explaining the logic\n3. Usage example\n4. Key considerations/edge cases\n5. Error handling approach\n\nFollow best practices for the language and include necessary imports." 
          }
        ]
      },
      general: {
        name: "General",
        triggerKeywords: [],
        enhancements: [
          { 
            type: "role_addition", 
            value: "You are a helpful AI assistant with broad knowledge across many domains." 
          },
          { 
            type: "format_suggestion", 
            value: "Please provide a clear, comprehensive, and well-structured response." 
          }
        ]
      }
    };

// Export for mcpify.ai
module.exports = PromptForgeMCPServer;

// For local testing
if (require.main === module) {
  const server = new PromptForgeMCPServer();
  console.log('PromptForge MCP Server initialized');
  console.log('Available tools:', server.getTools().map(t => t.name));
}

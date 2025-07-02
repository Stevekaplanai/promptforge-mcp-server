# Changelog

All notable changes to the PromptForge MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-01-15

### 🎉 Major Release

This is a complete rewrite of PromptForge with advanced AI capabilities and professional-grade features.

### Added

#### Core Features
- **ML-Based Domain Detection**: Intelligent automatic detection of prompt domains using weighted scoring and feature extraction
- **Advanced Pattern Management**: Full CRUD operations for domain-specific optimization patterns
- **Analytics Engine**: Comprehensive tracking of optimization performance with metrics and reporting
- **Feedback Learning System**: AI learns from user feedback to improve future optimizations
- **Template System**: Pre-built templates for common use cases (problem-solution, marketing-campaign)

#### Domain Support
- **Programming Domain**: Enhanced support for code generation, debugging, and API design
- **CPA Marketing Domain**: Specialized patterns for tax planning and accounting services (optimized for Schapira CPA)
- **AI Automation Domain**: PPC campaigns, SEO optimization, and marketing automation patterns
- **General Domain**: Universal optimization for any unspecified domain

#### Optimization Features
- **Chain-of-Thought Support**: Add step-by-step reasoning to any prompt
- **Output Formatting**: Automatic formatting for JSON, Markdown, lists, tables, and code
- **Confidence Scoring**: Each optimization includes a calculated confidence score
- **Modification Tracking**: Detailed tracking of all changes made to prompts
- **Example Injection**: Option to include relevant examples in optimized prompts

#### Technical Improvements
- **Modular Architecture**: Separated concerns with dedicated classes for each component
- **Performance Optimization**: Sub-100ms optimization times
- **Memory Efficiency**: Optimized data structures for ~50MB footprint
- **Error Handling**: Comprehensive error handling and validation

### Changed
- Complete rewrite of the optimization engine
- Improved domain detection algorithm with ML capabilities
- Enhanced pattern structure with weighted keywords
- Better analytics tracking with historical data

### Breaking Changes
- Tool parameters have been restructured
- Pattern format has changed significantly
- Analytics API has new structure

## [1.0.2] - 2024-01-10

### Fixed
- Minor bug fixes in prompt processing
- Improved error messages

## [1.0.1] - 2024-01-08

### Fixed
- Configuration loading issues
- Windows path compatibility

## [1.0.0] - 2024-01-05

### Added
- Initial release
- Basic prompt optimization
- Simple pattern matching
- Basic domain support

---

## Upgrade Guide

### From 1.x to 2.0

1. **Update Configuration**: The tool parameters have changed. Update any scripts or configurations that call PromptForge tools.

2. **Pattern Migration**: If you've created custom patterns, they need to be migrated to the new format:
   ```javascript
   // Old format
   {
     keywords: ["tax", "accounting"],
     enhancements: ["Be specific"]
   }
   
   // New format
   {
     triggerKeywords: ["tax", "accounting"],
     keywordWeights: new Map([["tax", 3], ["accounting", 2]]),
     features: ["financial"],
     enhancements: [
       { type: "clarity", value: "Be specific about requirements" }
     ]
   }
   ```

3. **Analytics**: The analytics structure has changed. Update any integrations that consume analytics data.

4. **Tool Names**: Tool names remain the same, but parameters have been enhanced. Review the new parameter options in the README.
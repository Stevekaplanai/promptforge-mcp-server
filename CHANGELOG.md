# Changelog

All notable changes to PromptForge MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.1] - 2025-01-02

### Fixed
- Resolved Smithery deployment timeout issue with lazy loading implementation
- Fixed tool scanning timeout by deferring heavy initialization
- Optimized server startup time for better deployment compatibility

### Changed
- Implemented singleton pattern with lazy initialization for PromptForge instance
- Moved pattern and analytics initialization to on-demand loading
- Simplified server-stdio.js for minimal startup overhead

### Added
- .smitheryrc configuration file for deployment settings
- Proper timeout handling for tool scanning phase

## [2.0.0] - 2025-01-02

### Added
- 🧠 ML-based domain detection with confidence scoring
- 📊 Comprehensive analytics system for tracking optimization performance
- 🎯 Pre-built patterns for specialized domains:
  - Software Development
  - Data Analysis
  - CPA Marketing (specialized for accounting firms)
  - AI Marketing Automation (for performance marketing)
- ⚙️ Advanced optimization options:
  - Chain-of-thought reasoning
  - Example injection
  - Output format control (JSON, XML, Markdown, HTML)
  - Temperature guidance
  - Multi-model optimization profiles
- 📈 Real-time metrics tracking:
  - Total optimizations
  - Domain distribution
  - Confidence scores
  - Modification tracking
- 🔧 Pattern management system:
  - Add custom patterns
  - Update existing patterns
  - Keyword weighting
  - Feature-based matching

### Changed
- Complete rewrite of optimization engine
- Enhanced pattern structure with weights and features
- Improved domain detection algorithm
- Better error handling and logging
- More detailed response metadata

### Improved
- Performance optimization (< 100ms average)
- Domain detection accuracy (94%)
- Pattern matching algorithm
- Analytics data collection
- Documentation and examples

### Breaking Changes
- Pattern structure now requires `enhancements` array
- Response format includes more detailed metadata
- Analytics API has new structure

## [1.0.2] - 2024-12-30

### Added
- Enhanced tool definitions
- Better error handling
- Improved logging

### Fixed
- Tool call response format
- Server stability issues

## [1.0.1] - 2024-12-29

### Added
- Basic analytics tracking
- Pattern retrieval functionality

### Fixed
- Connection issues with MCPify
- Response formatting

## [1.0.0] - 2024-12-28

### Added
- Initial release
- Basic prompt optimization
- Simple pattern system
- MCP server implementation
- Three core tools: optimize_prompt, track_analytics, manage_patterns

---

For more information, visit our [GitHub repository](https://github.com/stevekaplanai/promptforge-mcp-server).
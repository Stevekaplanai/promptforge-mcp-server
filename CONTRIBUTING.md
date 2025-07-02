# Contributing to PromptForge MCP Server

First off, thank you for considering contributing to PromptForge! It's people like you that make PromptForge such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to steve@gtmvp.com.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include your system details (OS, Node.js version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain which behavior you expected to see instead
* Explain why this enhancement would be useful

### Pull Requests

* Fork the repo and create your branch from `main`
* If you've added code that should be tested, add tests
* Ensure the test suite passes
* Make sure your code follows the existing style
* Issue that pull request!

## Development Process

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/promptforge-mcp-server.git`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Install dependencies: `npm install`
5. Make your changes
6. Run tests: `npm test`
7. Commit your changes: `git commit -m 'Add amazing feature'`
8. Push to the branch: `git push origin feature/amazing-feature`
9. Open a Pull Request

## Style Guide

### JavaScript Style Guide

* Use ES6+ features
* Use async/await over promises where possible
* Use meaningful variable and function names
* Add comments for complex logic
* Keep functions focused and small

### Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### Documentation

* Update the README.md with details of changes to the interface
* Update the CHANGELOG.md with your changes
* Comment your code where necessary
* Update the JSDoc comments for any changed functions

## Testing

### Running Tests

```bash
npm test
```

### Writing Tests

* Write tests for any new functionality
* Ensure all tests pass before submitting PR
* Include both positive and negative test cases
* Test edge cases

## Project Structure

```
promptforge-mcp-server/
├── server.js          # Main server implementation
├── server-stdio.js    # STDIO transport entry point
├── test.js           # Test file
├── package.json      # Project configuration
├── README.md         # Project documentation
├── CHANGELOG.md      # Version history
└── LICENSE           # MIT license
```

## Adding New Domains

To add a new domain pattern:

1. Add the pattern in `initializeDefaultPatterns()` method
2. Include trigger keywords and enhancements
3. Add examples in `getExamplesForDomain()`
4. Update documentation

Example:
```javascript
this.patterns.set('medical', {
  triggerKeywords: ['diagnosis', 'treatment', 'symptoms'],
  keywordWeights: new Map([
    ['diagnosis', 3],
    ['treatment', 2]
  ]),
  features: ['medical', 'analytical'],
  enhancements: [
    { type: 'clarity', value: 'Include medical terminology' },
    { type: 'constraint', value: 'Ensure medical accuracy' }
  ]
});
```

## Questions?

Feel free to contact the maintainer at steve@gtmvp.com or open an issue.

Thank you for contributing! 🎉
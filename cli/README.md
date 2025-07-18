# NeuroLint CLI

[![npm version](https://badge.fury.io/js/%40neurolint%2Fcli.svg)](https://badge.fury.io/js/%40neurolint%2Fcli)
[![Repository](https://img.shields.io/badge/Repository-Private-red.svg)](https://github.com/neurolint-pro/neurolint-pro)

> **Advanced rule-based code analysis and transformation tool with NeuroLint Pro integration**

NeuroLint CLI v1.0.4+ now includes integration with NeuroLint Pro for enhanced React/Next.js code analysis and automatic fixing capabilities. Works with both standalone analysis and NeuroLint Pro service.

## Quick Start

```bash
# Install globally
npm install -g @neurolint-pro/cli

# Initialize in your project
neurolint init

# Authenticate (optional, for advanced features)
neurolint login

# Analyze your code
neurolint analyze src/

# Fix issues automatically
neurolint fix src/
```

## Installation

### Global Installation (Recommended)

```bash
npm install -g @neurolint/cli
```

### Local Installation

```bash
# npm
npm install --save-dev @neurolint-pro/cli

# yarn
yarn add --dev @neurolint-pro/cli

# pnpm
pnpm add -D @neurolint-pro/cli
```

### Requirements

- Node.js 16.0.0 or higher
- npm, yarn, or pnpm
- TypeScript 4.5+ (for TypeScript projects)

## Features

### 6-Layer Analysis Engine

- **Layer 1**: Configuration validation (tsconfig, package.json)
- **Layer 2**: Pattern & entity fixes (HTML entities, legacy patterns)
- **Layer 3**: Component best practices (React keys, accessibility)
- **Layer 4**: Hydration & SSR protection
- **Layer 5**: Next.js optimizations (App Router patterns)
- **Layer 6**: Quality & performance (error handling, optimization)

### Smart Code Transformation

- Automatic issue detection and fixing
- Safe transformations with backup support
- Dry-run mode for preview
- Customizable layer selection

## Usage

### Basic Commands

```bash
# Get help
neurolint --help
neurolint help

# Initialize project
neurolint init
neurolint init --force  # Overwrite existing config

# Check project status
neurolint status
neurolint status --detailed

# Analyze code
neurolint analyze src/
neurolint scan components/  # 'scan' is an alias
neurolint analyze --layers=1,2,3
neurolint analyze --output=json

# Fix issues
neurolint fix src/
neurolint fix --dry-run     # Preview changes
neurolint fix --backup      # Create backups
neurolint fix --layers=1,2  # Fix specific layers
```

### Authentication

```bash
# Interactive login
neurolint login

# Login with API key
neurolint login --api-key YOUR_API_KEY

# Custom server
neurolint login --url http://localhost:3000/api
```

### Advanced Options

```bash
# Recursive analysis
neurolint analyze --recursive src/

# Custom file patterns
neurolint analyze --include="**/*.ts,**/*.tsx" --exclude="**/*.test.*"

# Different output formats
neurolint analyze --output=table    # Default
neurolint analyze --output=json     # JSON format
neurolint analyze --output=summary  # Brief summary
```

## Configuration

NeuroLint uses `.neurolint.json` for project configuration:

```json
{
  "version": "1.0.0",
  "layers": {
    "enabled": [1, 2, 3, 4],
    "config": {
      "1": { "name": "Configuration Validation", "timeout": 30000 },
      "2": { "name": "Pattern & Entity Fixes", "timeout": 45000 },
      "3": { "name": "Component Best Practices", "timeout": 60000 },
      "4": { "name": "Hydration & SSR Guard", "timeout": 45000 }
    }
  },
  "files": {
    "include": ["**/*.{ts,tsx,js,jsx}"],
    "exclude": ["node_modules/**", "dist/**", "build/**"]
  },
  "output": {
    "format": "table",
    "verbose": false
  },
  "api": {
    "url": "http://localhost:3000/api",
    "timeout": 60000
  }
}
```

### Environment Variables

```bash
# API Configuration
export NEUROLINT_API_KEY=your_api_key_here
export NEUROLINT_API_URL=http://localhost:3000/api


```

## 🏗️ Framework Support

### React & Next.js

```bash
# React-specific analysis
neurolint analyze --layers=3,4 src/components/

# Next.js optimizations
neurolint analyze --layers=5 src/app/
```

### TypeScript

```bash
# TypeScript configuration validation
neurolint analyze --layers=1 tsconfig.json

# Type-aware analysis
neurolint analyze --recursive src/ --include="**/*.ts,**/*.tsx"
```

### Vue.js & Svelte

```bash
# Vue component analysis
neurolint analyze src/ --include="**/*.vue"

# Svelte component analysis
neurolint analyze src/ --include="**/*.svelte"
```

## Output Examples

### Table Format (Default)

```
┌─────────────────────────────────────────────────┐
│                Analysis Results                 │
├─────────────────────────────────────────────────┤
│ Files analyzed: 42                              │
│ Issues found: 8                                 │
│ Layers used: [1, 2, 3, 4]                      │
├─────────────────────────────────────────────────┤
│ Issues by Layer:                                │
│   Layer 1 (Config): 2 issues                   │
│   Layer 2 (Patterns): 3 issues                 │
│   Layer 3 (Components): 2 issues               │
│   Layer 4 (Hydration): 1 issue                 │
└─────────────────────────────────────────────────┘
```

### JSON Format

```json
{
  "summary": {
    "filesAnalyzed": 42,
    "issuesFound": 8,
    "layersUsed": [1, 2, 3, 4]
  },
  "issues": [
    {
      "layer": 1,
      "file": "tsconfig.json",
      "rule": "typescript-target",
      "severity": "warning",
      "message": "Consider upgrading TypeScript target to ES2022"
    }
  ]
}
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Repository is private - contributions not accepted
# Install from NPM instead:
npm install -g @neurolint/cli

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Start development mode
npm run dev
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Links

- [Website](https://neurolint.dev)
- [Documentation](https://docs.neurolint.dev)
- [API Reference](https://api.neurolint.dev/docs)
- [Support](https://neurolint.dev/support)
- [Discord Community](https://discord.gg/neurolint)

## Support

- Email: support@neurolint.dev
- Discord: [Join our community](https://discord.gg/neurolint)
- Documentation: [docs.neurolint.dev](https://docs.neurolint.dev)
- Issues: [Support Portal](https://neurolint.dev/support)

---

<div align="center">
  <strong>Made by NeuroLint</strong>
</div>

# NeuroLint CLI Testing Guide

## Overview

This guide covers testing the NeuroLint CLI during development and before production deployment.

## Prerequisites

1. Node.js 16+ installed
2. NPM dependencies installed (`npm install`)
3. CLI built (`npm run build`)

## Build Testing

### **Build Verification**

```bash
# Build the CLI
npm run build

# Verify build output
ls -la dist/
cat dist/cli-production.js | head -20
```

### **Installation Testing**

```bash
# Test global installation (optional)
npm link
neurolint --version
neurolint --help

# Clean up
npm unlink
```

## Core Functionality Testing

### **Basic Commands**

```bash
# Test help system
./dist/cli-production.js --help
./dist/cli-production.js help

# Test version
./dist/cli-production.js --version
```

### **Authentication**

```bash
# Test login command
./dist/cli-production.js login --help
./dist/cli-production.js login --api-key test-key

# Test logout
./dist/cli-production.js logout
```

### **Configuration**

```bash
# Test config commands
./dist/cli-production.js config --help
./dist/cli-production.js config --show
./dist/cli-production.js config --set apiUrl=https://api.neurolint.dev
```

### **Project Commands**

```bash
# Test init command
mkdir test-project && cd test-project
../dist/cli-production.js init
cat .neurolint.json

# Test status
../dist/cli-production.js status
```

### **Code Analysis**

```bash
# Test analyze command
echo "const x = 1;" > test.ts
./dist/cli-production.js analyze test.ts
./dist/cli-production.js analyze --help
```

### **Code Fixing**

```bash
# Test fix command
./dist/cli-production.js fix test.ts --dry-run
./dist/cli-production.js fix --help
```

## Interactive Mode Testing

```bash
# Test interactive mode
./dist/cli-production.js interactive

# Test with abbreviated command
./dist/cli-production.js i
```

## Error Handling Testing

```bash
# Test invalid inputs
./dist/cli-production.js invalid-command
./dist/cli-production.js analyze --invalid-option
./dist/cli-production.js fix nonexistent-file.ts
```

## API Integration Testing

### **Mock Server Setup**

```bash
# Start a simple mock server for testing
node -e "
const express = require('express');
const app = express();
app.use(express.json());
app.get('/health', (req, res) => res.json({status: 'ok'}));
app.post('/api/neurolint/analyze', (req, res) => res.json({success: true, changes: []}));
app.listen(3000, () => console.log('Mock server running on port 3000'));
"
```

### **API Commands**

```bash
# Test with mock server
./dist/cli-production.js config --set apiUrl=https://api.neurolint.dev
./dist/cli-production.js analyze test.ts
```

## Production Testing

### **Package Testing**

```bash
# Test as installed package
npm pack
npm install -g neurolint-1.0.0.tgz
neurolint --version
neurolint --help
npm uninstall -g @neurolint/cli
```

### **Cross-Platform Testing**

Test on different operating systems:

- Windows (cmd, PowerShell)
- macOS (Terminal, iTerm)
- Linux (bash, zsh)

## Automated Testing

### **Test Script**

```bash
# Run all tests
npm test

# Or manually:
./dist/cli-production.js --help
./dist/cli-production.js --version
./dist/cli-production.js help
```

### **CI/CD Testing**

```yaml
# Example GitHub Actions test
- name: Test CLI
  run: |
    npm run build
    ./dist/cli-production.js --version
    ./dist/cli-production.js --help
```

## Performance Testing

```bash
# Test with large files
./dist/cli-production.js analyze src/ --recursive
time ./dist/cli-production.js analyze large-file.ts
```

## Security Testing

```bash
# Test input validation
./dist/cli-production.js config --set apiKey="../../../etc/passwd"
./dist/cli-production.js analyze "../../sensitive-file"
```

## Documentation Testing

```bash
# Verify all commands have help
./dist/cli-production.js analyze --help
./dist/cli-production.js fix --help
./dist/cli-production.js config --help
./dist/cli-production.js init --help
./dist/cli-production.js login --help
./dist/cli-production.js status --help
```

## Cleanup

```bash
# Clean up test files
rm -rf test-project/
rm test.ts
rm neurolint-1.0.0.tgz
```

## Expected Behaviors

### ✅ Success Cases

- All commands show help when `--help` is used
- Version command returns correct version
- Config commands properly manage settings
- Authentication commands handle API keys
- Analysis/fix commands work with valid TypeScript files

### ❌ Error Cases

- Unknown commands show helpful error messages
- Invalid options display usage information
- Missing files show clear error messages
- Network errors are handled gracefully

## Troubleshooting

### Common Issues

1. **Command not found**
   - Verify build completed: `ls dist/cli-production.js`
   - Check file permissions: `chmod +x dist/cli-production.js`

2. **Module errors**
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Rebuild: `npm run clean && npm run build`

3. **API connectivity**
   - Check API URL configuration
   - Verify network connectivity
   - Test with mock server

---

**Status**: Production Ready
**Last Updated**: January 2025

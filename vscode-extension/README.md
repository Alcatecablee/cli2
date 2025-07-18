# NeuroLint VS Code Extension

Advanced rule-based code analysis and transformation platform for professional development. Provides comprehensive TypeScript, JavaScript, and React analysis with six-layer transformation engine.

## Features

### Core Analysis Layers

- **Layer 1**: Package scripts and dependencies optimization
- **Layer 2**: TypeScript configuration analysis
- **Layer 3**: Component architecture analysis
- **Layer 4**: Hydration and performance optimization
- **Layer 5**: Next.js specific optimizations
- **Layer 6**: Testing and quality assurance

### Professional Features

- **Real-time Analysis** - Instant feedback as you type
- **File Analysis** - Comprehensive single-file analysis
- **Workspace Analysis** - Project-wide code analysis
- **Automated Fixes** - Apply transformations automatically
- **Detailed Reports** - Comprehensive analysis reports
- **Performance Metrics** - Execution time and impact tracking

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "NeuroLint"
4. Click "Install"

### Manual Installation

1. Download the `.vsix` file from releases
2. Open VS Code
3. Go to Extensions (`Ctrl+Shift+X`)
4. Click the "..." menu and select "Install from VSIX..."
5. Select the downloaded `.vsix` file

## Configuration

### Basic Settings

| Setting                      | Description                  | Default                     |
| ---------------------------- | ---------------------------- | --------------------------- |
| `neurolint.apiUrl`           | NeuroLint API server URL     | `https://api.neurolint.dev` |
| `neurolint.apiKey`           | API key for authentication   | `""`                        |
| `neurolint.enabledLayers`    | Which layers to enable (1-6) | `[1,2,3,4]`                 |
| `neurolint.autoFix`          | Auto-fix on save             | `false`                     |
| `neurolint.showInlineHints`  | Show inline suggestions      | `true`                      |
| `neurolint.diagnosticsLevel` | Diagnostic severity          | `"warning"`                 |

### Advanced Settings

| Setting                               | Description           | Default                   |
| ------------------------------------- | --------------------- | ------------------------- |
| `neurolint.timeout`                   | Request timeout (ms)  | `30000`                   |
| `neurolint.workspace.excludePatterns` | Files to exclude      | `["**/node_modules/**"]`  |
| `neurolint.workspace.includePatterns` | Files to include      | `["**/*.ts", "**/*.tsx"]` |
| `neurolint.workspace.maxFileSize`     | Max file size (bytes) | `10485760`                |
| `neurolint.workspace.maxFiles`        | Max files to analyze  | `1000`                    |

## Commands

### Analysis Commands

| Command                           | Description               | Shortcut       |
| --------------------------------- | ------------------------- | -------------- |
| `NeuroLint: Analyze Current File` | Analyze the active file   | `Ctrl+Shift+L` |
| `NeuroLint: Analyze Workspace`    | Analyze entire workspace  | `Ctrl+Shift+W` |
| `NeuroLint: Fix Current File`     | Fix issues in active file | `Ctrl+Shift+F` |
| `NeuroLint: Configure`            | Open configuration        | -              |

### Utility Commands

| Command                  | Description           |
| ------------------------ | --------------------- |
| `NeuroLint: Show Output` | Open output panel     |
| `NeuroLint: Login`       | Authenticate with API |

## Usage

### Quick Start

1. Install the extension
2. Get your API key from [neurolint.dev](https://neurolint.dev)
3. Configure your API key in settings
4. Open a TypeScript/JavaScript file
5. Use `Ctrl+Shift+L` to analyze the current file

### Authentication

1. Get your API key from the NeuroLint dashboard
2. Set it in VS Code settings:
   ```json
   {
     "neurolint.apiKey": "your-api-key-here"
   }
   ```
3. Or use the command palette: "NeuroLint: Login"

### File Analysis

- **Right-click** any TypeScript/JavaScript file → "Analyze with NeuroLint"
- **Command Palette** → "NeuroLint: Analyze Current File"
- **Keyboard Shortcut** → `Ctrl+Shift+L`

### Workspace Analysis

- **Command Palette** → "NeuroLint: Analyze Workspace"
- **Keyboard Shortcut** → `Ctrl+Shift+W`

### Automated Fixes

- Enable `neurolint.autoFix` to automatically apply fixes on save
- Or use "NeuroLint: Fix Current File" command manually

## Features in Detail

### Real-time Diagnostics

The extension provides real-time diagnostics as you type, highlighting potential issues and suggesting improvements.

### Comprehensive Analysis

- TypeScript configuration optimization
- React component best practices
- Performance optimization suggestions
- Security vulnerability detection
- Code quality improvements

### Professional Integration

- Seamless VS Code integration
- Works with existing linters and formatters
- Respects your project configuration
- Non-intrusive workflow integration

## Troubleshooting

### Common Issues

#### Extension not working

- Verify API key is correct
- Check if API server is accessible
- Ensure user has proper permissions
- Check VS Code output panel for errors

#### Analysis taking too long

- Check network connectivity
- Reduce enabled layers in configuration
- Check if file size exceeds limits
- Verify server status

#### Authentication issues

- Regenerate API key
- Check permissions
- Verify account status

## Support

### Documentation

- **Getting Started**: https://neurolint.dev/docs
- **API Reference**: https://neurolint.dev/api
- **Troubleshooting**: https://neurolint.dev/help

### Contact

- **Support Portal**: https://neurolint.dev/support
- **Email**: support@neurolint.dev
- **Website**: https://neurolint.dev

## Privacy & Security

- Your code is analyzed securely
- No source code stored permanently
- Industry-standard encryption
- GDPR compliance
- Secure API communication

## What's Next

1. **Explore Features**: Try different analysis layers
2. **Integration**: Connect with CI/CD pipeline
3. **Optimization**: Fine-tune settings for your workflow

## License

This extension is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**Developed by NeuroLint**

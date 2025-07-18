# NeuroLint VS Code Extension Development

## Development Setup

### Prerequisites

- Node.js 18+
- VS Code 1.74+
- TypeScript 5.2+

### Installation

```bash
cd vscode-extension
npm install
```

### Development Commands

```bash
# Compile TypeScript
npm run compile

# Watch mode for development
npm run watch

# Build for production
npm run build

# Package extension
npm run package

# Lint and fix code
npm run lint

# Clean build artifacts
npm run clean
```

### Running the Extension

1. Open this folder in VS Code
2. Press `F5` to launch Extension Development Host
3. Or use "Run Extension" from the Run and Debug panel

### Project Structure

```
src/
├── extension.ts              # Main extension entry point
├── utils/
│   ├── ApiClient.ts         # API communication with retry logic
│   └── ConfigurationManager.ts # Settings management
├── providers/
│   ├── NeuroLintProvider.ts      # Core analysis provider
│   ├── DiagnosticProvider.ts     # Real-time diagnostics
│   ├── CodeActionProvider.ts     # Quick fixes
│   ├── HoverProvider.ts          # Hover documentation
│   └── TreeDataProvider.ts      # Explorer view
└── ui/
    ├── StatusBar.ts         # Status bar management
    └── Webview.ts          # Analysis results UI
```

## Key Improvements Made

### 1. API Client Enhancements

- **Retry logic** with exponential backoff
- **Connection status tracking**
- **Request cancellation** to prevent duplicate requests
- **Fallback behavior** when API is unavailable
- **Detailed error messages** with actionable guidance

### 2. Configuration Management

- **Enhanced validation** with warnings and errors
- **API key format validation**
- **Connection testing** before saving settings

### 3. Provider Improvements

- **Memory leak fixes** with proper cache management
- **Adaptive debouncing** based on file size and connection
- **Parallel workspace analysis** with batch processing
- **File size limits** to prevent performance issues
- **Proper disposal** of resources and timers

### 4. Extension Activation

- **Graceful error handling** during activation
- **Async initialization** to avoid blocking startup
- **Connection testing** in background
- **Detailed logging** for debugging

### 5. User Experience

- **Better error messages** with action buttons
- **Status bar improvements** with history tracking
- **Auto-hide timers** for temporary messages
- **Offline mode** with local fallbacks

## Configuration Options

### Basic Settings

```json
{
  "neurolint.apiUrl": "https://api.neurolint.dev",
  "neurolint.apiKey": "your-api-key-here",
  "neurolint.enabledLayers": [1, 2, 3, 4],
  "neurolint.autoFix": false,
  "neurolint.diagnosticsLevel": "warning",
  "neurolint.timeout": 30000
}
```

### Workspace Settings

```json
{
  "neurolint.workspace.maxFileSize": 10485760,
  "neurolint.workspace.maxFiles": 1000,
  "neurolint.workspace.excludePatterns": [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**"
  ],
  "neurolint.workspace.includePatterns": [
    "**/*.ts",
    "**/*.tsx",
    "**/*.js",
    "**/*.jsx"
  ]
}
```

## Error Handling

### Connection Issues

- Automatic retry with exponential backoff
- Graceful degradation to offline mode
- Clear error messages with troubleshooting steps
- Action buttons for quick fixes

### Performance Issues

- File size limits and batch processing
- Request cancellation for rapid changes
- Memory management with cache cleanup
- Adaptive timing based on system performance

### Configuration Problems

- Real-time validation with detailed errors
- API key format checking
- Connection testing before saving
- Warning messages for potential issues

## Testing

### Manual Testing

1. Start NeuroLint server: `npm run dev` (in project root)
2. Launch extension in development mode (F5)
3. Open a TypeScript/JavaScript file
4. Test commands:
   - `Ctrl+Shift+L` - Analyze file
   - `Ctrl+Shift+F` - Fix file
   - `Ctrl+Shift+W` - Analyze workspace

### Error Scenarios

- Disconnect NeuroLint server and test offline behavior
- Use invalid API key and verify error handling
- Test with very large files
- Test rapid file changes (debouncing)

## Debugging

### Output Panel

- View detailed logs: `NeuroLint: Show Output`
- Error messages include stack traces
- API request/response logging
- Performance timing information

### VS Code Developer Tools

- Open Command Palette → "Developer: Reload Window"
- Check Console for JavaScript errors
- Use VS Code's built-in debugging tools

### Common Issues

#### "Cannot connect to server"

1. Verify NeuroLint server is running
2. Check API URL in settings
3. Test connection: Command Palette → "NeuroLint: Configure"

#### "Authentication failed"

1. Verify API key format
2. Test with a fresh API key

#### "Analysis not working"

1. Check enabled layers in settings
2. Verify file types are supported
3. Check file size limits

## Contributing

### Code Style

- Use TypeScript strict mode
- Follow ESLint configuration
- Add JSDoc comments for public methods
- Use meaningful variable names

### Pull Requests

1. Run `npm run lint` before submitting
2. Test with both online and offline scenarios
3. Update documentation for new features
4. Add error handling for new code paths

### Performance Guidelines

- Avoid blocking the main thread
- Use debouncing for frequent operations
- Implement proper cleanup in dispose methods
- Monitor memory usage with large workspaces

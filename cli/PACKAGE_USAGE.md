# NeuroLint CLI Package Usage

## File: `neurolint-cli-1.0.0.npmpackage`

This file is the NPM package for NeuroLint CLI, renamed from `.tgz` to `.npmpackage` for GitHub compatibility.

### To Install Locally:

1. **Rename back to .tgz:**

   ```bash
   mv neurolint-cli-1.0.0.npmpackage neurolint-cli-1.0.0.tgz
   ```

2. **Install from local file:**

   ```bash
   npm install -g ./neurolint-cli-1.0.0.tgz
   ```

3. **Or install directly (npm will auto-detect):**
   ```bash
   npm install -g ./neurolint-cli-1.0.0.npmpackage
   ```

### To Publish to NPM:

1. **Rename back to .tgz:**

   ```bash
   mv neurolint-cli-1.0.0.npmpackage neurolint-cli-1.0.0.tgz
   ```

2. **Publish to NPM registry:**
   ```bash
   npm login
   npm publish neurolint-cli-1.0.0.tgz
   ```

### Package Contents:

- **Premium Features**: Layers 5-6 require Pro plan ($24.99/month)
- **Authentication**: API key required for usage
- **Commands**: analyze, fix, init, login, config, status
- **File Format**: Standard NPM tarball package

### Version: 1.0.0

- Professional CLI without emojis
- Premium feature gating implemented
- Built to `release/` directory (instead of `dist/`)
- Ready for NPM publication

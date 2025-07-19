import { Metadata } from "next";

export the metadata: Metadata = {
  title: "Disabling Fixes - NeuroLint Pro",
  description: "Selectively disable specific fixes and patterns for customized workflows",
};

export default function DisablingFixesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent mb-6">
            Disabling Fixes
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Selectively disable specific fixes and patterns for customized transformation workflows
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Disabling Strategies */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">Disabling Strategies</h2>
            <div className="grid md:grid-cols-3 gap-6">
              
              <div className="bg-black/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-4">Layer Level</h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>�� Skip entire layers</li>
                  <li>• Use --skip-layers flag</li>
                  <li>• Configuration-based disabling</li>
                  <li>• Conditional layer execution</li>
                </ul>
                <div className="mt-4 bg-green-900/20 rounded p-3">
                  <div className="text-green-400 text-xs font-semibold">
                    Best for: Major workflow changes
                  </div>
                </div>
              </div>
              
              <div className="bg-black/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Pattern Level</h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>• Disable specific patterns</li>
                  <li>• Comment out pattern definitions</li>
                  <li>• Conditional pattern application</li>
                  <li>• Pattern-specific flags</li>
                </ul>
                <div className="mt-4 bg-blue-900/20 rounded p-3">
                  <div className="text-blue-400 text-xs font-semibold">
                    Best for: Fine-grained control
                  </div>
                </div>
              </div>
              
              <div className="bg-black/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-400 mb-4">File Level</h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>• Exclude specific files</li>
                  <li>• Use .neurolintignore</li>
                  <li>• File pattern exclusions</li>
                  <li>• Directory-based rules</li>
                </ul>
                <div className="mt-4 bg-purple-900/20 rounded p-3">
                  <div className="text-purple-400 text-xs font-semibold">
                    Best for: Legacy code protection
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Command Line Disabling */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">Command Line Disabling</h2>
            
            <div className="space-y-6">
              
              {/* Skip Layers */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Skip Entire Layers</h3>
                <div className="space-y-3">
                  <div className="bg-black/50 rounded-lg p-4">
                    <code className="text-green-400">npm run fix-all -- --skip-layers 2,3</code>
                    <p className="text-gray-300 text-sm mt-2">Skip pattern standardization and component fixes</p>
                  </div>
                  <div className="bg-black/50 rounded-lg p-4">
                    <code className="text-green-400">node neurolint-pro.js --skip-layers 5,6</code>
                    <p className="text-gray-300 text-sm mt-2">Skip Next.js and testing layers</p>
                  </div>
                  <div className="bg-black/50 rounded-lg p-4">
                    <code className="text-green-400">npm run fix-verbose -- --skip-layers 1</code>
                    <p className="text-gray-300 text-sm mt-2">Skip configuration layer, focus on code fixes</p>
                  </div>
                </div>
              </div>

              {/* Selective Layer Execution */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Selective Layer Execution</h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400">
{`// Run only specific layers
npm run fix-layer-2  # Only pattern standardization
npm run fix-layer-3  # Only component fixes
npm run fix-layer-4  # Only hydration safety

// Programmatic layer selection
const result = await NeuroLintPro(
  code,
  filePath,
  false,
  [2, 4], // Only layers 2 and 4
  { verbose: true }
);`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Configuration-Based Disabling */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">Configuration-Based Disabling</h2>
            
            <div className="space-y-6">
              
              {/* Layer Configuration */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Layer-Level Configuration</h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-blue-400">
{`// neurolint.config.js
module.exports = {
  layers: {
    1: { 
      enabled: true,
      tsTarget: "ES2020" 
    },
    2: { 
      enabled: true,
      emojiMode: "preserve", // Disable emoji standardization
      patterns: {
        "HTML Entity Quotes": true,
        "HTML Entity Ampersands": true,
        "Console Log to Debug": false, // Disable this specific pattern
        "Technical Tool Emojis": false, // Keep technical emojis
        "Comprehensive Emoji Cleanup": false // Disable full emoji removal
      }
    },
    3: { 
      enabled: true,
      addMissingKeys: false, // Disable automatic key prop addition
      accessibilityFixes: true
    },
    4: { 
      enabled: false // Completely disable hydration layer
    },
    5: { 
      enabled: true,
      nextjsVersion: "14",
      clientDirectives: "manual" // Disable automatic 'use client' additions
    },
    6: { 
      enabled: false // Disable testing improvements
    }
  },
  
  // Global disabling options
  disabledPatterns: [
    "React Fragment Shorthand",
    "Default React Import",
    "Any Type Assertions"
  ],
  
  // File-based exclusions
  exclude: [
    "src/legacy/**/*",
    "**/*.generated.ts",
    "**/vendor/**/*"
  ]
};`}
                  </pre>
                </div>
              </div>

              {/* Pattern-Specific Disabling */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Pattern-Specific Configuration</h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-blue-400">
{`// Advanced pattern configuration
module.exports = {
  layers: {
    2: {
      enabled: true,
      customPatterns: {
        // Disable specific emoji categories
        emojiCategories: {
          technical: false,     // Keep 🔧 ⚙️ 🛠️
          performance: false,   // Keep 🚀 ⚡
          documentation: true,  // Remove 📝 📄 📋
          warnings: true,       // Remove ⚠️ ❌
          success: false        // Keep ✅ ✔️
        },
        
        // Pattern-specific settings
        htmlEntities: {
          quotes: true,         // Fix &quot;
          ampersands: true,     // Fix &amp;
          brackets: false,      // Keep &lt; &gt;
          symbols: false        // Keep &copy; &reg;
        },
        
        // Context-aware disabling
        preserveInComments: true,
        preserveInDocstrings: true,
        preserveInTests: false
      }
    }
  }
};`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* File-Level Exclusions */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">File-Level Exclusions</h2>
            
            <div className="space-y-6">
              
              {/* Ignore Files */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">.neurolintignore File</h3>
                <div className="bg-black/50 rounded-lg p-4">
                  <pre className="text-purple-400">
{`# .neurolintignore - Similar to .gitignore syntax

# Ignore legacy code
src/legacy/
src/vendor/
lib/third-party/

# Ignore generated files
**/*.generated.ts
**/*.d.ts
**/dist/**

# Ignore specific file patterns
**/*.min.js
**/*.bundle.js

# Ignore test files (optional)
**/*.test.*
**/*.spec.*
**/tests/**
**/__tests__/**

# Ignore configuration files
*.config.js
*.config.ts

# Ignore documentation that should keep emojis
docs/brand-guidelines.md
README.md
CONTRIBUTING.md

# Ignore files with special formatting requirements
src/ascii-art.ts
src/banner.js`}
                  </pre>
                </div>
              </div>

              {/* Programmatic File Exclusion */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Programmatic File Exclusion</h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-purple-400">
{`// Enhanced file filtering in layer execution
function getFiles(extensions, config = {}) {
  const patterns = extensions.map(ext => \`src/**/*.\${ext}\`);
  let files = [];
  
  patterns.forEach(pattern => {
    files = files.concat(glob.sync(pattern));
  });
  
  // Apply exclusion rules
  files = files.filter(filePath => {
    // Check .neurolintignore
    if (isIgnored(filePath)) {
      console.log(\`📋 Ignored: \${filePath} (in .neurolintignore)\`);
      return false;
    }
    
    // Check config exclusions
    if (config.exclude && config.exclude.some(pattern => 
      minimatch(filePath, pattern))) {
      console.log(\`📋 Excluded: \${filePath} (config rule)\`);
      return false;
    }
    
    // Check file-specific rules
    if (config.fileRules) {
      const rule = config.fileRules.find(r => 
        minimatch(filePath, r.pattern));
      if (rule && rule.disabled) {
        console.log(\`📋 Disabled: \${filePath} (file rule)\`);
        return false;
      }
    }
    
    return true;
  });
  
  return [...new Set(files)];
}

// File-specific layer disabling
function shouldApplyLayerToFile(layerId, filePath, config) {
  const fileRules = config.fileRules || [];
  
  for (const rule of fileRules) {
    if (minimatch(filePath, rule.pattern)) {
      if (rule.disabledLayers && rule.disabledLayers.includes(layerId)) {
        return false;
      }
      if (rule.enabledLayers && !rule.enabledLayers.includes(layerId)) {
        return false;
      }
    }
  }
  
  return true;
}

// Usage in layer execution
const config = {
  fileRules: [
    {
      pattern: "src/legacy/**/*",
      disabledLayers: [2, 3], // No pattern or component fixes for legacy
      reason: "Legacy code should remain unchanged"
    },
    {
      pattern: "src/components/ui/**/*",
      enabledLayers: [3, 6], // Only component and testing fixes for UI
      reason: "UI components need careful handling"
    },
    {
      pattern: "**/*.generated.*",
      disabledLayers: [1, 2, 3, 4, 5, 6], // No fixes for generated files
      reason: "Generated files should not be modified"
    }
  ]
};`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Conditional Disabling */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">Conditional Disabling</h2>
            
            <div className="space-y-6">
              
              {/* Context-Based Disabling */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Context-Based Pattern Disabling</h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-yellow-400">
{`// Enhanced pattern with conditional disabling
const contextAwarePatterns = [
  {
    name: "Console Log Cleanup",
    pattern: /console\\.log\\(/g,
    replacement: "console.debug(",
    fileTypes: ["ts", "tsx", "js", "jsx"],
    
    // Conditional application
    shouldApply: (content, filePath, context) => {
      // Don't apply in development files
      if (filePath.includes('/dev/') || filePath.includes('.dev.')) {
        return false;
      }
      
      // Don't apply in debug utilities
      if (filePath.includes('/debug/') || filePath.includes('logger')) {
        return false;
      }
      
      // Don't apply in files with debug comments
      if (content.includes('// DEBUG:') || content.includes('/* DEBUG')) {
        return false;
      }
      
      // Don't apply in test files with intentional logging
      if (filePath.includes('.test.') && content.includes('expect')) {
        return false;
      }
      
      return true;
    },
    
    description: "Clean up console.log, but preserve in debug contexts"
  },
  
  {
    name: "Emoji Standardization",
    pattern: /[\u{1F600}-\u{1F64F}]/gu,
    replacement: "",
    fileTypes: ["md", "mdx", "tsx", "jsx"],
    
    shouldApply: (content, filePath, context) => {
      // Preserve emojis in brand guidelines
      if (filePath.includes('brand') || filePath.includes('style-guide')) {
        return false;
      }
      
      // Preserve in user-facing content
      if (filePath.includes('/content/') || filePath.includes('/copy/')) {
        return false;
      }
      
      // Preserve in marketing materials
      if (filePath.includes('/marketing/') || filePath.includes('/landing/')) {
        return false;
      }
      
      // Check for explicit preservation comments
      if (content.includes('// preserve-emojis') || 
          content.includes('<!-- keep-emojis -->')) {
        return false;
      }
      
      return true;
    },
    
    description: "Remove emojis except in brand and marketing contexts"
  }
];

// Apply patterns with conditional logic
function applyPatternFixes(filePath, content) {
  let fixedContent = content;
  let changesCount = 0;
  const fileExt = path.extname(filePath).slice(1);
  
  contextAwarePatterns.forEach((pattern) => {
    if (pattern.fileTypes.includes(fileExt)) {
      // Check if pattern should apply to this file
      if (pattern.shouldApply && !pattern.shouldApply(content, filePath, {})) {
        console.log(\`  ⏭️  Skipped \${pattern.name} for \${filePath}\`);
        return;
      }
      
      const before = fixedContent;
      fixedContent = fixedContent.replace(pattern.pattern, pattern.replacement);
      
      if (before !== fixedContent) {
        changesCount++;
        console.log(\`  ✓ Applied \${pattern.name}\`);
      }
    }
  });
  
  return { content: fixedContent, changes: changesCount };
}`}
                  </pre>
                </div>
              </div>

              {/* Environment-Based Disabling */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Environment-Based Disabling</h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-yellow-400">
{`// Environment-specific configuration
function getEnvironmentConfig() {
  const env = process.env.NODE_ENV || 'development';
  const isProduction = env === 'production';
  const isStaging = env === 'staging';
  const isDevelopment = env === 'development';
  
  return {
    layers: {
      1: { enabled: true }, // Always enabled
      2: { 
        enabled: true,
        emojiMode: isProduction ? 'remove' : 'preserve', // Different by env
        consoleCleanup: isProduction // Only clean console in production
      },
      3: { 
        enabled: true,
        strictAccessibility: isProduction || isStaging // Strict a11y for prod/staging
      },
      4: { 
        enabled: !isDevelopment // Skip SSR fixes in development
      },
      5: { 
        enabled: true,
        clientDirectives: isDevelopment ? 'manual' : 'auto' // Auto only in prod
      },
      6: { 
        enabled: isProduction // Testing improvements only for production builds
      }
    },
    
    patterns: {
      strictMode: isProduction,
      developmentHelpers: isDevelopment,
      performanceOptimizations: isProduction || isStaging
    }
  };
}

// Use environment config
const envConfig = getEnvironmentConfig();
const result = await NeuroLintPro(code, filePath, false, null, {
  ...envConfig,
  verbose: process.env.DEBUG === 'true'
});`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Comment-Based Disabling */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">Comment-Based Disabling</h2>
            
            <div className="space-y-6">
              
              {/* Inline Directives */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Inline Disable Directives</h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-cyan-400">
{`// Supported disable comments

// Disable entire file from processing
/* neurolint-disable */

// Disable specific layers for file
/* neurolint-disable layer-2,layer-3 */

// Disable specific patterns
/* neurolint-disable emoji-cleanup,console-fixes */

// Disable for next line only
// neurolint-disable-next-line
console.log("This will be preserved");

// Disable for code block
/* neurolint-disable */
const debugCode = {
  emoji: "🐛",
  log: console.log,
  debug: true
};
/* neurolint-enable */

// Disable specific patterns in block
/* neurolint-disable emoji-cleanup */
const brandContent = "Welcome! 🎉 Join us 🚀";
/* neurolint-enable emoji-cleanup */

// Preserve specific content
const userMessage = "Hello! 👋"; // neurolint-preserve

// Keep original formatting
/* neurolint-preserve-format */
const complexObject = {
  "weird-key": "value",
  emoji: "🔥",
  console: console.log
};
/* neurolint-restore-format */`}
                  </pre>
                </div>
              </div>

              {/* Comment Parser Implementation */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Comment Parser Implementation</h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-cyan-400">
{`class CommentDirectiveParser {
  static parseDisableDirectives(content) {
    const directives = {
      disableFile: false,
      disabledLayers: [],
      disabledPatterns: [],
      preserveBlocks: [],
      disableBlocks: []
    };
    
    const lines = content.split('\\n');
    let currentBlock = null;
    
    lines.forEach((line, index) => {
      // File-level disable
      if (line.includes('neurolint-disable') && !line.includes('layer-') && !line.includes('pattern-')) {
        directives.disableFile = true;
      }
      
      // Layer-specific disable
      const layerMatch = line.match(/neurolint-disable\\s+layer-([\\d,]+)/);
      if (layerMatch) {
        const layers = layerMatch[1].split(',').map(l => parseInt(l.trim()));
        directives.disabledLayers.push(...layers);
      }
      
      // Pattern-specific disable
      const patternMatch = line.match(/neurolint-disable\\s+([^*\\/]+)/);
      if (patternMatch && !patternMatch[1].includes('layer-')) {
        const patterns = patternMatch[1].split(',').map(p => p.trim());
        directives.disabledPatterns.push(...patterns);
      }
      
      // Block disable/enable
      if (line.includes('neurolint-disable') && !line.includes('next-line')) {
        currentBlock = {
          start: index,
          type: 'disable',
          patterns: this.extractPatterns(line)
        };
      } else if (line.includes('neurolint-enable')) {
        if (currentBlock) {
          currentBlock.end = index;
          directives.disableBlocks.push(currentBlock);
          currentBlock = null;
        }
      }
      
      // Preserve blocks
      if (line.includes('neurolint-preserve')) {
        directives.preserveBlocks.push({
          line: index,
          type: 'preserve'
        });
      }
    });
    
    return directives;
  }
  
  static shouldSkipLine(lineNumber, directives) {
    // Check if line is in disabled block
    for (const block of directives.disableBlocks) {
      if (lineNumber >= block.start && lineNumber <= block.end) {
        return true;
      }
    }
    
    // Check preserve blocks
    for (const preserve of directives.preserveBlocks) {
      if (Math.abs(lineNumber - preserve.line) <= 1) {
        return true;
      }
    }
    
    return false;
  }
  
  static shouldSkipPattern(patternName, directives) {
    return directives.disabledPatterns.includes(patternName) ||
           directives.disabledPatterns.includes(patternName.toLowerCase().replace(/\\s+/g, '-'));
  }
}

// Use in pattern application
function applyPatternWithDirectives(filePath, content) {
  const directives = CommentDirectiveParser.parseDisableDirectives(content);
  
  // Skip file entirely if disabled
  if (directives.disableFile) {
    console.log(\`📋 File disabled: \${filePath}\`);
    return { content, changes: 0 };
  }
  
  let fixedContent = content;
  let changesCount = 0;
  const lines = content.split('\\n');
  
  patterns.forEach((pattern) => {
    // Skip if pattern is disabled
    if (directives.shouldSkipPattern(pattern.name, directives)) {
      console.log(\`  ⏭️  Pattern disabled: \${pattern.name}\`);
      return;
    }
    
    // Apply pattern with line-by-line checking
    fixedContent = fixedContent.replace(pattern.pattern, (match, ...args) => {
      const offset = args[args.length - 2]; // Offset is second to last argument
      const lineNumber = content.substring(0, offset).split('\\n').length - 1;
      
      if (CommentDirectiveParser.shouldSkipLine(lineNumber, directives)) {
        return match; // Preserve original
      }
      
      return typeof pattern.replacement === 'function' 
        ? pattern.replacement(match, ...args)
        : pattern.replacement;
    });
  });
  
  return { content: fixedContent, changes: changesCount };
}`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">Disabling Best Practices</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Strategic Disabling</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Use configuration files for consistent rules</li>
                  <li>• Document why specific fixes are disabled</li>
                  <li>• Prefer file-level exclusions over pattern disabling</li>
                  <li>• Test disabled configurations thoroughly</li>
                  <li>• Review disabled rules periodically</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Safety Guidelines</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Never disable safety-critical validations</li>
                  <li>• Use environment-specific disabling carefully</li>
                  <li>• Monitor the impact of disabled fixes</li>
                  <li>• Keep rollback procedures for disabled rules</li>
                  <li>• Validate that builds still work correctly</li>
                </ul>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
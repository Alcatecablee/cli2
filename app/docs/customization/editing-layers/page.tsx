import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editing Layers - NeuroLint Pro",
  description:
    "Modify existing layer logic and create custom transformation workflows",
};

export default function EditingLayersPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent mb-6">
            Editing Layers
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Modify existing layer logic and create custom transformation
            workflows
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Layer Architecture Overview */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Layer Architecture Overview
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Layer Files Structure
                </h3>
                <div className="space-y-3">
                  <div className="bg-black/30 rounded-lg p-4">
                    <code className="text-green-400">
                      fix-layer-1-config.js
                    </code>
                    <p className="text-gray-300 text-sm mt-1">
                      Configuration and build tools
                    </p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <code className="text-green-400">
                      fix-layer-2-patterns.js
                    </code>
                    <p className="text-gray-300 text-sm mt-1">
                      Content patterns and emoji standardization
                    </p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <code className="text-green-400">
                      fix-layer-3-components.js
                    </code>
                    <p className="text-gray-300 text-sm mt-1">
                      React components and JSX fixes
                    </p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <code className="text-green-400">
                      fix-layer-4-hydration.js
                    </code>
                    <p className="text-gray-300 text-sm mt-1">
                      SSR safety and hydration issues
                    </p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <code className="text-green-400">
                      fix-layer-5-nextjs.js
                    </code>
                    <p className="text-gray-300 text-sm mt-1">
                      Next.js App Router optimizations
                    </p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <code className="text-green-400">
                      fix-layer-6-testing.js
                    </code>
                    <p className="text-gray-300 text-sm mt-1">
                      Testing patterns and validation
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Common Layer Structure
                </h3>
                <div className="bg-black/50 rounded-lg p-4">
                  <pre className="text-blue-400 text-sm">
                    {`// Standard layer structure
const patterns = [
  // Pattern definitions
];

const advancedPatterns = [
  // Advanced pattern logic
];

function applyLayerFixes(filePath, content) {
  // Pattern application logic
}

function getFiles(extensions) {
  // File discovery logic
}

async function runLayerFixes() {
  // Main execution logic
}

// Module exports
module.exports = { 
  patterns, 
  applyLayerFixes 
};`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Modifying Existing Layers */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Modifying Existing Layers
            </h2>

            <div className="space-y-6">
              {/* Adding Patterns */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Adding New Patterns to Layer 2
                </h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400">
                    {`// In fix-layer-2-patterns.js
const patterns = [
  // Existing patterns...
  
  // Add your custom patterns here
  {
    name: "Custom CSS Class Migration",
    pattern: /className="old-style-([^"]+)"/g,
    replacement: (match, suffix) => {
      return \`className="new-style-\${suffix}"\`;
    },
    fileTypes: ["tsx", "jsx"],
    description: "Migrate CSS class naming convention"
  },
  
  {
    name: "Environment Variable Updates",
    pattern: /process\\.env\\.OLD_VAR/g,
    replacement: "process.env.NEW_VAR",
    fileTypes: ["ts", "tsx", "js", "jsx"],
    description: "Update environment variable names"
  },
  
  // Custom emoji handling extension
  {
    name: "Company Specific Emojis",
    pattern: /📊|📈|📉/g,
    replacement: (match, offset, string) => {
      // Custom logic for company charts
      const context = string.substring(Math.max(0, offset - 20), offset + 20);
      if (context.includes('dashboard') || context.includes('analytics')) {
        return '[Chart]'; // Professional replacement
      }
      return ''; // Remove elsewhere
    },
    fileTypes: ["md", "mdx", "tsx", "jsx"],
    description: "Handle company-specific chart emojis"
  }
];`}
                  </pre>
                </div>
              </div>

              {/* Modifying Layer Logic */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Customizing Layer 3 Component Logic
                </h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400">
                    {`// In fix-layer-3-components.js

// Add custom component detection
function isCustomComponent(content) {
  return content.includes('CompanyComponent') || 
         content.includes('import { ') && content.includes(' } from "@company/ui"');
}

// Enhanced pattern application
function applyPatternFixes(filePath, content) {
  let fixedContent = content;
  let changesCount = 0;
  const fileExt = path.extname(filePath).slice(1);
  
  // Apply standard patterns
  patterns.forEach((pattern) => {
    if (pattern.fileTypes.includes(fileExt)) {
      const before = fixedContent;
      fixedContent = fixedContent.replace(pattern.pattern, pattern.replacement);
      if (before !== fixedContent) {
        changesCount++;
        console.log(\`  ✓ Applied \${pattern.name}\`);
      }
    }
  });
  
  // Apply company-specific logic
  if (isCustomComponent(fixedContent)) {
    const companyResult = applyCompanyComponentFixes(fixedContent);
    if (companyResult.changed) {
      fixedContent = companyResult.content;
      changesCount += companyResult.changes;
      console.log(\`  ✓ Applied Company Component Fixes\`);
    }
  }
  
  return { content: fixedContent, changes: changesCount };
}

// Company-specific component transformations
function applyCompanyComponentFixes(content) {
  let result = content;
  let changes = 0;
  
  // Custom Button migration
  const buttonPattern = /<CompanyButton\\s+([^>]*?)color="([^"]+)"([^>]*?)>/g;
  result = result.replace(buttonPattern, (match, before, color, after) => {
    changes++;
    return \`<CompanyButton \${before}variant="\${color}"\${after}>\`;
  });
  
  // Custom Form field updates
  const formPattern = /<CompanyInput\\s+([^>]*?)validation="([^"]+)"([^>]*?)>/g;
  result = result.replace(formPattern, (match, before, validation, after) => {
    changes++;
    return \`<CompanyInput \${before}rules={[\${validation}]}\${after}>\`;
  });
  
  return { content: result, changes, changed: changes > 0 };
}`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Creating Custom Layers */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Creating Custom Layers
            </h2>

            <div className="space-y-6">
              {/* Custom Layer Template */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Layer 7: Custom Business Logic
                </h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-purple-400">
                    {`#!/usr/bin/env node

/**
 * Layer 7: Custom Business Logic Transformations
 * Company-specific patterns and business rule enforcement
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('Layer 7: Custom Business Logic Transformations');

// Business rule patterns
const businessPatterns = [
  {
    name: "API Rate Limiting",
    pattern: /fetch\\(([^)]+)\\)/g,
    replacement: (match, url) => {
      // Add rate limiting wrapper
      return \`rateLimitedFetch(\${url})\`;
    },
    fileTypes: ["ts", "tsx", "js", "jsx"],
    description: "Wrap API calls with rate limiting"
  },
  
  {
    name: "Audit Logging",
    pattern: /(delete|remove|destroy)\\s*\\(/gi,
    replacement: (match) => {
      // Add audit logging
      return \`auditLog('\${match.toLowerCase()}'); \${match}(\`;
    },
    fileTypes: ["ts", "tsx"],
    description: "Add audit logging to destructive operations"
  },
  
  {
    name: "Security Header Validation",
    pattern: /const\\s+(\\w+)\\s*=\\s*req\\.headers\\[['"]([^'"]+)['"]\\]/g,
    replacement: (match, varName, headerName) => {
      // Add security validation
      return \`const \${varName} = validateSecureHeader(req.headers['\${headerName}'])\`;
    },
    fileTypes: ["ts", "js"],
    description: "Add security validation to header access"
  }
];

// Advanced business logic patterns
const advancedBusinessPatterns = [
  {
    name: "Data Privacy Compliance",
    test: (content) => content.includes('userEmail') || content.includes('personalData'),
    fix: (content) => {
      // Add privacy compliance checks
      let result = content;
      
      // Wrap PII access with compliance checks
      result = result.replace(
        /(userEmail|personalData|phoneNumber|address)/g,
        (match) => \`privacyCompliant('\${match}')\`
      );
      
      // Add consent verification
      if (result.includes('userEmail')) {
        const consentCheck = \`
if (!hasUserConsent(userId)) {
  throw new PrivacyError('User consent required for email access');
}
\`;
        result = consentCheck + result;
      }
      
      return result;
    },
    fileTypes: ["ts", "tsx"],
    description: "Ensure data privacy compliance"
  }
];

// Business rule validation
function validateBusinessRules(content, filePath) {
  const violations = [];
  
  // Check for direct database access (should use service layer)
  if (/db\\.query|database\\.execute/i.test(content)) {
    violations.push({
      rule: 'Direct database access',
      severity: 'high',
      suggestion: 'Use service layer for database operations'
    });
  }
  
  // Check for hardcoded configuration
  if (/const\\s+\\w+\\s*=\\s*['"][^'"]*localhost[^'"]*['"]/.test(content)) {
    violations.push({
      rule: 'Hardcoded localhost URLs',
      severity: 'medium',
      suggestion: 'Use environment variables for URLs'
    });
  }
  
  // Check for missing error handling
  if (/await\\s+\\w+/.test(content) && !/try\\s*{/.test(content)) {
    violations.push({
      rule: 'Missing error handling for async operations',
      severity: 'medium',
      suggestion: 'Add try-catch blocks for async operations'
    });
  }
  
  return violations;
}

// Apply business transformations
function applyBusinessFixes(filePath, content) {
  let fixedContent = content;
  let changesCount = 0;
  const fileExt = path.extname(filePath).slice(1);
  
  // Validate business rules first
  const violations = validateBusinessRules(content, filePath);
  if (violations.length > 0) {
    console.log(\`  ⚠️  Business rule violations in \${filePath}:\`);
    violations.forEach(v => {
      console.log(\`    - \${v.rule} (\${v.severity}): \${v.suggestion}\`);
    });
  }
  
  // Apply standard business patterns
  businessPatterns.forEach((pattern) => {
    if (pattern.fileTypes.includes(fileExt)) {
      const before = fixedContent;
      fixedContent = fixedContent.replace(pattern.pattern, pattern.replacement);
      if (before !== fixedContent) {
        changesCount++;
        console.log(\`  ✓ Applied \${pattern.name}\`);
      }
    }
  });
  
  // Apply advanced business patterns
  advancedBusinessPatterns.forEach((pattern) => {
    if (pattern.fileTypes.includes(fileExt) && pattern.test(fixedContent)) {
      const before = fixedContent;
      fixedContent = pattern.fix(fixedContent);
      if (before !== fixedContent) {
        changesCount++;
        console.log(\`  ✓ Applied \${pattern.name}\`);
      }
    }
  });
  
  return { content: fixedContent, changes: changesCount };
}

// File processing logic
function getFiles(extensions) {
  const patterns = extensions.map(ext => \`src/**/*.\${ext}\`);
  let files = [];
  
  patterns.forEach(pattern => {
    files = files.concat(glob.sync(pattern));
  });
  
  return [...new Set(files)];
}

// Main execution
async function runLayer7Fixes() {
  const files = getFiles(['ts', 'tsx', 'js', 'jsx']);
  let totalChanges = 0;
  let filesChanged = 0;
  
  console.log(\`📁 Processing \${files.length} files for business logic compliance...\`);
  
  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const { content: fixedContent, changes } = applyBusinessFixes(filePath, content);
      
      if (changes > 0) {
        fs.writeFileSync(filePath, fixedContent);
        filesChanged++;
        totalChanges += changes;
        console.log(\`📝 \${filePath}: \${changes} business fixes applied\`);
      }
    } catch (error) {
      console.error(\`❌ Error processing \${filePath}:\`, error.message);
    }
  }
  
  console.log(\`\\n🎉 Layer 7 completed: \${totalChanges} business fixes applied to \${filesChanged} files\`);
}

// Auto-install dependencies
try {
  require('glob');
} catch (error) {
  console.log('📦 Installing glob dependency...');
  require('child_process').execSync('npm install glob --save-dev', {
    stdio: 'inherit'
  });
}

// Execute if run directly
if (require.main === module) {
  runLayer7Fixes().catch(error => {
    console.error('❌ Layer 7 fixes failed:', error.message);
    process.exit(1);
  });
}

module.exports = { 
  businessPatterns, 
  applyBusinessFixes, 
  validateBusinessRules 
};`}
                  </pre>
                </div>
              </div>

              {/* Integration with Main System */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Integrating Custom Layer with Main System
                </h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-purple-400">
                    {`// In neurolint-pro.js - Add layer 7 support

const LAYER_EXECUTION_ORDER = [
  { id: 1, name: 'Configuration', description: 'Foundation setup' },
  { id: 2, name: 'Entity Cleanup', description: 'Preprocessing patterns' },
  { id: 3, name: 'Components', description: 'React/TS specific fixes' },
  { id: 4, name: 'Hydration', description: 'Runtime safety guards' },
  { id: 5, name: 'Next.js App Router', description: 'Next.js specific optimizations' },
  { id: 6, name: 'Testing & Validation', description: 'Testing patterns and validation' },
  { id: 7, name: 'Business Logic', description: 'Custom business rules and compliance' }, // NEW
];

// Update dependencies
static DEPENDENCIES = {
  1: [],
  2: [1],
  3: [1, 2],
  4: [1, 2, 3],
  5: [1, 2, 3, 4],
  6: [1, 2, 3, 4, 5],
  7: [1, 2, 3, 4, 5, 6], // NEW - depends on all previous layers
};

// Update layer info
static LAYER_INFO = {
  1: { name: 'Configuration', critical: true },
  2: { name: 'Entity Cleanup', critical: false },
  3: { name: 'Components', critical: false },
  4: { name: 'Hydration', critical: false },
  5: { name: 'Next.js App Router', critical: false },
  6: { name: 'Testing & Validation', critical: false },
  7: { name: 'Business Logic', critical: false }, // NEW
};

// Update getLayerName function
function getLayerName(layerId) {
  const names = {
    1: 'config',
    2: 'patterns',
    3: 'components',
    4: 'hydration',
    5: 'nextjs',
    6: 'testing',
    7: 'business', // NEW
  };
  return names[layerId] || 'unknown';
}

// Add to package.json scripts
{
  "scripts": {
    "fix-layer-7": "node fix-layer-7-business.js",
    "fix-all-with-business": "node fix-master.js --layers 1,2,3,4,5,6,7"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Layer Orchestration */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Advanced Layer Orchestration
            </h2>

            <div className="space-y-6">
              {/* Conditional Layer Execution */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Conditional Layer Execution
                </h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400">
                    {`// Enhanced layer orchestration with conditions
async function executeConditionalLayers(code, options = {}) {
  const projectInfo = analyzeProject();
  const layersToRun = [];
  
  // Always run foundation layers
  layersToRun.push(1, 2);
  
  // Conditional layer inclusion
  if (projectInfo.hasReactComponents) {
    layersToRun.push(3);
  }
  
  if (projectInfo.isNextJsProject) {
    layersToRun.push(4, 5); // Hydration + Next.js
  }
  
  if (projectInfo.hasTestFiles) {
    layersToRun.push(6);
  }
  
  if (projectInfo.hasBusinessLogic || options.enforceCompliance) {
    layersToRun.push(7);
  }
  
  // Execute layers with dependencies
  const validatedLayers = LayerDependencyManager.validateAndCorrectLayers(layersToRun);
  return await executeLayers(code, validatedLayers.correctedLayers, options);
}

function analyzeProject() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const files = glob.sync('src/**/*.{ts,tsx,js,jsx}');
  
  return {
    hasReactComponents: packageJson.dependencies?.react || 
                       files.some(f => fs.readFileSync(f, 'utf8').includes('import React')),
    isNextJsProject: packageJson.dependencies?.next || fs.existsSync('next.config.js'),
    hasTestFiles: files.some(f => f.includes('.test.') || f.includes('.spec.')),
    hasBusinessLogic: files.some(f => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('business') || content.includes('compliance') || 
             content.includes('audit') || content.includes('privacy');
    })
  };
}`}
                  </pre>
                </div>
              </div>

              {/* Layer Performance Optimization */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Layer Performance Optimization
                </h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400">
                    {`// Performance-optimized layer execution
class OptimizedLayerExecutor {
  constructor() {
    this.cache = new Map();
    this.stats = {
      cacheHits: 0,
      cacheMisses: 0,
      totalExecutions: 0
    };
  }
  
  async executeLayer(layerId, code, options = {}) {
    this.stats.totalExecutions++;
    
    // Create cache key based on code hash and layer
    const codeHash = this.hashCode(code);
    const cacheKey = \`\${layerId}-\${codeHash}\`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      this.stats.cacheHits++;
      return this.cache.get(cacheKey);
    }
    
    this.stats.cacheMisses++;
    
    // Execute layer transformation
    const startTime = performance.now();
    const result = await this.executeLayerLogic(layerId, code, options);
    const executionTime = performance.now() - startTime;
    
    // Cache result if transformation was successful and significant
    if (result.success && result.changeCount > 0) {
      this.cache.set(cacheKey, result);
      
      // Limit cache size
      if (this.cache.size > 1000) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }
    }
    
    return {
      ...result,
      executionTime,
      cacheStats: this.stats
    };
  }
  
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  }
  
  getPerformanceStats() {
    const hitRate = (this.stats.cacheHits / this.stats.totalExecutions * 100).toFixed(1);
    return {
      ...this.stats,
      hitRate: \`\${hitRate}%\`,
      cacheSize: this.cache.size
    };
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Configuration Management */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Layer Configuration Management
            </h2>

            <div className="space-y-6">
              {/* Configuration Files */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Layer Configuration Files
                </h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-blue-400">
                    {`// neurolint.config.js - Centralized configuration
module.exports = {
  // Global settings
  verbose: false,
  dryRun: false,
  backup: true,
  
  // Layer-specific configuration
  layers: {
    1: {
      enabled: true,
      tsTarget: "ES2020",
      strictMode: true
    },
    2: {
      enabled: true,
      emojiMode: "intelligent", // intelligent, remove, preserve
      preserveRules: ["documentation", "brand-guidelines"],
      customPatterns: "./custom-patterns-layer2.js"
    },
    3: {
      enabled: true,
      addMissingKeys: true,
      keyStrategy: "smart", // smart, uuid, index
      accessibilityLevel: "basic" // basic, strict, full
    },
    4: {
      enabled: true,
      ssrGuards: true,
      hydrationMode: "safe", // safe, permissive, strict
      browserApis: ["localStorage", "sessionStorage", "document", "window"]
    },
    5: {
      enabled: true,
      nextjsVersion: "14",
      appRouter: true,
      clientDirectives: "auto" // auto, manual, strict
    },
    6: {
      enabled: true,
      generateInterfaces: true,
      testPatterns: true,
      accessibilityRules: true
    },
    7: {
      enabled: false, // Custom layer - disabled by default
      businessRules: "./business-rules.js",
      complianceLevel: "standard", // basic, standard, strict
      auditLogging: true
    }
  },
  
  // File targeting
  include: ["src/**/*.{ts,tsx,js,jsx}"],
  exclude: ["**/*.test.*", "**/node_modules/**"],
  
  // Safety settings
  maxFileSize: "1MB",
  timeout: 30000,
  rollbackOnError: true,
  
  // Reporting
  generateReport: true,
  reportFormat: "json", // json, html, markdown
  reportPath: "./neurolint-report"
};`}
                  </pre>
                </div>
              </div>

              {/* Loading Custom Configuration */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Loading and Using Configuration
                </h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-blue-400">
                    {`// Enhanced neurolint-pro.js with configuration support
const fs = require('fs');
const path = require('path');

class ConfigManager {
  static loadConfig(configPath = './neurolint.config.js') {
    try {
      if (fs.existsSync(configPath)) {
        delete require.cache[require.resolve(configPath)];
        return require(configPath);
      }
    } catch (error) {
      console.warn(\`⚠️  Failed to load config from \${configPath}: \${error.message}\`);
    }
    
    // Return default configuration
    return this.getDefaultConfig();
  }
  
  static getDefaultConfig() {
    return {
      verbose: false,
      dryRun: false,
      layers: {
        1: { enabled: true },
        2: { enabled: true, emojiMode: "intelligent" },
        3: { enabled: true, addMissingKeys: true },
        4: { enabled: true, ssrGuards: true },
        5: { enabled: true, appRouter: true },
        6: { enabled: true, generateInterfaces: true }
      }
    };
  }
  
  static mergeWithDefaults(userConfig) {
    const defaultConfig = this.getDefaultConfig();
    return this.deepMerge(defaultConfig, userConfig);
  }
  
  static deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }
}

// Use configuration in layer execution
async function executeLayersWithConfig(code, filePath, options = {}) {
  const config = ConfigManager.loadConfig(options.configPath);
  const mergedConfig = ConfigManager.mergeWithDefaults(config);
  
  // Determine which layers to run based on config
  const enabledLayers = Object.entries(mergedConfig.layers)
    .filter(([layerId, layerConfig]) => layerConfig.enabled)
    .map(([layerId]) => parseInt(layerId));
  
  // Apply global options
  const executionOptions = {
    ...options,
    verbose: mergedConfig.verbose || options.verbose,
    dryRun: mergedConfig.dryRun || options.dryRun,
    backup: mergedConfig.backup,
    timeout: mergedConfig.timeout,
    layerConfigs: mergedConfig.layers
  };
  
  return await executeLayers(code, enabledLayers, executionOptions);
}`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Layer Editing Best Practices
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  Development Guidelines
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    • Always backup original layer files before modifications
                  </li>
                  <li>• Test layer changes on small codebases first</li>
                  <li>• Follow existing layer structure and patterns</li>
                  <li>• Add comprehensive error handling</li>
                  <li>• Document custom patterns and business rules</li>
                  <li>• Use configuration files for flexibility</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  Safety Guidelines
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Never remove existing safety validations</li>
                  <li>• Test with dry run mode extensively</li>
                  <li>• Validate layer dependencies are maintained</li>
                  <li>• Monitor performance impact of changes</li>
                  <li>• Keep rollback procedures documented</li>
                  <li>• Version control all layer modifications</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

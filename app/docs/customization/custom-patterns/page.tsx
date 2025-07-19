import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Patterns - NeuroLint Pro",
  description:
    "Create and implement custom transformation patterns for specific needs",
};

export default function CustomPatternsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent mb-6">
            Custom Patterns
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Extend NeuroLint Pro with custom transformation patterns tailored to
            your specific needs
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Pattern Structure */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Pattern Structure
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Basic Pattern Definition
                </h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400">
                    {`// Basic pattern structure
const customPattern = {
  name: "Custom Fix Name",
  pattern: /search-regex/g,
  replacement: "replacement-string",
  fileTypes: ["ts", "tsx", "js", "jsx"],
  description: "What this pattern fixes",
  category: "your-category"
};

// Advanced pattern with function replacement
const advancedPattern = {
  name: "Context-Aware Fix",
  pattern: /complex-pattern/g,
  replacement: (match, ...groups) => {
    // Custom logic here
    return transformedResult;
  },
  fileTypes: ["tsx", "jsx"],
  test: (content) => {
    // Conditional logic to determine if pattern should apply
    return content.includes('specific-condition');
  },
  validate: (before, after) => {
    // Optional validation logic
    return after.includes('expected-result');
  }
};`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Pattern Properties
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-green-400 mb-3">
                      Required Properties
                    </h4>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li>
                        <code className="text-green-400">name</code>:
                        Descriptive pattern name
                      </li>
                      <li>
                        <code className="text-green-400">pattern</code>: Regex
                        or function for matching
                      </li>
                      <li>
                        <code className="text-green-400">replacement</code>:
                        String or function replacement
                      </li>
                      <li>
                        <code className="text-green-400">fileTypes</code>: Array
                        of file extensions
                      </li>
                    </ul>
                  </div>
                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-400 mb-3">
                      Optional Properties
                    </h4>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li>
                        <code className="text-blue-400">description</code>:
                        Detailed explanation
                      </li>
                      <li>
                        <code className="text-blue-400">category</code>: Pattern
                        grouping
                      </li>
                      <li>
                        <code className="text-blue-400">test</code>: Conditional
                        application
                      </li>
                      <li>
                        <code className="text-blue-400">validate</code>: Result
                        validation
                      </li>
                      <li>
                        <code className="text-blue-400">priority</code>:
                        Execution order
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Layer Integration */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Layer Integration
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Adding Patterns to Existing Layers
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-green-400 mb-3">
                      Layer 2: Pattern Standardization
                    </h4>
                    <div className="bg-black/50 rounded p-4 mb-3">
                      <code className="text-green-400 text-sm">
                        fix-layer-2-patterns.js
                      </code>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">
                      Best for: Content cleanup, text transformations, emoji
                      handling
                    </p>
                    <div className="bg-black/50 rounded-lg p-3">
                      <pre className="text-green-400 text-xs">
                        {`// Add to patterns array
const patterns = [
  // Existing patterns...
  {
    name: "Your Custom Pattern",
    pattern: /your-regex/g,
    replacement: "your-replacement",
    fileTypes: ["ts", "tsx"]
  }
];`}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-400 mb-3">
                      Layer 3: Component Fixes
                    </h4>
                    <div className="bg-black/50 rounded p-4 mb-3">
                      <code className="text-blue-400 text-sm">
                        fix-layer-3-components.js
                      </code>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">
                      Best for: React/JSX transformations, component patterns
                    </p>
                    <div className="bg-black/50 rounded-lg p-3">
                      <pre className="text-blue-400 text-xs">
                        {`// Add to component patterns
const componentPatterns = [
  // Existing patterns...
  {
    name: "Custom Component Fix",
    pattern: /your-jsx-pattern/g,
    replacement: (match, groups) => {
      return improvedJSX;
    },
    fileTypes: ["tsx", "jsx"]
  }
];`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Creating Custom Layer Files
                </h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400">
                    {`// custom-layer-example.js
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Define your custom patterns
const customPatterns = [
  {
    name: "Company Specific Pattern",
    pattern: /oldApiCall\(/g,
    replacement: "newApiCall(",
    fileTypes: ["ts", "tsx", "js", "jsx"],
    description: "Migrate to new API endpoints"
  },
  {
    name: "Legacy Component Migration",
    pattern: /<OldComponent([^>]*)>/g,
    replacement: (match, props) => {
      // Transform props and return new component
      return \`<NewComponent\${props} newProp="default">\`;
    },
    fileTypes: ["tsx", "jsx"],
    description: "Migrate legacy components to new API"
  }
];

// Pattern application logic
function applyCustomPatterns(filePath, content) {
  let fixedContent = content;
  let changesCount = 0;
  const fileExt = path.extname(filePath).slice(1);

  customPatterns.forEach(pattern => {
    if (pattern.fileTypes.includes(fileExt)) {
      const before = fixedContent;
      
      if (typeof pattern.replacement === 'function') {
        fixedContent = fixedContent.replace(pattern.pattern, pattern.replacement);
      } else {
        fixedContent = fixedContent.replace(pattern.pattern, pattern.replacement);
      }
      
      if (before !== fixedContent) {
        changesCount++;
        console.log(\`  ✓ Applied \${pattern.name}\`);
      }
    }
  });

  return { content: fixedContent, changes: changesCount };
}

// File processing
function processFiles() {
  const files = glob.sync('src/**/*.{ts,tsx,js,jsx}');
  
  files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = applyCustomPatterns(filePath, content);
    
    if (result.changes > 0) {
      fs.writeFileSync(filePath, result.content);
      console.log(\`📝 \${filePath}: \${result.changes} fixes applied\`);
    }
  });
}

// Execute if run directly
if (require.main === module) {
  processFiles();
}

module.exports = { customPatterns, applyCustomPatterns };`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Pattern Examples */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Pattern Examples
            </h2>

            <div className="space-y-6">
              {/* Content Transformation */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Content Transformation Patterns
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-green-400 mb-3">
                      Company Branding
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4">
                      <pre className="text-green-400 text-sm">
                        {`{
  name: "Company Name Standardization",
  pattern: /MyCompany|My Company|mycompany/g,
  replacement: "ACME Corp",
  fileTypes: ["md", "mdx", "tsx", "jsx"],
  description: "Standardize company name"
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-green-400 mb-3">
                      URL Standardization
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4">
                      <pre className="text-green-400 text-sm">
                        {`{
  name: "API URL Migration",
  pattern: /https:\\/\\/old-api\\.com/g,
  replacement: "https://api.newdomain.com",
  fileTypes: ["ts", "tsx", "js", "jsx"],
  description: "Migrate API endpoints"
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-green-400 mb-3">
                      License Headers
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4">
                      <pre className="text-green-400 text-sm">
                        {`{
  name: "Add License Header",
  pattern: /^(?!\\/\\* Copyright)/,
  replacement: \`/* Copyright 2024 ACME Corp */
\`,
  fileTypes: ["ts", "tsx", "js", "jsx"],
  test: (content) => !content.startsWith('/*')
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-green-400 mb-3">
                      Comment Standardization
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4">
                      <pre className="text-green-400 text-sm">
                        {`{
  name: "TODO Format Standardization",
  pattern: /\\/\\/ todo:/gi,
  replacement: "// TODO:",
  fileTypes: ["ts", "tsx", "js", "jsx"],
  description: "Standardize TODO format"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Component Patterns */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Component Transformation Patterns
                </h3>
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-400 mb-3">
                      Legacy Component Migration
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-blue-400 text-sm">
                        {`{
  name: "Button Component Migration",
  pattern: /<Button\\s+([^>]*?)type="primary"([^>]*?)>/g,
  replacement: (match, before, after) => {
    // Remove type="primary" and add variant="primary"
    return \`<Button \${before}variant="primary"\${after}>\`;
  },
  fileTypes: ["tsx", "jsx"],
  description: "Migrate Button API from type to variant prop"
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-400 mb-3">
                      Import Path Updates
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-blue-400 text-sm">
                        {`{
  name: "Update Design System Imports",
  pattern: /import\\s+{([^}]+)}\\s+from\\s+['"]@company\\/old-ui['"];?/g,
  replacement: (match, imports) => {
    // Transform import names if needed
    const transformedImports = imports
      .split(',')
      .map(imp => imp.trim().replace('OldButton', 'Button'))
      .join(', ');
    return \`import { \${transformedImports} } from '@company/design-system';\`;
  },
  fileTypes: ["ts", "tsx"],
  description: "Migrate to new design system package"
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-400 mb-3">
                      Hook Pattern Updates
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-blue-400 text-sm">
                        {`{
  name: "useData Hook Migration",
  pattern: /const\\s+(\\w+)\\s+=\\s+useData\\((.*?)\\);/g,
  replacement: (match, varName, args) => {
    // Migrate to new hook API
    return \`const { data: \${varName}, isLoading, error } = useQuery(\${args});\`;
  },
  fileTypes: ["ts", "tsx"],
  description: "Migrate from useData to useQuery hook",
  validate: (before, after) => {
    // Ensure the transformation maintains functionality
    return after.includes('useQuery') && !after.includes('useData');
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Advanced Patterns */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Advanced Pattern Techniques
            </h2>

            <div className="space-y-6">
              {/* Context-Aware Patterns */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Context-Aware Patterns
                </h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-purple-400">
                    {`{
  name: "Conditional API Migration",
  pattern: /oldApiCall\\(([^)]+)\\)/g,
  replacement: (match, args, offset, string) => {
    // Get context around the match
    const context = string.substring(Math.max(0, offset - 100), offset + 100);
    
    // Different replacements based on context
    if (context.includes('async function') || context.includes('await')) {
      return \`await newAsyncApiCall(\${args})\`;
    } else if (context.includes('.then(')) {
      return \`newApiCall(\${args})\`;
    } else {
      return \`newSyncApiCall(\${args})\`;
    }
  },
  fileTypes: ["ts", "tsx"],
  description: "Context-aware API migration based on async patterns"
}`}
                  </pre>
                </div>
              </div>

              {/* File-Specific Patterns */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  File-Specific Patterns
                </h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-purple-400">
                    {`{
  name: "Test File Assertions",
  pattern: /expect\\(([^)]+)\\)\\.toBe\\(true\\)/g,
  replacement: "expect($1).toBeTruthy()",
  fileTypes: ["ts", "tsx"],
  test: (content, filePath) => {
    // Only apply to test files
    return filePath.includes('.test.') || 
           filePath.includes('.spec.') ||
           filePath.includes('__tests__');
  },
  description: "Improve test assertions in test files only"
}`}
                  </pre>
                </div>
              </div>

              {/* Multi-Step Patterns */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Multi-Step Transformations
                </h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-purple-400">
                    {`const multiStepPattern = {
  name: "Component Props Restructure",
  fileTypes: ["tsx", "jsx"],
  
  transform: (content) => {
    let result = content;
    
    // Step 1: Update component interface
    result = result.replace(
      /interface\\s+(\\w+)Props\\s*{[^}]*isVisible:\\s*boolean[^}]*}/g,
      (match, componentName) => {
        return match.replace('isVisible: boolean', 'show: boolean');
      }
    );
    
    // Step 2: Update prop usage
    result = result.replace(
      /{\\s*isVisible\\s*}/g,
      '{ show }'
    );
    
    // Step 3: Update prop references
    result = result.replace(
      /isVisible/g,
      'show'
    );
    
    return result;
  },
  
  description: "Multi-step prop renaming with interface updates"
};`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Testing Patterns */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Testing Custom Patterns
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Pattern Testing Framework
                </h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400">
                    {`// test-custom-patterns.js
const { applyCustomPatterns } = require('./custom-layer-example');

function testPattern(pattern, input, expectedOutput, description) {
  console.log(\`\\n🧪 Testing: \${description}\`);
  
  const result = input.replace(pattern.pattern, pattern.replacement);
  
  if (result === expectedOutput) {
    console.log('✅ PASS: Pattern worked correctly');
    console.log(\`   Input:    "\${input}"\`);
    console.log(\`   Output:   "\${result}"\`);
  } else {
    console.log('❌ FAIL: Pattern did not work as expected');
    console.log(\`   Input:     "\${input}"\`);
    console.log(\`   Expected:  "\${expectedOutput}"\`);
    console.log(\`   Actual:    "\${result}"\`);
  }
}

// Test cases
const testCases = [
  {
    pattern: {
      pattern: /oldApiCall\\(/g,
      replacement: 'newApiCall('
    },
    input: 'const data = oldApiCall(params);',
    expected: 'const data = newApiCall(params);',
    description: 'API call migration'
  },
  {
    pattern: {
      pattern: /<Button\\s+type="primary"/g,
      replacement: '<Button variant="primary"'
    },
    input: '<Button type="primary" onClick={handler}>',
    expected: '<Button variant="primary" onClick={handler}>',
    description: 'Button prop migration'
  }
];

// Run tests
testCases.forEach(test => {
  testPattern(test.pattern, test.input, test.expected, test.description);
});`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Integration Testing
                </h3>
                <div className="bg-black/50 rounded-lg p-4">
                  <pre className="text-green-400">
                    {`// Dry run testing
npm run fix-dry-run --custom-layer=./custom-layer-example.js

// Verbose testing
node custom-layer-example.js --dry-run --verbose

// Test on specific files
node custom-layer-example.js src/components/Button.tsx --dry-run`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Best Practices
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  Pattern Development
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    • Start with simple regex patterns before complex functions
                  </li>
                  <li>
                    • Test patterns on sample files before full deployment
                  </li>
                  <li>• Use descriptive names and detailed descriptions</li>
                  <li>
                    • Include validation logic for critical transformations
                  </li>
                  <li>• Document expected input/output examples</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  Safety Guidelines
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    • Always use version control before running custom patterns
                  </li>
                  <li>• Test with dry run mode first</li>
                  <li>
                    • Validate patterns don't break existing functionality
                  </li>
                  <li>• Include rollback procedures for critical changes</li>
                  <li>• Monitor pattern performance on large codebases</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

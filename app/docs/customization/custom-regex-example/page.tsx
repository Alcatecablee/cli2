import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Regex Examples - NeuroLint Pro",
  description: "Practical examples and patterns for creating powerful regex transformations",
};

export default function CustomRegexExamplePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent mb-6">
            Custom Regex Examples
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Practical examples and patterns for creating powerful regex transformations
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Regex Fundamentals */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">Regex Pattern Fundamentals</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Essential Patterns</h3>
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-4">
                    <code className="text-green-400">/\w+/g</code>
                    <p className="text-gray-300 text-sm mt-1">Match word characters (letters, digits, underscore)</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <code className="text-green-400">/[a-zA-Z0-9]+/g</code>
                    <p className="text-gray-300 text-sm mt-1">Alphanumeric characters only</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <code className="text-green-400">/(?:pattern)/</code>
                    <p className="text-gray-300 text-sm mt-1">Non-capturing group</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <code className="text-green-400">/(?=pattern)/</code>
                    <p className="text-gray-300 text-sm mt-1">Positive lookahead</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Advanced Modifiers</h3>
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-4">
                    <code className="text-blue-400">/pattern/g</code>
                    <p className="text-gray-300 text-sm mt-1">Global match (all occurrences)</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <code className="text-blue-400">/pattern/i</code>
                    <p className="text-gray-300 text-sm mt-1">Case insensitive</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <code className="text-blue-400">/pattern/m</code>
                    <p className="text-gray-300 text-sm mt-1">Multiline mode</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <code className="text-blue-400">/pattern/u</code>
                    <p className="text-gray-300 text-sm mt-1">Unicode mode (for emojis)</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Basic Transformation Examples */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">Basic Transformation Examples</h2>
            
            <div className="space-y-6">
              
              {/* String Replacements */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">String Replacements</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  
                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-green-400 mb-3">API URL Migration</h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-green-400 text-sm">
{`{
  name: "API URL Update",
  pattern: /https:\\/\\/api\\.v1\\.company\\.com/g,
  replacement: "https://api.v2.company.com",
  fileTypes: ["ts", "tsx", "js", "jsx"]
}`}
                      </pre>
                    </div>
                    <div className="text-gray-300 text-sm">
                      <strong>Before:</strong> <code>https://api.v1.company.com/users</code><br/>
                      <strong>After:</strong> <code>https://api.v2.company.com/users</code>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-green-400 mb-3">Environment Variables</h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-green-400 text-sm">
{`{
  name: "Env Var Prefix Update",
  pattern: /process\\.env\\.REACT_APP_/g,
  replacement: "process.env.NEXT_PUBLIC_",
  fileTypes: ["ts", "tsx", "js", "jsx"]
}`}
                      </pre>
                    </div>
                    <div className="text-gray-300 text-sm">
                      <strong>Before:</strong> <code>process.env.REACT_APP_API_KEY</code><br/>
                      <strong>After:</strong> <code>process.env.NEXT_PUBLIC_API_KEY</code>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-green-400 mb-3">Import Path Updates</h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-green-400 text-sm">
{`{
  name: "Package Import Migration",
  pattern: /from ['"]@old-ui\\/([^'"]+)['"]/g,
  replacement: "from '@new-design-system/$1'",
  fileTypes: ["ts", "tsx"]
}`}
                      </pre>
                    </div>
                    <div className="text-gray-300 text-sm">
                      <strong>Before:</strong> <code>from '@old-ui/button'</code><br/>
                      <strong>After:</strong> <code>from '@new-design-system/button'</code>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-green-400 mb-3">CSS Class Migration</h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-green-400 text-sm">
{`{
  name: "CSS Class Update",
  pattern: /className="btn-(\\w+)"/g,
  replacement: 'className="button-$1"',
  fileTypes: ["tsx", "jsx"]
}`}
                      </pre>
                    </div>
                    <div className="text-gray-300 text-sm">
                      <strong>Before:</strong> <code>className="btn-primary"</code><br/>
                      <strong>After:</strong> <code>className="button-primary"</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Advanced Capture Groups */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">Advanced Capture Groups</h2>
            
            <div className="space-y-6">
              
              {/* Complex Transformations */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Complex Component Transformations</h3>
                <div className="space-y-4">
                  
                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-400 mb-3">Button Component Migration</h4>
                    <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-blue-400 text-sm">
{`{
  name: "Button API Migration",
  pattern: /<Button\\s+([^>]*?)type="(primary|secondary|danger)"([^>]*?)>/g,
  replacement: (match, beforeProps, type, afterProps) => {
    // Map old type to new variant
    const variantMap = {
      'primary': 'solid',
      'secondary': 'outline', 
      'danger': 'destructive'
    };
    
    const variant = variantMap[type] || 'solid';
    return \`<Button \${beforeProps}variant="\${variant}"\${afterProps}>\`;
  },
  fileTypes: ["tsx", "jsx"],
  description: "Migrate Button type prop to variant prop with value mapping"
}`}
                      </pre>
                    </div>
                    <div className="text-gray-300 text-sm mt-3">
                      <strong>Before:</strong> <code>&lt;Button size="large" type="primary" onClick={handler}&gt;</code><br/>
                      <strong>After:</strong> <code>&lt;Button size="large" variant="solid" onClick={handler}&gt;</code>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-400 mb-3">Form Field Restructuring</h4>
                    <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-blue-400 text-sm">
{`{
  name: "Form Field Validation Migration",
  pattern: /<Input\\s+([^>]*?)validation="([^"]+)"([^>]*?)>/g,
  replacement: (match, beforeProps, validation, afterProps) => {
    // Convert validation string to rules array
    const rules = validation.split(',').map(rule => {
      const trimmed = rule.trim();
      if (trimmed === 'required') return '{ required: true }';
      if (trimmed.startsWith('min:')) {
        const min = trimmed.split(':')[1];
        return \`{ minLength: \${min} }\`;
      }
      if (trimmed.startsWith('max:')) {
        const max = trimmed.split(':')[1];
        return \`{ maxLength: \${max} }\`;
      }
      return \`{ custom: '\${trimmed}' }\`;
    });
    
    return \`<Input \${beforeProps}rules={[\${rules.join(', ')}]}\${afterProps}>\`;
  },
  fileTypes: ["tsx", "jsx"],
  description: "Convert validation string to rules array object"
}`}
                      </pre>
                    </div>
                    <div className="text-gray-300 text-sm mt-3">
                      <strong>Before:</strong> <code>&lt;Input name="email" validation="required,min:5" /&gt;</code><br/>
                      <strong>After:</strong> <code>&lt;Input name="email" rules={[{`{required: true}, {minLength: 5}`}]} /&gt;</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Function and Hook Transformations */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">Function and Hook Transformations</h2>
            
            <div className="space-y-6">
              
              {/* Hook Migrations */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Hook API Migrations</h3>
                <div className="space-y-4">
                  
                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-purple-400 mb-3">useData to useQuery Migration</h4>
                    <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-purple-400 text-sm">
{`{
  name: "useData Hook Migration",
  pattern: /const\\s+(\\w+)\\s*=\\s*useData\\(([^)]+)\\);/g,
  replacement: (match, varName, params) => {
    // Parse parameters and transform to new API
    const cleanParams = params.trim();
    
    // Generate new destructured pattern
    const newPattern = \`const { 
      data: \${varName}, 
      isLoading: \${varName}Loading, 
      error: \${varName}Error 
    } = useQuery(\${cleanParams});\`;
    
    return newPattern;
  },
  fileTypes: ["ts", "tsx"],
  description: "Migrate useData hook to useQuery with proper destructuring"
}`}
                      </pre>
                    </div>
                    <div className="text-gray-300 text-sm mt-3">
                      <strong>Before:</strong> <code>const userData = useData('/api/user');</code><br/>
                      <strong>After:</strong> 
                      <pre className="text-sm mt-1">
{`const { 
  data: userData, 
  isLoading: userDataLoading, 
  error: userDataError 
} = useQuery('/api/user');`}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-purple-400 mb-3">Async Function Wrapping</h4>
                    <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-purple-400 text-sm">
{`{
  name: "Add Error Handling to Async Functions",
  pattern: /(const\\s+\\w+\\s*=\\s*async\\s*\\([^)]*\\)\\s*=>\\s*{)([\\s\\S]*?)(};?)/g,
  replacement: (match, funcStart, funcBody, funcEnd) => {
    // Check if already has try-catch
    if (funcBody.includes('try') && funcBody.includes('catch')) {
      return match; // Already has error handling
    }
    
    // Wrap function body in try-catch
    const wrappedBody = \`
    try {\${funcBody.replace(/\\n\\s*$/, '')}
    } catch (error) {
      console.error('Function error:', error);
      throw error;
    }
  \`;
    
    return funcStart + wrappedBody + funcEnd;
  },
  fileTypes: ["ts", "tsx", "js", "jsx"],
  description: "Add error handling to async arrow functions"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Context-Aware Patterns */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">Context-Aware Patterns</h2>
            
            <div className="space-y-6">
              
              {/* Conditional Transformations */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Conditional Transformations</h3>
                <div className="space-y-4">
                  
                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-yellow-400 mb-3">Smart API Call Transformation</h4>
                    <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-yellow-400 text-sm">
{`{
  name: "Context-Aware API Migration",
  pattern: /fetch\\(([^)]+)\\)/g,
  replacement: (match, url, offset, string) => {
    // Analyze surrounding context
    const context = string.substring(Math.max(0, offset - 200), offset + 200);
    
    // Check if it's in an async function
    const isInAsyncFunc = /async\\s+function|async\\s*\\(|async\\s+\\w+\\s*=>/.test(
      string.substring(Math.max(0, offset - 500), offset)
    );
    
    // Check if it's already being awaited
    const isAwaited = /await\\s+$/.test(
      string.substring(Math.max(0, offset - 10), offset)
    );
    
    // Check if in a .then() chain
    const isInThenChain = /\\.then\\s*\\(/.test(
      string.substring(offset, Math.min(string.length, offset + 50))
    );
    
    // Determine appropriate replacement
    if (isInAsyncFunc && !isAwaited && !isInThenChain) {
      return \`apiClient.get(\${url})\`; // Use our API client
    } else if (isInThenChain) {
      return \`apiClient.fetch(\${url})\`; // Promise-based API
    } else {
      return \`secureApiCall(\${url})\`; // Secure wrapper
    }
  },
  fileTypes: ["ts", "tsx", "js", "jsx"],
  description: "Smart API call migration based on usage context"
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-yellow-400 mb-3">Conditional Styling Migration</h4>
                    <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-yellow-400 text-sm">
{`{
  name: "Conditional CSS Module Migration",
  pattern: /className=\\{([^}]+)\\}/g,
  replacement: (match, expression, offset, string) => {
    // Check if we're in a CSS Modules file context
    const hasModulesImport = /import\\s+\\w+\\s+from\\s+['"][^'"]*\\.module\\.(css|scss)['"]/.test(string);
    
    if (!hasModulesImport) {
      return match; // Not using CSS Modules, leave as-is
    }
    
    // Transform the expression to use CSS Modules syntax
    let transformedExpr = expression;
    
    // Handle conditional classes: isActive ? 'active' : 'inactive'
    transformedExpr = transformedExpr.replace(
      /'([^']+)'/g, 
      (classMatch, className) => \`styles.\${className}\`
    );
    
    // Handle string literals
    transformedExpr = transformedExpr.replace(
      /"([^"]+)"/g, 
      (classMatch, className) => \`styles.\${className}\`
    );
    
    return \`className={\${transformedExpr}}\`;
  },
  fileTypes: ["tsx", "jsx"],
  description: "Migrate className expressions to CSS Modules syntax when appropriate"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Multi-Step Transformations */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">Multi-Step Transformations</h2>
            
            <div className="space-y-6">
              
              {/* Complex Migrations */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Complex Migration Patterns</h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-orange-400">
{`// Multi-step component migration example
const multiStepMigration = {
  name: "Legacy Component Migration",
  fileTypes: ["tsx", "jsx"],
  
  transform: (content) => {
    let result = content;
    
    // Step 1: Update import statements
    result = result.replace(
      /import\\s+{([^}]+)}\\s+from\\s+['"]@legacy\\/ui['"];?/g,
      (match, imports) => {
        const updatedImports = imports
          .split(',')
          .map(imp => {
            const trimmed = imp.trim();
            // Map legacy component names
            if (trimmed === 'LegacyButton') return 'Button';
            if (trimmed === 'LegacyInput') return 'TextInput';
            if (trimmed === 'LegacyModal') return 'Dialog';
            return trimmed;
          })
          .join(', ');
        
        return \`import { \${updatedImports} } from '@company/design-system';\`;
      }
    );
    
    // Step 2: Update component usage
    result = result.replace(
      /<LegacyButton\\s+([^>]*?)>/g,
      (match, props) => {
        // Transform props
        let transformedProps = props;
        
        // type="primary" -> variant="primary"
        transformedProps = transformedProps.replace(
          /type="([^"]+)"/g, 
          'variant="$1"'
        );
        
        // size="big" -> size="large"
        transformedProps = transformedProps.replace(
          /size="big"/g, 
          'size="large"'
        );
        
        return \`<Button \${transformedProps}>\`;
      }
    );
    
    // Step 3: Update component closing tags
    result = result.replace(/<\\/LegacyButton>/g, '</Button>');
    
    // Step 4: Update LegacyInput components
    result = result.replace(
      /<LegacyInput\\s+([^>]*?)\\/?>/g,
      (match, props) => {
        let transformedProps = props;
        
        // validation="required" -> required={true}
        transformedProps = transformedProps.replace(
          /validation="required"/g, 
          'required={true}'
        );
        
        // error="message" -> error={{message: "message"}}
        transformedProps = transformedProps.replace(
          /error="([^"]+)"/g, 
          'error={{message: "$1"}}'
        );
        
        return \`<TextInput \${transformedProps} />\`;
      }
    );
    
    // Step 5: Update Modal components
    result = result.replace(
      /<LegacyModal\\s+([^>]*?)>/g,
      (match, props) => {
        let transformedProps = props;
        
        // show={visible} -> open={visible}
        transformedProps = transformedProps.replace(
          /show={([^}]+)}/g, 
          'open={$1}'
        );
        
        // onHide={handler} -> onClose={handler}
        transformedProps = transformedProps.replace(
          /onHide={([^}]+)}/g, 
          'onClose={$1}'
        );
        
        return \`<Dialog \${transformedProps}>\`;
      }
    );
    
    result = result.replace(/<\\/LegacyModal>/g, '</Dialog>');
    
    return result;
  },
  
  validate: (before, after) => {
    // Ensure no legacy components remain
    const hasLegacyComponents = /Legacy(Button|Input|Modal)/.test(after);
    return !hasLegacyComponents;
  },
  
  description: "Complete migration from legacy UI components to new design system"
};`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Testing Regex Patterns */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">Testing Regex Patterns</h2>
            
            <div className="space-y-6">
              
              {/* Testing Framework */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Pattern Testing Framework</h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400">
{`// regex-pattern-tester.js
class RegexPatternTester {
  constructor() {
    this.tests = [];
    this.results = [];
  }
  
  addTest(description, pattern, input, expectedOutput, options = {}) {
    this.tests.push({
      description,
      pattern,
      input,
      expectedOutput,
      options
    });
  }
  
  runTests() {
    console.log('🧪 Running Regex Pattern Tests...\\n');
    
    this.tests.forEach((test, index) => {
      console.log(\`Test \${index + 1}: \${test.description}\`);
      
      try {
        let result;
        
        if (typeof test.pattern.replacement === 'function') {
          result = test.input.replace(test.pattern.pattern, test.pattern.replacement);
        } else {
          result = test.input.replace(test.pattern.pattern, test.pattern.replacement);
        }
        
        const passed = result === test.expectedOutput;
        
        if (passed) {
          console.log('✅ PASS');
        } else {
          console.log('❌ FAIL');
          console.log(\`   Expected: "\${test.expectedOutput}"\`);
          console.log(\`   Got:      "\${result}"\`);
        }
        
        this.results.push({
          ...test,
          result,
          passed
        });
        
      } catch (error) {
        console.log(\`❌ ERROR: \${error.message}\`);
        this.results.push({
          ...test,
          error: error.message,
          passed: false
        });
      }
      
      console.log('');
    });
    
    this.printSummary();
  }
  
  printSummary() {
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    
    console.log(\`📊 Summary: \${passed}/\${total} tests passed\`);
    
    if (passed === total) {
      console.log('🎉 All tests passed!');
    } else {
      console.log(\`⚠️  \${total - passed} tests failed\`);
    }
  }
}

// Example usage
const tester = new RegexPatternTester();

// Test button migration
tester.addTest(
  'Button type to variant migration',
  {
    pattern: /<Button\\s+([^>]*?)type="(primary|secondary)"([^>]*?)>/g,
    replacement: (match, before, type, after) => {
      const variantMap = { primary: 'solid', secondary: 'outline' };
      return \`<Button \${before}variant="\${variantMap[type]}"\${after}>\`;
    }
  },
  '<Button size="large" type="primary" onClick={handler}>',
  '<Button size="large" variant="solid" onClick={handler}>'
);

// Test API URL migration
tester.addTest(
  'API URL migration',
  {
    pattern: /https:\\/\\/api\\.v1\\.company\\.com/g,
    replacement: 'https://api.v2.company.com'
  },
  'const url = "https://api.v1.company.com/users";',
  'const url = "https://api.v2.company.com/users";'
);

// Test import path update
tester.addTest(
  'Import path update',
  {
    pattern: /from ['"]@old-ui\\/([^'"]+)['"]/g,
    replacement: "from '@new-design-system/$1'"
  },
  'import { Button } from "@old-ui/button";',
  'import { Button } from "@new-design-system/button";'
);

// Run all tests
tester.runTests();`}
                  </pre>
                </div>
              </div>

              {/* Edge Case Testing */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Edge Case Testing</h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400">
{`// Test edge cases that commonly break regex patterns
const edgeCaseTester = new RegexPatternTester();

// Test multiline scenarios
edgeCaseTester.addTest(
  'Multiline button component',
  {
    pattern: /<Button\\s+([^>]*?)type="primary"([^>]*?)>/g,
    replacement: '<Button $1variant="solid"$2>'
  },
  \`<Button
    size="large"
    type="primary"
    onClick={handler}
  >\`,
  \`<Button
    size="large"
    variant="solid"
    onClick={handler}
  >\`
);

// Test nested quotes
edgeCaseTester.addTest(
  'Nested quotes in attributes',
  {
    pattern: /className="btn-(\\w+)"/g,
    replacement: 'className="button-$1"'
  },
  'className="btn-primary" title="This is a \\"quoted\\" button"',
  'className="button-primary" title="This is a \\"quoted\\" button"'
);

// Test special characters
edgeCaseTester.addTest(
  'Special characters in regex',
  {
    pattern: /\\/\\* TODO: ([^*]+) \\*\\//g,
    replacement: '// TODO: $1'
  },
  '/* TODO: Fix this bug */',
  '// TODO: Fix this bug'
);

// Test greedy vs non-greedy matching
edgeCaseTester.addTest(
  'Non-greedy matching for nested elements',
  {
    pattern: /<div className="old">([\\s\\S]*?)<\\/div>/g,
    replacement: '<div className="new">$1</div>'
  },
  '<div className="old"><p>Content</p></div><div className="other">Other</div>',
  '<div className="new"><p>Content</p></div><div className="other">Other</div>'
);

edgeCaseTester.runTests();`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">Regex Best Practices</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Pattern Writing</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Use non-greedy quantifiers (?) when matching nested content</li>
                  <li>• Escape special characters properly (. * + ? ^ $ { } [ ] \ |)</li>
                  <li>• Use non-capturing groups (?:) when you don't need the capture</li>
                  <li>• Test patterns with multiline and edge case content</li>
                  <li>• Consider using word boundaries (\b) for exact matches</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Performance Tips</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Avoid catastrophic backtracking with nested quantifiers</li>
                  <li>• Use anchors (^ $) when matching entire lines</li>
                  <li>• Place most specific patterns first in alternations</li>
                  <li>• Use character classes instead of multiple alternations</li>
                  <li>• Test patterns on large files to check performance</li>
                </ul>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
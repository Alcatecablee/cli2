import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AST vs Regex Strategy - NeuroLint Pro",
  description:
    "Smart transformation strategy with AST preference and regex fallback",
};

export default function AstVsRegexPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent mb-6">
            AST vs Regex Strategy
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Intelligent transformation strategy with AST preference and graceful
            regex fallback
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Strategy Overview */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Strategy Overview
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Layer Distribution
                </h3>
                <div className="space-y-3">
                  <div className="bg-black/30 rounded-lg p-4">
                    <h4 className="font-semibold text-green-400">
                      Layers 1-2: Regex Only
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Configuration files and simple patterns
                    </p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-400">
                      Layers 3-6: AST + Fallback
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Complex transformations with safety net
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Decision Flow
                </h3>
                <div className="space-y-2 text-gray-300">
                  <div className="flex items-center">
                    <span className="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">
                      1
                    </span>
                    Check if layer supports AST
                  </div>
                  <div className="flex items-center">
                    <span className="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">
                      2
                    </span>
                    Attempt AST transformation
                  </div>
                  <div className="flex items-center">
                    <span className="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">
                      3
                    </span>
                    On failure, use regex fallback
                  </div>
                  <div className="flex items-center">
                    <span className="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">
                      4
                    </span>
                    Validate results and proceed
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* AST Transformations */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              AST Transformations
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  When AST is Used
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-green-400 mb-3">
                      Advantages
                    </h4>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li>• Precise code understanding</li>
                      <li>• Context-aware transformations</li>
                      <li>• Syntax-preserving changes</li>
                      <li>• Type-safe modifications</li>
                      <li>• Complex pattern recognition</li>
                    </ul>
                  </div>
                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-400 mb-3">
                      Use Cases
                    </h4>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li>• Component prop analysis</li>
                      <li>• Import statement optimization</li>
                      <li>• JSX structure modifications</li>
                      <li>• Hook usage patterns</li>
                      <li>• Type annotation updates</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  AST Implementation
                </h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400">
                    {`async function transformWithAST(code, layer) {
  const transformer = new ASTTransformer({
    preserveComments: true,
    plugins: ['typescript', 'jsx']
  });
  
  // Parse code to AST
  const ast = transformer.parse(code);
  if (!ast) {
    throw new Error('Failed to parse code to AST');
  }
  
  // Apply layer-specific AST transformations
  switch (layer.id) {
    case 3:
      await applyComponentTransformations(ast);
      break;
    case 4:
      await applyHydrationTransformations(ast);
      break;
    default:
      throw new Error(\`AST not supported for layer \${layer.id}\`);
  }
  
  // Generate code from modified AST
  return transformer.generate(ast);
}`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Regex Fallback */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Regex Fallback Strategy
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Fallback Triggers
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-red-900/30 border border-red-400 rounded-lg p-4">
                    <h4 className="font-semibold text-red-400 mb-2">
                      Parse Errors
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Invalid syntax preventing AST parsing
                    </p>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-400 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-400 mb-2">
                      Complex Structures
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Code patterns too complex for AST
                    </p>
                  </div>
                  <div className="bg-purple-900/30 border border-purple-400 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-400 mb-2">
                      Performance
                    </h4>
                    <p className="text-gray-300 text-sm">
                      AST processing too slow for file
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Graceful Degradation
                </h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400">
                    {`async function transformWithFallback(code, layer) {
  // Layers 1-2: Always use regex
  if (!layer.supportsAST) {
    return await layer.regexTransform(code);
  }
  
  // Layers 3-6: Try AST first, fallback to regex
  try {
    console.log(\`🌳 Using AST transformation for \${layer.name}\`);
    return await transformWithAST(code, layer);
  } catch (astError) {
    console.warn(
      \`⚠️  AST failed for \${layer.name}, using regex fallback:\`,
      astError.message
    );
    
    // AST failed, use regex-based transformation
    if (layer.regexTransform) {
      return await layer.regexTransform(code);
    } else {
      throw new Error(\`No fallback available for layer \${layer.name}\`);
    }
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Layer-Specific Strategies */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Layer-Specific Strategies
            </h2>

            <div className="space-y-6">
              {/* Layer 1-2 */}
              <div className="bg-black/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Layers 1-2: Regex-Only Approach
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-400 mb-2">
                      Layer 1: Configuration
                    </h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• JSON pattern matching</li>
                      <li>• Simple key-value updates</li>
                      <li>• Configuration file optimization</li>
                      <li>• No complex parsing needed</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-400 mb-2">
                      Layer 2: Pattern Cleanup
                    </h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• HTML entity replacement</li>
                      <li>• Emoji standardization</li>
                      <li>• Simple string transformations</li>
                      <li>• Performance-critical operations</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Layer 3-4 */}
              <div className="bg-black/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Layers 3-4: AST with Regex Fallback
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">
                      Layer 3: Components
                    </h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• AST: Complex JSX analysis</li>
                      <li>• AST: Component prop mapping</li>
                      <li>• Fallback: Simple pattern fixes</li>
                      <li>• Fallback: Basic key prop addition</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">
                      Layer 4: Hydration
                    </h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• AST: Context-aware guards</li>
                      <li>• AST: Scope analysis</li>
                      <li>• Fallback: Basic SSR patterns</li>
                      <li>• Fallback: Simple wrapping</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Layer 5-6 */}
              <div className="bg-black/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Layers 5-6: Advanced AST Operations
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-purple-400 mb-2">
                      Layer 5: Next.js
                    </h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• AST: Import analysis</li>
                      <li>• AST: Directive placement</li>
                      <li>• Fallback: Simple corrections</li>
                      <li>• Fallback: Basic cleanup</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-400 mb-2">
                      Layer 6: Testing
                    </h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• AST: Interface generation</li>
                      <li>• AST: Type enhancement</li>
                      <li>• Fallback: Pattern validation</li>
                      <li>• Fallback: Basic improvements</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Performance Comparison */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Performance Comparison
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-black/30 rounded-lg p-6 text-center">
                <h3 className="text-xl font-semibold text-green-400 mb-4">
                  Regex-Only
                </h3>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  ~50ms
                </div>
                <div className="text-gray-300 text-sm mb-4">
                  Average execution time
                </div>
                <ul className="text-gray-300 text-xs space-y-1">
                  <li>• Ultra-fast processing</li>
                  <li>• Limited transformation scope</li>
                  <li>• High reliability</li>
                </ul>
              </div>

              <div className="bg-black/30 rounded-lg p-6 text-center">
                <h3 className="text-xl font-semibold text-blue-400 mb-4">
                  AST-Primary
                </h3>
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  ~200ms
                </div>
                <div className="text-gray-300 text-sm mb-4">
                  Average execution time
                </div>
                <ul className="text-gray-300 text-xs space-y-1">
                  <li>• Rich transformations</li>
                  <li>• Context awareness</li>
                  <li>• Fallback safety</li>
                </ul>
              </div>

              <div className="bg-black/30 rounded-lg p-6 text-center">
                <h3 className="text-xl font-semibold text-purple-400 mb-4">
                  Hybrid Strategy
                </h3>
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  ~120ms
                </div>
                <div className="text-gray-300 text-sm mb-4">
                  Optimized average
                </div>
                <ul className="text-gray-300 text-xs space-y-1">
                  <li>• Best of both worlds</li>
                  <li>• Intelligent selection</li>
                  <li>• Maximum reliability</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Error Handling */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Error Handling & Recovery
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  AST Error Categories
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-900/20 border border-red-400 rounded-lg p-4">
                    <h4 className="font-semibold text-red-400 mb-2">
                      Parse Failures
                    </h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Syntax errors</li>
                      <li>• Unsupported language features</li>
                      <li>• Malformed code structures</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-900/20 border border-yellow-400 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-400 mb-2">
                      Transformation Failures
                    </h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Complex pattern matching</li>
                      <li>• Scope resolution issues</li>
                      <li>• Generation errors</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Recovery Strategy
                </h3>
                <div className="bg-black/50 rounded-lg p-4 font-mono text-sm">
                  <div className="text-yellow-400">
                    ⚠️ AST failed for Layer 3, using regex fallback:
                  </div>
                  <div className="text-gray-300 ml-4">
                    Error: Complex JSX structure not supported
                    <br />
                    Fallback: Applied 3 basic component fixes
                    <br />
                    Result: Partial transformation completed safely
                  </div>
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
                  Development Guidelines
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Always provide regex fallback for AST layers</li>
                  <li>• Test both AST and regex paths</li>
                  <li>• Monitor fallback usage rates</li>
                  <li>• Optimize regex patterns for speed</li>
                  <li>• Validate AST transformations</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  Performance Tips
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Use regex for simple transformations</li>
                  <li>• Cache AST parsing results</li>
                  <li>• Implement timeout guards</li>
                  <li>• Profile transformation times</li>
                  <li>• Consider file size thresholds</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

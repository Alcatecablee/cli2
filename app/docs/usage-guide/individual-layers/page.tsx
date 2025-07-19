import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Individual Layers - NeuroLint Pro",
  description:
    "Run specific NeuroLint Pro layers independently for targeted fixes",
};

export default function IndividualLayersPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent mb-6">
            Individual Layers
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Execute specific layers independently for targeted transformations
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Quick Reference */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Layer Commands
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-black/50 rounded-lg p-4">
                <code className="text-green-400">npm run fix-layer-1</code>
                <p className="text-gray-300 text-sm mt-1">
                  Configuration fixes
                </p>
              </div>
              <div className="bg-black/50 rounded-lg p-4">
                <code className="text-green-400">npm run fix-layer-2</code>
                <p className="text-gray-300 text-sm mt-1">
                  Pattern standardization
                </p>
              </div>
              <div className="bg-black/50 rounded-lg p-4">
                <code className="text-green-400">npm run fix-layer-3</code>
                <p className="text-gray-300 text-sm mt-1">
                  Component improvements
                </p>
              </div>
              <div className="bg-black/50 rounded-lg p-4">
                <code className="text-green-400">npm run fix-layer-4</code>
                <p className="text-gray-300 text-sm mt-1">Hydration safety</p>
              </div>
              <div className="bg-black/50 rounded-lg p-4">
                <code className="text-green-400">npm run fix-layer-5</code>
                <p className="text-gray-300 text-sm mt-1">
                  Next.js optimization
                </p>
              </div>
              <div className="bg-black/50 rounded-lg p-4">
                <code className="text-green-400">npm run fix-layer-6</code>
                <p className="text-gray-300 text-sm mt-1">
                  Testing & validation
                </p>
              </div>
            </div>
          </section>

          {/* Layer 1: Configuration */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-center mb-6">
              <span className="bg-blue-500 text-white text-lg font-bold rounded-full w-10 h-10 flex items-center justify-center mr-4">
                1
              </span>
              <h2 className="text-3xl font-bold text-blue-400">
                Configuration Layer
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  What it fixes:
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• TypeScript target modernization</li>
                  <li>• Next.js configuration updates</li>
                  <li>• Package.json optimization</li>
                  <li>• Build tool configuration</li>
                  <li>• Compiler options enhancement</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Use when:
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Upgrading TypeScript versions</li>
                  <li>• Migrating to newer Next.js</li>
                  <li>• Build errors from config</li>
                  <li>• Performance optimization setup</li>
                  <li>• Project initialization</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 bg-black/30 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Example Output:</h4>
              <pre className="text-green-400 text-sm">
                {`✓ Updated tsconfig.json target: es5 → ES2020
✓ Added downlevelIteration: true
✓ Optimized Next.js configuration
✓ Updated 3 configuration files`}
              </pre>
            </div>
          </section>

          {/* Layer 2: Patterns */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-center mb-6">
              <span className="bg-blue-500 text-white text-lg font-bold rounded-full w-10 h-10 flex items-center justify-center mr-4">
                2
              </span>
              <h2 className="text-3xl font-bold text-blue-400">
                Pattern Standardization
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  What it fixes:
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• HTML entity corruption</li>
                  <li>• AI-powered emoji standardization</li>
                  <li>• Import statement cleanup</li>
                  <li>• Console.log conversion</li>
                  <li>• React pattern modernization</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Advanced Features:
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Context-aware emoji preservation</li>
                  <li>• Semantic mapping (🔧 → [Configuration])</li>
                  <li>• Enterprise analytics reporting</li>
                  <li>• Batch optimization processing</li>
                  <li>• Smart preservation rules</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 bg-black/30 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                Emoji Analytics Example:
              </h4>
              <pre className="text-green-400 text-sm">
                {`🎯 Smart Emoji Processing: 15 changes
  📊 Preserved: 3 (documentation headers)
  🗑️ Removed: 10 (decorative emojis)
  🔄 Replaced: 2 (semantic labels)
Enterprise Compliance: 87% reduction rate`}
              </pre>
            </div>
          </section>

          {/* Layer 3: Components */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-center mb-6">
              <span className="bg-blue-500 text-white text-lg font-bold rounded-full w-10 h-10 flex items-center justify-center mr-4">
                3
              </span>
              <h2 className="text-3xl font-bold text-blue-400">
                Component Optimization
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  What it fixes:
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Missing React key props</li>
                  <li>• Component interface definitions</li>
                  <li>• Missing accessibility attributes</li>
                  <li>• Import statement optimization</li>
                  <li>• Component pattern modernization</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Use when:
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• React console warnings</li>
                  <li>• Accessibility improvements</li>
                  <li>• Code review feedback</li>
                  <li>• Performance optimization</li>
                  <li>• Component refactoring</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Layer 4: Hydration */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-center mb-6">
              <span className="bg-blue-500 text-white text-lg font-bold rounded-full w-10 h-10 flex items-center justify-center mr-4">
                4
              </span>
              <h2 className="text-3xl font-bold text-blue-400">
                Hydration Safety
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  What it fixes:
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• SSR localStorage guards</li>
                  <li>• Document access protection</li>
                  <li>• Window object safety</li>
                  <li>• Theme provider hydration</li>
                  <li>• Client-only component wrapping</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Critical for:
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Server-side rendering</li>
                  <li>• Next.js applications</li>
                  <li>• Hydration mismatch errors</li>
                  <li>• Production deployments</li>
                  <li>• SEO optimization</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Layer 5 & 6 */}
          <div className="grid md:grid-cols-2 gap-6">
            <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-center mb-4">
                <span className="bg-blue-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  5
                </span>
                <h2 className="text-2xl font-bold text-blue-400">
                  Next.js Optimization
                </h2>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• 'use client' directive fixes</li>
                <li>• Import corruption cleanup</li>
                <li>• App Router optimization</li>
                <li>• Client component structure</li>
              </ul>
            </section>

            <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-center mb-4">
                <span className="bg-blue-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  6
                </span>
                <h2 className="text-2xl font-bold text-blue-400">
                  Testing & Validation
                </h2>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Error boundary addition</li>
                <li>• TypeScript interface enhancement</li>
                <li>• Accessibility improvements</li>
                <li>• Performance optimizations</li>
              </ul>
            </section>
          </div>

          {/* Programmatic Usage */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Programmatic Usage
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Specific Layer Execution
                </h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400">
                    {`// Run only Layer 2 (Pattern Standardization)
const result = await NeuroLintPro(
  code,
  filePath,
  false,
  [2],  // Only Layer 2
  { verbose: true }
);

// Run Layers 3 and 4 only
const result = await NeuroLintPro(
  code,
  filePath,
  false,
  [3, 4],  // Components + Hydration
  { verbose: true }
);`}
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
                  Layer Dependencies
                </h3>
                <div className="bg-black/30 rounded-lg p-4">
                  <p className="text-gray-300 text-sm mb-3">
                    Some layers depend on others. The system auto-adds
                    dependencies:
                  </p>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Layer 3 requires Layers 1,2</li>
                    <li>• Layer 4 requires Layers 1,2,3</li>
                    <li>• Layer 5 requires Layers 1,2,3,4</li>
                    <li>• Layer 6 requires all previous</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  Common Patterns
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Run Layer 2 for quick content cleanup</li>
                  <li>• Layer 3 for React component issues</li>
                  <li>• Layer 4 before SSR deployment</li>
                  <li>• Layers 1,2 for new projects</li>
                  <li>• All layers for comprehensive fixes</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

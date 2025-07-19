import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skipping Layers - NeuroLint Pro",
  description:
    "Exclude specific layers from execution for customized workflows",
};

export default function SkippingLayersPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent mb-6">
            Skipping Layers
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Exclude specific layers for customized transformation workflows
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Quick Commands */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Skip Layer Commands
            </h2>
            <div className="space-y-4">
              <div className="bg-black/50 rounded-lg p-4">
                <code className="text-green-400">
                  node scripts/fix-master.js --skip-layers 2,3
                </code>
                <p className="text-gray-300 mt-2">
                  Skip pattern and component layers
                </p>
              </div>
              <div className="bg-black/50 rounded-lg p-4">
                <code className="text-green-400">
                  npm run fix-all -- --skip-layers 1
                </code>
                <p className="text-gray-300 mt-2">
                  Skip configuration layer only
                </p>
              </div>
              <div className="bg-black/50 rounded-lg p-4">
                <code className="text-green-400">
                  npm run fix-verbose -- --skip-layers 5,6
                </code>
                <p className="text-gray-300 mt-2">
                  Skip Next.js and testing layers
                </p>
              </div>
            </div>
          </section>

          {/* When to Skip Layers */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              When to Skip Layers
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Skip Layer 1 */}
              <div className="bg-black/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Skip Layer 1 (Configuration)
                </h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-yellow-400 pl-4">
                    <h4 className="font-semibold text-yellow-400">When:</h4>
                    <p className="text-gray-300 text-sm">
                      Configuration is already optimized
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-400 pl-4">
                    <h4 className="font-semibold text-blue-400">Use Case:</h4>
                    <p className="text-gray-300 text-sm">
                      Focus on code fixes only
                    </p>
                  </div>
                  <div className="border-l-4 border-red-400 pl-4">
                    <h4 className="font-semibold text-red-400">Caution:</h4>
                    <p className="text-gray-300 text-sm">
                      May cause dependency issues
                    </p>
                  </div>
                </div>
              </div>

              {/* Skip Layer 2 */}
              <div className="bg-black/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Skip Layer 2 (Patterns)
                </h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-yellow-400 pl-4">
                    <h4 className="font-semibold text-yellow-400">When:</h4>
                    <p className="text-gray-300 text-sm">
                      Custom emoji strategy in place
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-400 pl-4">
                    <h4 className="font-semibold text-blue-400">Use Case:</h4>
                    <p className="text-gray-300 text-sm">
                      Preserve existing content patterns
                    </p>
                  </div>
                  <div className="border-l-4 border-green-400 pl-4">
                    <h4 className="font-semibold text-green-400">Safe:</h4>
                    <p className="text-gray-300 text-sm">
                      Won't break functionality
                    </p>
                  </div>
                </div>
              </div>

              {/* Skip Layer 3 */}
              <div className="bg-black/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Skip Layer 3 (Components)
                </h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-yellow-400 pl-4">
                    <h4 className="font-semibold text-yellow-400">When:</h4>
                    <p className="text-gray-300 text-sm">
                      Components already optimized
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-400 pl-4">
                    <h4 className="font-semibold text-blue-400">Use Case:</h4>
                    <p className="text-gray-300 text-sm">
                      Focus on infrastructure only
                    </p>
                  </div>
                  <div className="border-l-4 border-red-400 pl-4">
                    <h4 className="font-semibold text-red-400">Warning:</h4>
                    <p className="text-gray-300 text-sm">
                      May leave React warnings
                    </p>
                  </div>
                </div>
              </div>

              {/* Skip Layer 4 */}
              <div className="bg-black/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Skip Layer 4 (Hydration)
                </h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-yellow-400 pl-4">
                    <h4 className="font-semibold text-yellow-400">When:</h4>
                    <p className="text-gray-300 text-sm">
                      No SSR or client-only app
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-400 pl-4">
                    <h4 className="font-semibold text-blue-400">Use Case:</h4>
                    <p className="text-gray-300 text-sm">SPA applications</p>
                  </div>
                  <div className="border-l-4 border-green-400 pl-4">
                    <h4 className="font-semibold text-green-400">Safe:</h4>
                    <p className="text-gray-300 text-sm">
                      If no SSR requirements
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Common Skip Patterns */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Common Skip Patterns
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Content-Only Cleanup
                </h3>
                <div className="bg-black/50 rounded-lg p-4 mb-4">
                  <code className="text-green-400">
                    --skip-layers 1,3,4,5,6
                  </code>
                  <p className="text-gray-300 text-sm mt-2">
                    Run only Layer 2 for pattern standardization
                  </p>
                </div>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Emoji standardization only</li>
                  <li>• HTML entity cleanup</li>
                  <li>• Import optimization</li>
                  <li>• Console statement fixes</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  React-Focused Fixes
                </h3>
                <div className="bg-black/50 rounded-lg p-4 mb-4">
                  <code className="text-green-400">--skip-layers 1,5,6</code>
                  <p className="text-gray-300 text-sm mt-2">
                    Run Layers 2,3,4 for React optimization
                  </p>
                </div>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Pattern standardization</li>
                  <li>• Component optimization</li>
                  <li>• Hydration safety</li>
                  <li>• Skip config and testing</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Infrastructure-Only
                </h3>
                <div className="bg-black/50 rounded-lg p-4 mb-4">
                  <code className="text-green-400">--skip-layers 2,3</code>
                  <p className="text-gray-300 text-sm mt-2">
                    Configuration, SSR, and framework fixes
                  </p>
                </div>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Configuration updates</li>
                  <li>• Hydration safety</li>
                  <li>• Next.js optimization</li>
                  <li>• Testing improvements</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Legacy Codebase
                </h3>
                <div className="bg-black/50 rounded-lg p-4 mb-4">
                  <code className="text-green-400">--skip-layers 5,6</code>
                  <p className="text-gray-300 text-sm mt-2">
                    Avoid modern framework assumptions
                  </p>
                </div>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Core fixes only</li>
                  <li>• No Next.js assumptions</li>
                  <li>• Basic safety patterns</li>
                  <li>• Conservative approach</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Programmatic Skipping */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Programmatic Layer Selection
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Selective Execution
                </h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400">
                    {`// Skip layers 2 and 5
const result = await NeuroLintPro(
  code,
  filePath,
  false,
  [1, 3, 4, 6],  // Only these layers
  { verbose: true }
);

// Advanced filtering with conditions
const layersToRun = [1, 2, 3, 4, 5, 6].filter(layer => {
  if (isLegacyCodebase && layer > 4) return false;
  if (noSSR && layer === 4) return false;
  if (configOptimized && layer === 1) return false;
  return true;
});`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Dynamic Layer Selection
                </h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400">
                    {`// Smart layer selection based on analysis
const analysis = SmartLayerSelector.analyzeAndRecommend(code);
const customLayers = analysis.recommendedLayers.filter(layer => {
  // Skip emoji processing if content strategy exists
  if (hasContentStrategy && layer === 2) return false;
  
  // Skip hydration for client-only apps
  if (isClientOnly && layer === 4) return false;
  
  return true;
});`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Dependency Warnings */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Dependency Management
            </h2>

            <div className="space-y-6">
              <div className="bg-yellow-900/30 border border-yellow-400 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">
                  Automatic Dependency Resolution
                </h3>
                <p className="text-gray-300 mb-4">
                  NeuroLint Pro automatically adds required dependencies when
                  you skip layers:
                </p>
                <div className="bg-black/50 rounded-lg p-4">
                  <pre className="text-green-400 text-sm">
                    {`Warning: Layer 4 requires Layer 1, 2, 3
Auto-added missing dependencies: [1, 2, 3]
Final execution order: [1, 2, 3, 4]`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Manual Override
                </h3>
                <p className="text-gray-300 mb-4">
                  Force skip dependencies (advanced users only):
                </p>
                <div className="bg-black/50 rounded-lg p-4">
                  <code className="text-green-400">
                    node neurolint-pro.js --force-skip --layers 4
                  </code>
                  <p className="text-red-400 text-sm mt-2">
                    ⚠️ May cause unexpected behavior
                  </p>
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
                  Safety Guidelines
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Always test with dry run first</li>
                  <li>• Document why layers are skipped</li>
                  <li>• Monitor for dependency warnings</li>
                  <li>• Review auto-added dependencies</li>
                  <li>• Validate final results</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  Common Mistakes
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Skipping Layer 1 in new projects</li>
                  <li>• Ignoring dependency warnings</li>
                  <li>• Skipping Layer 4 in SSR apps</li>
                  <li>• Not testing after skipping</li>
                  <li>• Overriding safety checks</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

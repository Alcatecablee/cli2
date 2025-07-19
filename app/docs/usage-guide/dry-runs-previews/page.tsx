import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dry Runs & Previews - NeuroLint Pro",
  description:
    "Safe preview mode to see changes before applying transformations",
};

export default function DryRunsPreviewsPage() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Professional background with subtle patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-2xl border border-cyan-400/20">
            <svg
              className="w-8 h-8 text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-gray-200 to-cyan-400 bg-clip-text text-transparent mb-6">
            Dry Runs & Previews
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Preview transformations safely before applying changes to your
            codebase
          </p>
          <div className="flex items-center justify-center space-x-6 mt-8 text-sm text-gray-400">
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>10 min read</span>
            </span>
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Preview Guide</span>
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Quick Commands */}
          <section className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-black/50">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
              Quick Commands
            </h2>
            <div className="space-y-4">
              <div className="bg-black/50 rounded-lg p-4">
                <code className="text-green-400">npm run fix-dry-run</code>
                <p className="text-gray-300 mt-2">
                  Preview all fixes without applying them
                </p>
              </div>
              <div className="bg-black/50 rounded-lg p-4">
                <code className="text-green-400">
                  node neurolint-pro.js code.tsx file.tsx true
                </code>
                <p className="text-gray-300 mt-2">Programmatic dry run mode</p>
              </div>
              <div className="bg-black/50 rounded-lg p-4">
                <code className="text-green-400">
                  npm run fix-verbose -- --dry-run
                </code>
                <p className="text-gray-300 mt-2">
                  Detailed preview with verbose output
                </p>
              </div>
            </div>
          </section>

          {/* How Dry Runs Work */}
          <section className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-black/50">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
              How Dry Runs Work
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Safe Analysis
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    Code is analyzed without modification
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    All potential fixes are identified
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    Transformations are simulated
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    Results are displayed for review
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Output Information
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    Detected issues and severity
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    Recommended layer execution
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    Preview of transformed code
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    Performance estimates
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Advanced Preview Features */}
          <section className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-black/50">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
              Advanced Preview Features
            </h2>

            {/* Smart Analysis */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">
                Smart Analysis Engine
              </h3>
              <div className="bg-black/30 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-400 mb-2">
                      Issue Detection
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• HTML entity corruption</li>
                      <li>• Missing React key props</li>
                      <li>• SSR hydration issues</li>
                      <li>• TypeScript configuration</li>
                      <li>• Import optimization opportunities</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">
                      Confidence Scoring
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Pattern match accuracy</li>
                      <li>• Context awareness level</li>
                      <li>• Risk assessment</li>
                      <li>• Success probability</li>
                      <li>• Impact estimation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Emoji Intelligence Preview */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">
                Emoji Standardization Preview
              </h3>
              <div className="bg-black/30 rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-purple-400 mb-2">
                      Context-Aware Analysis
                    </h4>
                    <p className="text-gray-300 text-sm mb-3">
                      See how the AI-powered emoji processor will handle your
                      content:
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-black/50 rounded p-3">
                        <div className="text-green-400 font-semibold">
                          Preserved
                        </div>
                        <div className="text-gray-300">
                          Brand guidelines, documentation headers
                        </div>
                      </div>
                      <div className="bg-black/50 rounded p-3">
                        <div className="text-blue-400 font-semibold">
                          Semantic Labels
                        </div>
                        <div className="text-gray-300">
                          Technical symbols → [Tool], [Config]
                        </div>
                      </div>
                      <div className="bg-black/50 rounded p-3">
                        <div className="text-red-400 font-semibold">
                          Removed
                        </div>
                        <div className="text-gray-300">
                          Decorative, excessive emojis
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Preview Output Examples */}
          <section className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-black/50">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
              Preview Output Examples
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Layer Recommendation
                </h3>
                <div className="bg-black/50 rounded-lg p-4 font-mono text-sm">
                  <div className="text-green-400">
                    ✓ Smart Analysis Results:
                  </div>
                  <div className="text-gray-300 ml-4">
                    • Recommended Layers: [1, 2, 3, 4]
                    <br />
                    • Confidence: 89.2%
                    <br />
                    • Impact Level: high
                    <br />
                    • Issues Detected: 12
                    <br />• Estimated Fix Time: 45 seconds
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Issue Breakdown
                </h3>
                <div className="bg-black/50 rounded-lg p-4 font-mono text-sm">
                  <div className="text-yellow-400">
                    ⚠ Layer 2: Pattern Standardization
                  </div>
                  <div className="text-gray-300 ml-4">
                    • HTML Entity Quotes: 5 occurrences
                    <br />
                    • Emoji Standardization: 23 emojis (density: 8.4/1000 chars)
                    <br />• Console.log Usage: 3 instances
                  </div>
                  <div className="text-blue-400 mt-2">→ Component Fixes</div>
                  <div className="text-gray-300 ml-4">
                    • Missing Key Props: 2 map operations
                    <br />• Accessibility Issues: 1 image missing alt
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Code Preview
                </h3>
                <div className="bg-black/50 rounded-lg p-4">
                  <div className="text-red-400 text-sm mb-2">Before:</div>
                  <pre className="text-gray-300 text-sm mb-4">
                    items.map(item =&gt; &lt;div&gt;{`{item.name}`}&lt;/div&gt;)
                  </pre>
                  <div className="text-green-400 text-sm mb-2">After:</div>
                  <pre className="text-gray-300 text-sm">
                    items.map(item =&gt; &lt;div key={`{item.id}`}&gt;
                    {`{item.name}`}&lt;/div&gt;)
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Safety Guidelines */}
          <section className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-black/50">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
              Safety Guidelines
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  When to Use Dry Runs
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• First time on a new codebase</li>
                  <li>• Before major releases</li>
                  <li>• When uncertain about changes</li>
                  <li>• Critical production code</li>
                  <li>• Complex legacy systems</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  Best Practices
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Always review output carefully</li>
                  <li>• Test specific layers first</li>
                  <li>• Use verbose mode for details</li>
                  <li>• Compare before/after code</li>
                  <li>• Document any concerns</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

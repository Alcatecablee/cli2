import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Full Orchestration - NeuroLint Pro",
  description:
    "Complete guide to running full NeuroLint Pro orchestration with all layers",
};

export default function FullOrchestrationPage() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Professional background with subtle patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-400/20">
            <svg
              className="w-8 h-8 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
              />
            </svg>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-gray-200 to-blue-400 bg-clip-text text-transparent mb-6">
            Full Orchestration
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Run all 6 layers of NeuroLint Pro for comprehensive code
            transformation
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
              <span>12 min read</span>
            </span>
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Complete Guide</span>
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Quick Start */}
          <section className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-black/50">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
              Quick Start
            </h2>
            <div className="space-y-4">
              <div className="bg-black/50 rounded-lg p-4">
                <code className="text-green-400">npm run fix-all</code>
                <p className="text-gray-300 mt-2">
                  Run complete automated fixing across all layers
                </p>
              </div>
              <div className="bg-black/50 rounded-lg p-4">
                <code className="text-green-400">node neurolint-pro.js</code>
                <p className="text-gray-300 mt-2">
                  Execute full orchestration programmatically
                </p>
              </div>
            </div>
          </section>

          {/* Orchestration Process */}
          <section className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-black/50">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
              Orchestration Process
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  Sequential Execution
                </h3>
                <ol className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <span className="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">
                      1
                    </span>
                    Configuration Foundation
                  </li>
                  <li className="flex items-center">
                    <span className="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">
                      2
                    </span>
                    Pattern Standardization
                  </li>
                  <li className="flex items-center">
                    <span className="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">
                      3
                    </span>
                    Component Optimization
                  </li>
                  <li className="flex items-center">
                    <span className="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">
                      4
                    </span>
                    Hydration Safety
                  </li>
                  <li className="flex items-center">
                    <span className="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">
                      5
                    </span>
                    Next.js Optimization
                  </li>
                  <li className="flex items-center">
                    <span className="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">
                      6
                    </span>
                    Testing Validation
                  </li>
                </ol>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  Safety Features
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Incremental validation between layers</li>
                  <li>• Automatic rollback on failure</li>
                  <li>• Safe execution patterns</li>
                  <li>• Error recovery system</li>
                  <li>• Progress tracking</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Advanced Configuration */}
          <section className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-black/50">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
              Advanced Configuration
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Programmatic Usage
                </h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400">
                    {`const result = await NeuroLintPro(
  code,              // Source code
  filePath,          // File path
  false,             // Not dry run
  [1, 2, 3, 4, 5, 6], // All layers
  {
    verbose: true,
    onProgress: (status) => console.log(status)
  }
);`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Command Line Options
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-black/30 rounded-lg p-4">
                    <code className="text-green-400">--verbose</code>
                    <p className="text-gray-300 text-sm mt-1">
                      Detailed execution logs
                    </p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <code className="text-green-400">--dry-run</code>
                    <p className="text-gray-300 text-sm mt-1">
                      Preview changes only
                    </p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <code className="text-green-400">--skip-layers</code>
                    <p className="text-gray-300 text-sm mt-1">
                      Exclude specific layers
                    </p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <code className="text-green-400">--target</code>
                    <p className="text-gray-300 text-sm mt-1">
                      Specific file/directory
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Performance & Results */}
          <section className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-black/50">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
              Performance & Results
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-black/30 rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-green-400 mb-2">
                  2 min
                </div>
                <div className="text-gray-300">Average Completion</div>
              </div>
              <div className="bg-black/30 rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">95%</div>
                <div className="text-gray-300">Success Rate</div>
              </div>
              <div className="bg-black/30 rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">
                  100+
                </div>
                <div className="text-gray-300">Fix Patterns</div>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-black/50">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
              Best Practices
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-green-400 pl-4">
                <h4 className="font-semibold text-white">
                  Always Use Version Control
                </h4>
                <p className="text-gray-300">
                  Commit changes before running full orchestration
                </p>
              </div>
              <div className="border-l-4 border-blue-400 pl-4">
                <h4 className="font-semibold text-white">
                  Test with Dry Run First
                </h4>
                <p className="text-gray-300">
                  Preview changes on critical codebases
                </p>
              </div>
              <div className="border-l-4 border-yellow-400 pl-4">
                <h4 className="font-semibold text-white">
                  Monitor Build Output
                </h4>
                <p className="text-gray-300">
                  Verify successful compilation after orchestration
                </p>
              </div>
              <div className="border-l-4 border-purple-400 pl-4">
                <h4 className="font-semibold text-white">
                  Review Generated Reports
                </h4>
                <p className="text-gray-300">
                  Analyze transformation analytics for insights
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

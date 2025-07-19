import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Full Orchestration - NeuroLint Pro",
  description:
    "Complete guide to running full NeuroLint Pro orchestration with all layers",
};

export default function FullOrchestrationPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent mb-6">
            Full Orchestration
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Run all 6 layers of NeuroLint Pro for comprehensive code
            transformation
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Quick Start */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
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
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
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
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
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
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
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
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
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

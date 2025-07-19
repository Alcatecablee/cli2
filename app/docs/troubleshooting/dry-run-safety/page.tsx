import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dry Run Safety - NeuroLint Pro",
  description:
    "Understanding and using dry run mode for safe code transformations",
};

export default function DryRunSafetyPage() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Professional background with subtle patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl border border-cyan-400/20">
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-gray-200 to-cyan-400 bg-clip-text text-transparent mb-6">
            Dry Run Safety
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Complete guide to understanding and using dry run mode for safe code
            transformations
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
              <span>18 min read</span>
            </span>
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Safety Guide</span>
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto space-y-16">
          {/* What is Dry Run */}
          <section className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-black/50">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
              What is Dry Run Mode?
            </h2>

            <div className="space-y-6">
              {/* Core Concept */}
              <div>
                <div className="bg-gradient-to-br from-black/40 to-gray-900/60 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Core Concept
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Dry run mode executes the complete NeuroLint Pro
                    transformation pipeline without making any actual changes to
                    your files. It shows exactly what would be modified,
                    allowing you to review and approve changes before they
                    happen.
                  </p>

                  <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-4">
                    <h4 className="text-blue-400 font-semibold mb-2">
                      Key Benefits
                    </h4>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Zero risk - no files are modified</li>
                      <li>• Complete preview of all changes</li>
                      <li>• Performance testing without side effects</li>
                      <li>• Configuration validation</li>
                      <li>• Pattern testing and debugging</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How It Works */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  How Dry Run Works
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-black/40 to-gray-900/60 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                    <h4 className="font-semibold text-green-400 mb-3">
                      Normal Execution
                    </h4>
                    <ol className="text-gray-300 space-y-2 text-sm">
                      <li>1. Read source files</li>
                      <li>2. Apply transformations</li>
                      <li>
                        3.{" "}
                        <strong className="text-yellow-400">
                          Write modified files
                        </strong>
                      </li>
                      <li>4. Create backups</li>
                      <li>5. Generate reports</li>
                    </ol>
                  </div>

                  <div className="bg-gradient-to-br from-black/40 to-gray-900/60 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                    <h4 className="font-semibold text-blue-400 mb-3">
                      Dry Run Execution
                    </h4>
                    <ol className="text-gray-300 space-y-2 text-sm">
                      <li>1. Read source files</li>
                      <li>2. Apply transformations</li>
                      <li>
                        3.{" "}
                        <strong className="text-green-400">
                          Store results in memory
                        </strong>
                      </li>
                      <li>4. Generate preview reports</li>
                      <li>5. Show difference analysis</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Basic Dry Run Usage */}
          <section className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-black/50">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
              Basic Dry Run Usage
            </h2>

            <div className="space-y-6">
              {/* Simple Commands */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Basic Commands
                </h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-black/40 to-gray-900/60 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                    <h4 className="font-semibold text-green-400 mb-3">
                      Standard Dry Run
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-green-400 text-sm">
                        {`# Basic dry run - preview all changes
neurolint fix --dry-run

# Dry run with verbose output
neurolint fix --dry-run --verbose

# Dry run for specific directory
neurolint fix src/components/ --dry-run

# Dry run for specific file types
neurolint fix --pattern="*.tsx" --dry-run`}
                      </pre>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Always start with basic dry run to see the overall scope
                      of changes.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-black/40 to-gray-900/60 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                    <h4 className="font-semibold text-green-400 mb-3">
                      Layer-Specific Dry Run
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-green-400 text-sm">
                        {`# Test individual layers
neurolint fix --layer=1 --dry-run  # Config analysis only
neurolint fix --layer=2 --dry-run  # Pattern transformations only
neurolint fix --layer=3 --dry-run  # Component analysis only

# Test multiple layers
neurolint fix --layers=2,3,4 --dry-run

# Test everything except specific layers
neurolint fix --skip=layer5,layer6 --dry-run`}
                      </pre>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Layer-specific dry runs help isolate which transformations
                      cause issues.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Advanced Dry Run Features */}
          <section className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-black/50">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
              Advanced Dry Run Features
            </h2>

            <div className="space-y-6">
              {/* Output Formats */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Output Formats & Analysis
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-black/40 to-gray-900/60 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                    <h4 className="font-semibold text-blue-400 mb-3">
                      Output Formats
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-blue-400 text-sm">
                        {`# JSON format for automation
neurolint fix --dry-run --format=json

# Detailed diff format
neurolint fix --dry-run --format=diff

# Summary statistics only
neurolint fix --dry-run --format=summary

# Export to file
neurolint fix --dry-run --output=preview.json`}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-black/40 to-gray-900/60 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                    <h4 className="font-semibold text-blue-400 mb-3">
                      Analysis Options
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-blue-400 text-sm">
                        {`# Show before/after code snippets
neurolint fix --dry-run --show-diffs

# Analyze impact by file type
neurolint fix --dry-run --analyze-impact

# Show performance metrics
neurolint fix --dry-run --profile

# Validate syntax of changes
neurolint fix --dry-run --validate-syntax`}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-black/40 to-gray-900/60 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                    <h4 className="font-semibold text-blue-400 mb-3">
                      Filtering Options
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-blue-400 text-sm">
                        {`# Only show files that would be modified
neurolint fix --dry-run --modified-only

# Show only high-confidence changes
neurolint fix --dry-run --confidence=high

# Filter by change type
neurolint fix --dry-run --changes=imports,patterns

# Exclude certain file patterns
neurolint fix --dry-run --exclude="**/*.test.tsx"`}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-black/40 to-gray-900/60 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                    <h4 className="font-semibold text-blue-400 mb-3">
                      Interactive Preview
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-blue-400 text-sm">
                        {`# Interactive file-by-file preview
neurolint fix --dry-run --interactive

# Show side-by-side diffs
neurolint fix --dry-run --side-by-side

# Browse changes in web interface
neurolint fix --dry-run --web-preview

# Generate HTML report
neurolint fix --dry-run --html-report`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Safety Checklist */}
          <section className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-black/50">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
              Pre-Execution Safety Checklist
            </h2>

            <div className="space-y-6">
              {/* Checklist Items */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Essential Safety Steps
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-green-400 mb-4">
                      Before Dry Run
                    </h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-400 rounded border-gray-600 bg-gray-900"
                        />
                        <span className="text-gray-300">
                          Commit current changes to git
                        </span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-400 rounded border-gray-600 bg-gray-900"
                        />
                        <span className="text-gray-300">
                          Validate configuration file
                        </span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-400 rounded border-gray-600 bg-gray-900"
                        />
                        <span className="text-gray-300">
                          Ensure clean working directory
                        </span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-400 rounded border-gray-600 bg-gray-900"
                        />
                        <span className="text-gray-300">
                          Test on small subset first
                        </span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-400 rounded border-gray-600 bg-gray-900"
                        />
                        <span className="text-gray-300">
                          Review ignore patterns
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-orange-400 mb-4">
                      After Dry Run
                    </h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-400 rounded border-gray-600 bg-gray-900"
                        />
                        <span className="text-gray-300">
                          Review all proposed changes
                        </span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-400 rounded border-gray-600 bg-gray-900"
                        />
                        <span className="text-gray-300">
                          Check for unexpected modifications
                        </span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-400 rounded border-gray-600 bg-gray-900"
                        />
                        <span className="text-gray-300">
                          Validate syntax of changes
                        </span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-400 rounded border-gray-600 bg-gray-900"
                        />
                        <span className="text-gray-300">
                          Test performance impact
                        </span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-400 rounded border-gray-600 bg-gray-900"
                        />
                        <span className="text-gray-300">
                          Plan incremental execution
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Common Dry Run Scenarios */}
          <section className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-black/50">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
              Common Dry Run Scenarios
            </h2>

            <div className="space-y-6">
              {/* Testing New Patterns */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Testing New Patterns
                </h3>
                <div className="bg-gradient-to-br from-black/40 to-gray-900/60 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                  <h4 className="font-semibold text-yellow-400 mb-3">
                    Scenario: Adding Custom Transformation Pattern
                  </h4>
                  <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-yellow-400 text-sm">
                      {`# 1. Add new pattern to config
echo 'Adding custom pattern: Button component migration'

# 2. Test pattern in isolation
neurolint fix --dry-run --layer=2 --pattern-name="button-migration"

# 3. Test on single file first
neurolint fix --dry-run src/components/Button.tsx

# 4. Test on component directory
neurolint fix --dry-run src/components/ --verbose

# 5. Full project test if above looks good
neurolint fix --dry-run --show-diffs

# 6. Export results for review
neurolint fix --dry-run --output=pattern-test-results.json`}
                    </pre>
                  </div>
                  <p className="text-gray-300 text-sm mt-3">
                    <strong>Key Points:</strong> Always test new patterns
                    incrementally, from single files to full projects.
                  </p>
                </div>
              </div>

              {/* Large Codebase Migration */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Large Codebase Migration
                </h3>
                <div className="bg-gradient-to-br from-black/40 to-gray-900/60 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                  <h4 className="font-semibold text-purple-400 mb-3">
                    Scenario: Migrating 1000+ Files
                  </h4>
                  <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-purple-400 text-sm">
                      {`# 1. Start with impact analysis
neurolint analyze --scope=full --output=impact-analysis.json

# 2. Test different batch sizes
neurolint fix --dry-run --batch-size=50 --analyze-performance
neurolint fix --dry-run --batch-size=100 --analyze-performance

# 3. Test memory usage
neurolint fix --dry-run --profile --memory-limit=4gb

# 4. Test layer-by-layer
for layer in {1..6}; do
  echo "Testing Layer $layer"
  neurolint fix --dry-run --layer=$layer --summary
done

# 5. Test parallel processing
neurolint fix --dry-run --parallel=4 --show-timing

# 6. Generate execution plan
neurolint fix --dry-run --execution-plan=migration-plan.json`}
                    </pre>
                  </div>
                  <p className="text-gray-300 text-sm mt-3">
                    <strong>Key Points:</strong> Performance testing and batch
                    planning are crucial for large codebases.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Interpreting Dry Run Results */}
          <section className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-black/50">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
              Interpreting Dry Run Results
            </h2>

            <div className="space-y-6">
              {/* Result Analysis */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Understanding the Output
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-black/40 to-gray-900/60 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                    <h4 className="font-semibold text-green-400 mb-3">
                      Good Signs
                    </h4>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• All patterns execute successfully</li>
                      <li>• Syntax validation passes</li>
                      <li>• Change counts match expectations</li>
                      <li>• No critical warnings</li>
                      <li>• Performance metrics are reasonable</li>
                      <li>• File changes look intentional</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-black/40 to-gray-900/60 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                    <h4 className="font-semibold text-red-400 mb-3">
                      Warning Signs
                    </h4>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• Syntax errors in proposed changes</li>
                      <li>• Unexpectedly high change counts</li>
                      <li>• Pattern execution failures</li>
                      <li>• Memory usage warnings</li>
                      <li>• Unintended file modifications</li>
                      <li>• Critical dependency changes</li>
                    </ul>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6 md:col-span-2">
                    <h4 className="font-semibold text-blue-400 mb-3">
                      Sample Good Dry Run Output
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        {`NeuroLint Pro - Dry Run Results
=================================

Files Analyzed: 1,247
Files to Modify: 89
Total Changes: 234

Layer 1 (Config): 12 files, 45 changes
Layer 2 (Patterns): 67 files, 156 changes  
Layer 3 (Components): 23 files, 33 changes
Layer 4 (Hydration): 0 files, 0 changes
Layer 5 (Next.js): 0 files, 0 changes
Layer 6 (Testing): 0 files, 0 changes

Syntax Validation: PASSED
Performance: 2.3 seconds
Memory Usage: 245 MB

Ready for execution: YES`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-black/50">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
              Dry Run Best Practices
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Do's</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Always dry run before real execution</li>
                  <li>• Test incrementally (file → dir → project)</li>
                  <li>• Review all proposed changes carefully</li>
                  <li>• Export results for team review</li>
                  <li>• Test performance on representative data</li>
                  <li>• Validate configuration before dry run</li>
                  <li>• Use version control checkpoints</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Don'ts
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Skip dry run for "simple" changes</li>
                  <li>• Ignore warning messages</li>
                  <li>• Rush through result review</li>
                  <li>• Assume dry run guarantees success</li>
                  <li>• Test on outdated code</li>
                  <li>• Ignore performance warnings</li>
                  <li>• Execute without team approval on shared projects</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

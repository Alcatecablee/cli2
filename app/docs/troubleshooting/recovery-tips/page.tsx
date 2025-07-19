import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recovery Tips - NeuroLint Pro",
  description:
    "Recovery strategies and best practices for handling NeuroLint Pro issues",
};

export default function RecoveryTipsPage() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Professional background with subtle patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl border border-green-400/20">
            <svg
              className="w-8 h-8 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-gray-200 to-green-400 bg-clip-text text-transparent mb-6">
            Recovery Tips
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Comprehensive recovery strategies and best practices for handling
            NeuroLint Pro issues
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
              <span>Recovery Guide</span>
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Emergency Recovery */}
          <section className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-black/50">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
              Emergency Recovery
            </h2>

            <div className="space-y-6">
              {/* Immediate Recovery Steps */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Immediate Recovery Steps
                </h3>
                <div className="bg-gradient-to-br from-black/40 to-gray-900/60 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                  <h4 className="font-semibold text-red-400 mb-4">
                    If NeuroLint Pro Breaks Your Code
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <span className="bg-red-500/20 text-red-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        1
                      </span>
                      <div>
                        <p className="text-white font-medium">
                          Stop the Process
                        </p>
                        <p className="text-gray-300 text-sm">
                          Press Ctrl+C to immediately stop any running NeuroLint
                          Pro operation
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="bg-red-500/20 text-red-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        2
                      </span>
                      <div>
                        <p className="text-white font-medium">
                          Check Git Status
                        </p>
                        <p className="text-gray-300 text-sm">
                          Run{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            git status
                          </code>{" "}
                          to see what files were modified
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="bg-red-500/20 text-red-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        3
                      </span>
                      <div>
                        <p className="text-white font-medium">
                          Use Automatic Restore
                        </p>
                        <p className="text-gray-300 text-sm">
                          NeuroLint Pro creates automatic backups:{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            neurolint restore --auto
                          </code>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="bg-red-500/20 text-red-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        4
                      </span>
                      <div>
                        <p className="text-white font-medium">
                          Manual Git Revert
                        </p>
                        <p className="text-gray-300 text-sm">
                          If auto-restore fails:{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            git checkout -- .
                          </code>{" "}
                          or{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            git reset --hard HEAD
                          </code>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Backup Recovery */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Backup Recovery Methods
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-black/40 to-gray-900/60 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                    <h4 className="font-semibold text-green-400 mb-3">
                      Automatic Backup Restore
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-green-400 text-sm">
                        {`# List available backups
neurolint list-backups

# Restore latest backup
neurolint restore --latest

# Restore specific backup
neurolint restore --id=backup_20231201_143022

# Restore with confirmation
neurolint restore --interactive`}
                      </pre>
                    </div>
                    <p className="text-gray-300 text-sm">
                      NeuroLint Pro automatically creates timestamped backups
                      before any transformation.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-black/40 to-gray-900/60 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                    <h4 className="font-semibold text-blue-400 mb-3">
                      Manual Backup Restore
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-blue-400 text-sm">
                        {`# Backup location
ls -la .neurolint/backups/

# Copy specific files back
cp .neurolint/backups/latest/src/component.tsx \\
   src/component.tsx

# Restore entire directory
cp -r .neurolint/backups/latest/src/ ./`}
                      </pre>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Backups are stored in{" "}
                      <code className="bg-gray-800 px-1 rounded">
                        .neurolint/backups/
                      </code>{" "}
                      with timestamps.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Selective Recovery */}
          <section className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-black/50">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
              Selective Recovery
            </h2>

            <div className="space-y-6">
              {/* File-by-File Recovery */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  File-by-File Recovery
                </h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-black/40 to-gray-900/60 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                    <h4 className="font-semibold text-yellow-400 mb-3">
                      When Only Some Files Have Issues
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-yellow-400 text-sm">
                        {`# Identify problematic files
neurolint analyze --report-errors

# Restore specific files only
neurolint restore --files="src/components/Button.tsx,src/utils/helper.ts"

# Restore by pattern
neurolint restore --pattern="src/components/**/*.tsx"

# Restore and exclude working files
neurolint restore --exclude="src/working/**"

# Interactive file selection
neurolint restore --select-files`}
                      </pre>
                    </div>
                    <div className="text-gray-300 text-sm mt-3">
                      <p>
                        Use selective restore when you want to keep some changes
                        but revert others.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-black/40 to-gray-900/60 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                    <h4 className="font-semibold text-yellow-400 mb-3">
                      Layer-Specific Recovery
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-yellow-400 text-sm">
                        {`# Restore changes from specific layer only
neurolint restore --layer=2  # Undo pattern changes only
neurolint restore --layer=3  # Undo component changes only
neurolint restore --layer=4  # Undo hydration changes only

# Restore multiple layers
neurolint restore --layers=2,3,5

# See what each layer changed
neurolint diff --layer=2
neurolint diff --layer=3

# Restore everything except one layer
neurolint restore --exclude-layer=4`}
                      </pre>
                    </div>
                    <div className="text-gray-300 text-sm mt-3">
                      <p>
                        Granular recovery lets you undo specific transformation
                        types while keeping others.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Prevention Strategies */}
          <section className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-black/50">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
              Prevention Strategies
            </h2>

            <div className="space-y-6">
              {/* Pre-execution Safety */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Pre-execution Safety Measures
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-black/40 to-gray-900/60 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                    <h4 className="font-semibold text-green-400 mb-3">
                      Always Use Dry Run First
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-green-400 text-sm">
                        {`# Test what would be changed
neurolint fix --dry-run

# Get detailed preview
neurolint fix --dry-run --verbose

# Preview specific layers
neurolint fix --dry-run --layer=2,3

# Export preview to file
neurolint fix --dry-run --output=preview.json`}
                      </pre>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Never run without dry-run on important codebases.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-black/40 to-gray-900/60 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                    <h4 className="font-semibold text-green-400 mb-3">
                      Git Best Practices
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-green-400 text-sm">
                        {`# Create dedicated branch
git checkout -b neurolint-fixes

# Commit before running
git add .
git commit -m "Before NeuroLint Pro fixes"

# Enable auto-backup
neurolint config set autoBackup true

# Set backup retention
neurolint config set backupRetention 10`}
                      </pre>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Always work on a separate branch when applying large-scale
                      changes.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-black/40 to-gray-900/60 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                    <h4 className="font-semibold text-green-400 mb-3">
                      Incremental Approach
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-green-400 text-sm">
                        {`# Process one layer at a time
neurolint fix --layer=1
# Test, commit, then continue

neurolint fix --layer=2
# Test, commit, then continue

# Process small batches
neurolint fix --batch-size=10

# Process specific directories
neurolint fix src/components/`}
                      </pre>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Smaller, incremental changes are easier to review and
                      recover from.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-black/40 to-gray-900/60 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                    <h4 className="font-semibold text-green-400 mb-3">
                      Configuration Validation
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-green-400 text-sm">
                        {`# Validate config before running
neurolint validate-config

# Test patterns in isolation
neurolint test-pattern "custom-pattern-name"

# Check for conflicting rules
neurolint analyze-conflicts

# Verify layer dependencies
neurolint verify-layers`}
                      </pre>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Always validate your configuration before running on
                      production code.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Recovery Workflows */}
          <section className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-black/50">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
              Recovery Workflows
            </h2>

            <div className="space-y-6">
              {/* Complete Recovery Workflow */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Complete Recovery Workflow
                </h3>
                <div className="bg-gradient-to-br from-black/40 to-gray-900/60 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-purple-400 mb-4">
                        Assessment Phase
                      </h4>
                      <ol className="space-y-2 text-gray-300 text-sm">
                        <li>1. Stop all running processes</li>
                        <li>2. Check git status and diff</li>
                        <li>3. Identify scope of changes</li>
                        <li>4. Test current code functionality</li>
                        <li>5. Document what went wrong</li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-400 mb-4">
                        Recovery Phase
                      </h4>
                      <ol className="space-y-2 text-gray-300 text-sm">
                        <li>1. Try automatic restore first</li>
                        <li>2. Use selective recovery if needed</li>
                        <li>3. Manually fix remaining issues</li>
                        <li>4. Test thoroughly</li>
                        <li>5. Commit recovery changes</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              {/* Post-Recovery Analysis */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Post-Recovery Analysis
                </h3>
                <div className="bg-gradient-to-br from-black/40 to-gray-900/60 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                  <h4 className="font-semibold text-orange-400 mb-4">
                    Learn from Issues
                  </h4>
                  <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-orange-400 text-sm">
                      {`# Generate recovery report
neurolint recovery-report --incident-id=latest

# Analyze what patterns caused issues
neurolint analyze-failures --verbose

# Update configuration to prevent recurrence
neurolint config update --exclude-patterns="problematic-pattern"

# Add safety checks
neurolint config set safeMode true
neurolint config set maxFileSize 100kb

# Review and update patterns
neurolint review-patterns --mark-problematic`}
                    </pre>
                  </div>
                  <div className="text-gray-300 text-sm mt-3 space-y-2">
                    <p>
                      <strong>Key Questions to Ask:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>What configuration led to the issue?</li>
                      <li>Which patterns or layers caused problems?</li>
                      <li>How can we prevent this in the future?</li>
                      <li>Should we update our testing strategy?</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Recovery Checklist */}
          <section className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-black/50">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
              Recovery Checklist
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Immediate Actions
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-400 rounded border-gray-600 bg-gray-900"
                    />
                    <span className="text-gray-300">
                      Stop all running NeuroLint processes
                    </span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-400 rounded border-gray-600 bg-gray-900"
                    />
                    <span className="text-gray-300">
                      Check git status for modified files
                    </span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-400 rounded border-gray-600 bg-gray-900"
                    />
                    <span className="text-gray-300">
                      Verify code still compiles/runs
                    </span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-400 rounded border-gray-600 bg-gray-900"
                    />
                    <span className="text-gray-300">
                      Check if automatic backups exist
                    </span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-400 rounded border-gray-600 bg-gray-900"
                    />
                    <span className="text-gray-300">
                      Document the problem scope
                    </span>
                  </label>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Recovery Steps
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-400 rounded border-gray-600 bg-gray-900"
                    />
                    <span className="text-gray-300">
                      Attempt automatic restore
                    </span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-400 rounded border-gray-600 bg-gray-900"
                    />
                    <span className="text-gray-300">
                      Use selective recovery if needed
                    </span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-400 rounded border-gray-600 bg-gray-900"
                    />
                    <span className="text-gray-300">
                      Test recovered code thoroughly
                    </span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-400 rounded border-gray-600 bg-gray-900"
                    />
                    <span className="text-gray-300">
                      Commit recovery changes
                    </span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-400 rounded border-gray-600 bg-gray-900"
                    />
                    <span className="text-gray-300">
                      Update configuration to prevent recurrence
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

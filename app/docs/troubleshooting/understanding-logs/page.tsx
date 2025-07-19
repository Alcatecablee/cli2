import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Understanding Logs - NeuroLint Pro",
  description:
    "Guide to reading and interpreting NeuroLint Pro logs for debugging and monitoring",
};

export default function UnderstandingLogsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent mb-6">
            Understanding Logs
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Guide to reading and interpreting NeuroLint Pro logs for debugging
            and monitoring
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Log Overview */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Log System Overview
            </h2>

            <div className="space-y-6">
              {/* Log Locations */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Log File Locations
                </h3>
                <div className="bg-black/30 rounded-lg p-6">
                  <div className="bg-black/50 rounded-lg p-4 mb-4">
                    <pre className="text-green-400 text-sm">
                      {`# Default log directory structure
.neurolint/
├── logs/
│   ├── execution.log        # Main execution log
│   ├── errors.log          # Error-specific log
│   ├── performance.log     # Performance metrics
│   ├── debug.log           # Debug information
│   └── audit.log           # Change audit trail
├── backups/                # Automatic backups
└── reports/                # Analysis reports`}
                    </pre>
                  </div>
                  <div className="text-gray-300 text-sm space-y-2">
                    <p>
                      <strong>Quick Access Commands:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>
                        <code className="bg-gray-800 px-2 py-1 rounded">
                          neurolint logs --tail
                        </code>{" "}
                        - View recent log entries
                      </li>
                      <li>
                        <code className="bg-gray-800 px-2 py-1 rounded">
                          neurolint logs --errors
                        </code>{" "}
                        - Show only errors
                      </li>
                      <li>
                        <code className="bg-gray-800 px-2 py-1 rounded">
                          neurolint logs --clear
                        </code>{" "}
                        - Clear old logs
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Log Levels */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Log Levels & Meanings
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-green-400 mb-3">
                      Standard Levels
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-mono">
                          ERROR
                        </span>
                        <span className="text-gray-300 text-sm">
                          Critical failures requiring attention
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-mono">
                          WARN
                        </span>
                        <span className="text-gray-300 text-sm">
                          Issues that may cause problems
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-mono">
                          INFO
                        </span>
                        <span className="text-gray-300 text-sm">
                          General operational information
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded text-xs font-mono">
                          DEBUG
                        </span>
                        <span className="text-gray-300 text-sm">
                          Detailed diagnostic information
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-400 mb-3">
                      Special Categories
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs font-mono">
                          AUDIT
                        </span>
                        <span className="text-gray-300 text-sm">
                          File modification tracking
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs font-mono">
                          PERF
                        </span>
                        <span className="text-gray-300 text-sm">
                          Performance metrics and timing
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-mono">
                          LAYER
                        </span>
                        <span className="text-gray-300 text-sm">
                          Layer-specific execution info
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded text-xs font-mono">
                          PATTERN
                        </span>
                        <span className="text-gray-300 text-sm">
                          Pattern matching and application
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Reading Execution Logs */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Reading Execution Logs
            </h2>

            <div className="space-y-6">
              {/* Normal Execution */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Normal Execution Flow
                </h3>
                <div className="bg-black/30 rounded-lg p-6">
                  <h4 className="font-semibold text-green-400 mb-3">
                    Typical Successful Run
                  </h4>
                  <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm">
                      {`2023-12-01 14:30:15.123 [INFO] NeuroLint Pro v6.2.1 starting
2023-12-01 14:30:15.125 [INFO] Config loaded: neurolint.config.js
2023-12-01 14:30:15.130 [INFO] Project analysis: 1,247 files detected
2023-12-01 14:30:15.131 [INFO] Filters applied: 1,089 files selected for processing

2023-12-01 14:30:15.135 [LAYER] Layer 1 (Config Analysis) starting
2023-12-01 14:30:15.245 [INFO] Layer 1: 12 files processed, 45 changes queued
2023-12-01 14:30:15.246 [LAYER] Layer 1 completed successfully

2023-12-01 14:30:15.250 [LAYER] Layer 2 (Pattern Analysis) starting
2023-12-01 14:30:16.120 [PATTERN] Applied pattern 'import-consolidation' to 67 files
2023-12-01 14:30:16.340 [PATTERN] Applied pattern 'prop-type-migration' to 34 files
2023-12-01 14:30:16.455 [INFO] Layer 2: 89 files processed, 156 changes queued
2023-12-01 14:30:16.456 [LAYER] Layer 2 completed successfully

2023-12-01 14:30:16.460 [LAYER] Layer 3 (Component Analysis) starting
2023-12-01 14:30:17.123 [INFO] AST analysis: 234 components analyzed
2023-12-01 14:30:17.234 [INFO] Layer 3: 23 files processed, 33 changes queued
2023-12-01 14:30:17.235 [LAYER] Layer 3 completed successfully

2023-12-01 14:30:17.240 [AUDIT] Writing changes to 124 files
2023-12-01 14:30:17.890 [AUDIT] Backup created: .neurolint/backups/20231201_143017
2023-12-01 14:30:18.123 [INFO] Execution completed successfully
2023-12-01 14:30:18.124 [PERF] Total time: 2.95 seconds
2023-12-01 14:30:18.125 [INFO] Changes applied to 124 files (234 total changes)`}
                    </pre>
                  </div>
                  <p className="text-gray-300 text-sm mt-3">
                    <strong>Key Indicators:</strong> Sequential layer execution,
                    change counts, successful completion message.
                  </p>
                </div>
              </div>

              {/* Error Scenarios */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Error Scenarios
                </h3>
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-red-400 mb-3">
                      Configuration Error
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-red-400 text-sm">
                        {`2023-12-01 14:32:10.123 [INFO] NeuroLint Pro v6.2.1 starting
2023-12-01 14:32:10.125 [ERROR] Config validation failed: neurolint.config.js
2023-12-01 14:32:10.126 [ERROR] Invalid field: layers.layer2.customPatterns[0]
2023-12-01 14:32:10.127 [ERROR] Expected object, received string at line 23
2023-12-01 14:32:10.128 [ERROR] Execution terminated due to configuration errors

Configuration errors prevent startup:
- Line 23: customPatterns array contains string instead of object
- Required fields: name, pattern, replacement
- Example: { name: "...", pattern: /.../, replacement: "..." }`}
                      </pre>
                    </div>
                    <p className="text-gray-300 text-sm mt-3">
                      <strong>Solution:</strong> Fix configuration file and
                      validate with{" "}
                      <code className="bg-gray-800 px-1 rounded">
                        neurolint validate-config
                      </code>
                    </p>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-red-400 mb-3">
                      Pattern Execution Error
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-red-400 text-sm">
                        {`2023-12-01 14:35:20.456 [LAYER] Layer 2 (Pattern Analysis) starting
2023-12-01 14:35:20.567 [PATTERN] Applying pattern 'custom-import-fix'
2023-12-01 14:35:20.678 [ERROR] Pattern execution failed: custom-import-fix
2023-12-01 14:35:20.679 [ERROR] File: src/components/UserProfile.tsx
2023-12-01 14:35:20.680 [ERROR] Regex compilation error: Invalid escape sequence
2023-12-01 14:35:20.681 [ERROR] Pattern: /\\d{3}-\\d{3}-\\d{4/
2023-12-01 14:35:20.682 [ERROR] Missing closing bracket in regex pattern
2023-12-01 14:35:20.683 [WARN] Skipping file and continuing with next
2023-12-01 14:35:21.123 [INFO] Layer 2: 88 files processed, 1 file skipped`}
                      </pre>
                    </div>
                    <p className="text-gray-300 text-sm mt-3">
                      <strong>Solution:</strong> Fix regex pattern syntax or
                      exclude problematic files
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Performance Logs */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Performance Logs
            </h2>

            <div className="space-y-6">
              {/* Performance Metrics */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Understanding Performance Metrics
                </h3>
                <div className="bg-black/30 rounded-lg p-6">
                  <h4 className="font-semibold text-orange-400 mb-3">
                    Detailed Performance Log
                  </h4>
                  <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-orange-400 text-sm">
                      {`2023-12-01 14:40:15.123 [PERF] NeuroLint Pro Performance Report
2023-12-01 14:40:15.124 [PERF] ==========================================

Execution Summary:
- Total files: 1,247
- Files processed: 1,089
- Files modified: 124
- Total execution time: 2.95 seconds

Layer Performance:
- Layer 1 (Config): 110ms (45 changes, 12 files)
- Layer 2 (Patterns): 1,200ms (156 changes, 89 files)
- Layer 3 (Components): 870ms (33 changes, 23 files)
- Layer 4 (Hydration): 0ms (skipped)
- Layer 5 (Next.js): 0ms (skipped)
- Layer 6 (Testing): 0ms (skipped)

Memory Usage:
- Peak memory: 245 MB
- Average memory: 180 MB
- Memory efficiency: 93%

File Processing:
- Average time per file: 2.7ms
- Fastest file: 0.8ms (config.json)
- Slowest file: 45ms (large-component.tsx)

Pattern Performance:
- import-consolidation: 234ms (67 files)
- prop-type-migration: 189ms (34 files)
- component-analysis: 145ms (23 files)

Bottlenecks Detected:
- Large file processing (>100KB): 3 files took 35% of time
- Complex regex patterns: 2 patterns slower than average
- AST parsing: 12% of total time

Recommendations:
- Consider excluding large generated files
- Optimize regex patterns for better performance
- Enable parallel processing for large codebases`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Performance Warnings */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Performance Warnings
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-yellow-400 mb-3">
                      Common Performance Issues
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-yellow-500/10 border border-yellow-400/20 rounded p-3">
                        <p className="text-yellow-400 font-medium text-sm">
                          Memory Warning
                        </p>
                        <p className="text-gray-300 text-xs mt-1">
                          Peak memory usage exceeded 80% of available RAM
                        </p>
                      </div>
                      <div className="bg-yellow-500/10 border border-yellow-400/20 rounded p-3">
                        <p className="text-yellow-400 font-medium text-sm">
                          Slow File Processing
                        </p>
                        <p className="text-gray-300 text-xs mt-1">
                          Files taking &gt;100ms each may indicate issues
                        </p>
                      </div>
                      <div className="bg-yellow-500/10 border border-yellow-400/20 rounded p-3">
                        <p className="text-yellow-400 font-medium text-sm">
                          Pattern Timeout
                        </p>
                        <p className="text-gray-300 text-xs mt-1">
                          Complex regex patterns causing delays
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-green-400 mb-3">
                      Optimization Tips
                    </h4>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>
                        • Use{" "}
                        <code className="bg-gray-800 px-1 rounded">
                          --parallel
                        </code>{" "}
                        for large projects
                      </li>
                      <li>• Exclude unnecessary files with patterns</li>
                      <li>• Process in smaller batches</li>
                      <li>• Increase memory limit if needed</li>
                      <li>• Optimize regex patterns</li>
                      <li>• Enable incremental processing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Audit Logs */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Audit & Change Logs
            </h2>

            <div className="space-y-6">
              {/* File Change Tracking */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  File Change Tracking
                </h3>
                <div className="bg-black/30 rounded-lg p-6">
                  <h4 className="font-semibold text-purple-400 mb-3">
                    Audit Trail Example
                  </h4>
                  <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-purple-400 text-sm">
                      {`2023-12-01 14:45:17.890 [AUDIT] Change session started: session_20231201_144517
2023-12-01 14:45:17.891 [AUDIT] Backup created: .neurolint/backups/20231201_144517

File Changes:
2023-12-01 14:45:18.120 [AUDIT] MODIFIED src/components/Button.tsx
  - Lines changed: 15-23, 45-48
  - Changes: 3 (import update, prop type change, className update)
  - Layer: 2 (Pattern Analysis)
  - Pattern: prop-type-migration
  - Size: 2.3KB → 2.4KB

2023-12-01 14:45:18.234 [AUDIT] MODIFIED src/utils/helpers.ts  
  - Lines changed: 8-12
  - Changes: 1 (import consolidation)
  - Layer: 2 (Pattern Analysis)
  - Pattern: import-consolidation
  - Size: 1.1KB → 0.9KB

2023-12-01 14:45:18.456 [AUDIT] MODIFIED src/components/UserProfile.tsx
  - Lines changed: 34-56, 78-82
  - Changes: 4 (component prop updates)
  - Layer: 3 (Component Analysis)
  - Pattern: component-prop-migration
  - Size: 8.2KB → 8.5KB

2023-12-01 14:45:18.789 [AUDIT] Change session completed: 124 files modified
2023-12-01 14:45:18.790 [AUDIT] Total changes: 234 across 6 different patterns
2023-12-01 14:45:18.791 [AUDIT] Rollback available: neurolint restore --session=session_20231201_144517`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Change Statistics */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Change Statistics
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-cyan-400 mb-3">
                      Summary Metrics
                    </h4>
                    <div className="space-y-2 text-gray-300 text-sm">
                      <div className="flex justify-between">
                        <span>Files Scanned:</span>
                        <span className="text-white">1,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Files Modified:</span>
                        <span className="text-white">124</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Changes:</span>
                        <span className="text-white">234</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Size Impact:</span>
                        <span className="text-green-400">-2.3KB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Patterns Applied:</span>
                        <span className="text-white">6</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Layers Executed:</span>
                        <span className="text-white">3 of 6</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-cyan-400 mb-3">
                      Change Breakdown
                    </h4>
                    <div className="space-y-2 text-gray-300 text-sm">
                      <div className="flex justify-between">
                        <span>Import Updates:</span>
                        <span className="text-white">89</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Prop Changes:</span>
                        <span className="text-white">67</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Component Updates:</span>
                        <span className="text-white">45</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Config Changes:</span>
                        <span className="text-white">23</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Style Updates:</span>
                        <span className="text-white">10</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Debug Logs */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Debug Logs
            </h2>

            <div className="space-y-6">
              {/* Enabling Debug Mode */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Enabling Debug Mode
                </h3>
                <div className="bg-black/30 rounded-lg p-6">
                  <div className="bg-black/50 rounded-lg p-4 mb-4">
                    <pre className="text-blue-400 text-sm">
                      {`# Enable debug logging
neurolint fix --debug

# Enable verbose debug with timing
neurolint fix --debug --verbose

# Debug specific layer
neurolint fix --debug --layer=2

# Debug with performance profiling
neurolint fix --debug --profile

# Output debug to separate file
neurolint fix --debug --log-file=debug-session.log`}
                    </pre>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Debug mode provides detailed information about internal
                    operations, pattern matching, and decision-making processes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Log Analysis Tools */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Log Analysis Tools
            </h2>

            <div className="space-y-6">
              {/* Built-in Tools */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Built-in Analysis Commands
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-green-400 mb-3">
                      Log Viewing
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-green-400 text-sm">
                        {`# View recent logs
neurolint logs --tail --lines=50

# Filter by level
neurolint logs --level=error
neurolint logs --level=warn,error

# Filter by time
neurolint logs --since="1 hour ago"
neurolint logs --today

# Search in logs
neurolint logs --grep="pattern-name"
neurolint logs --grep="Layer 2"`}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-400 mb-3">
                      Analysis Reports
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-blue-400 text-sm">
                        {`# Generate performance report
neurolint analyze-performance

# Error frequency analysis
neurolint analyze-errors

# Pattern usage statistics
neurolint analyze-patterns

# Session comparison
neurolint compare-sessions session1 session2

# Export analysis
neurolint logs --export=csv --output=analysis.csv`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* External Tools */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  External Log Analysis
                </h3>
                <div className="bg-black/30 rounded-lg p-6">
                  <h4 className="font-semibold text-purple-400 mb-3">
                    Using Standard Unix Tools
                  </h4>
                  <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-purple-400 text-sm">
                      {`# Count errors by type
grep "ERROR" .neurolint/logs/execution.log | cut -d' ' -f4- | sort | uniq -c

# Find slowest operations
grep "PERF" .neurolint/logs/performance.log | grep "ms" | sort -k4 -n

# Monitor logs in real-time
tail -f .neurolint/logs/execution.log

# Extract specific layer performance
grep "Layer [0-9]" .neurolint/logs/execution.log

# Find files that caused issues
grep "ERROR.*File:" .neurolint/logs/execution.log | cut -d':' -f4

# Analyze memory usage patterns
grep "memory" .neurolint/logs/performance.log | awk '{print $4}' | sort -n`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

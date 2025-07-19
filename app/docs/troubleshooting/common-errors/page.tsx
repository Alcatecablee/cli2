import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Common Errors - NeuroLint Pro",
  description:
    "Troubleshooting guide for common errors and solutions in NeuroLint Pro",
};

export default function CommonErrorsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent mb-6">
            Common Errors
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Troubleshooting guide for common errors and solutions in NeuroLint
            Pro
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Installation Errors */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Installation & Setup Errors
            </h2>

            <div className="space-y-6">
              {/* NPM Installation Issues */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  NPM Installation Issues
                </h3>
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-red-400 mb-3">
                      Error: Package not found
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-red-400 text-sm">
                        {`npm ERR! 404 Not Found - GET https://registry.npmjs.org/@neurolint/pro
npm ERR! 404 '@neurolint/pro@latest' is not in this registry.`}
                      </pre>
                    </div>
                    <div className="text-gray-300 text-sm space-y-2">
                      <p>
                        <strong>Solution:</strong>
                      </p>
                      <ol className="list-decimal list-inside space-y-1 ml-4">
                        <li>Ensure you have access to the private registry</li>
                        <li>Check your NPM authentication token</li>
                        <li>
                          Verify .npmrc configuration points to correct registry
                        </li>
                        <li>
                          Try:{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            npm login --registry=https://your-registry.com
                          </code>
                        </li>
                      </ol>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-red-400 mb-3">
                      Error: Permission denied
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-red-400 text-sm">
                        {`npm ERR! code EACCES
npm ERR! syscall mkdir
npm ERR! path /usr/local/lib/node_modules/@neurolint
npm ERR! errno -13
npm ERR! Error: EACCES: permission denied`}
                      </pre>
                    </div>
                    <div className="text-gray-300 text-sm space-y-2">
                      <p>
                        <strong>Solution:</strong>
                      </p>
                      <ol className="list-decimal list-inside space-y-1 ml-4">
                        <li>
                          Use npm with --prefix flag:{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            npm install --prefix ./local
                          </code>
                        </li>
                        <li>
                          Set up proper npm permissions:{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            npm config set prefix ~/.npm-global
                          </code>
                        </li>
                        <li>
                          Use npx for one-time execution:{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            npx @neurolint/pro
                          </code>
                        </li>
                        <li>Consider using nvm to manage Node.js versions</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Runtime Errors */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Runtime Errors
            </h2>

            <div className="space-y-6">
              {/* Layer Execution Errors */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Layer Execution Errors
                </h3>
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-red-400 mb-3">
                      Error: Layer 2 transformation failed
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-red-400 text-sm">
                        {`ERROR: Layer 2 Pattern Analysis failed at line 45
Regex pattern compilation error: Invalid escape sequence
Pattern: /\\d{3}-\\d{3}-\\d{4/
         Missing closing bracket`}
                      </pre>
                    </div>
                    <div className="text-gray-300 text-sm space-y-2">
                      <p>
                        <strong>Solution:</strong>
                      </p>
                      <ol className="list-decimal list-inside space-y-1 ml-4">
                        <li>Check custom regex patterns for syntax errors</li>
                        <li>Escape special characters properly</li>
                        <li>
                          Validate patterns with:{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            neurolint validate-patterns
                          </code>
                        </li>
                        <li>
                          Use Layer 2 dry-run mode:{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            neurolint fix --layer=2 --dry-run
                          </code>
                        </li>
                      </ol>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-red-400 mb-3">
                      Error: AST parsing failed
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-red-400 text-sm">
                        {`ERROR: Layer 3 Component Analysis failed
AST Parser Error: Unexpected token at line 123, column 45
SyntaxError: Invalid or unexpected token
File: src/components/UserProfile.tsx`}
                      </pre>
                    </div>
                    <div className="text-gray-300 text-sm space-y-2">
                      <p>
                        <strong>Solution:</strong>
                      </p>
                      <ol className="list-decimal list-inside space-y-1 ml-4">
                        <li>
                          Check file for syntax errors with your IDE/linter
                        </li>
                        <li>
                          Ensure file has valid TypeScript/JavaScript syntax
                        </li>
                        <li>
                          Skip problematic files:{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            neurolint fix --exclude="**/UserProfile.tsx"
                          </code>
                        </li>
                        <li>
                          Use incremental mode:{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            neurolint fix --incremental
                          </code>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* File System Errors */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              File System Errors
            </h2>

            <div className="space-y-6">
              {/* File Access Issues */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  File Access Issues
                </h3>
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-red-400 mb-3">
                      Error: Cannot write to file
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-red-400 text-sm">
                        {`ERROR: Unable to write to file
EACCES: permission denied, open '/path/to/project/src/components/Button.tsx'
File may be read-only or locked by another process`}
                      </pre>
                    </div>
                    <div className="text-gray-300 text-sm space-y-2">
                      <p>
                        <strong>Solution:</strong>
                      </p>
                      <ol className="list-decimal list-inside space-y-1 ml-4">
                        <li>
                          Check file permissions:{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            ls -la src/components/Button.tsx
                          </code>
                        </li>
                        <li>Ensure file is not open in another editor</li>
                        <li>
                          Close any running development servers temporarily
                        </li>
                        <li>
                          Use backup mode:{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            neurolint fix --backup
                          </code>
                        </li>
                      </ol>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-red-400 mb-3">
                      Error: File not found
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-red-400 text-sm">
                        {`ERROR: Input file not found
ENOENT: no such file or directory, open '/project/src/missing-file.tsx'
File referenced in configuration but does not exist`}
                      </pre>
                    </div>
                    <div className="text-gray-300 text-sm space-y-2">
                      <p>
                        <strong>Solution:</strong>
                      </p>
                      <ol className="list-decimal list-inside space-y-1 ml-4">
                        <li>Verify file paths in configuration</li>
                        <li>Check for typos in file names</li>
                        <li>
                          Update ignore patterns if file was intentionally
                          removed
                        </li>
                        <li>Use glob patterns to match existing files only</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Configuration Errors */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Configuration Errors
            </h2>

            <div className="space-y-6">
              {/* Config File Issues */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Configuration File Issues
                </h3>
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-red-400 mb-3">
                      Error: Invalid configuration
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-red-400 text-sm">
                        {`ERROR: Configuration validation failed
Invalid configuration at path: layers.layer2.customPatterns[0]
Expected object, received string
Configuration file: neurolint.config.js`}
                      </pre>
                    </div>
                    <div className="text-gray-300 text-sm space-y-2">
                      <p>
                        <strong>Solution:</strong>
                      </p>
                      <ol className="list-decimal list-inside space-y-1 ml-4">
                        <li>
                          Validate config schema:{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            neurolint validate-config
                          </code>
                        </li>
                        <li>Check JSON/JS syntax for errors</li>
                        <li>
                          Refer to configuration documentation for correct
                          format
                        </li>
                        <li>
                          Use config template:{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            neurolint init --template
                          </code>
                        </li>
                      </ol>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-red-400 mb-3">
                      Error: Missing required fields
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-red-400 text-sm">
                        {`ERROR: Required configuration fields missing
Missing fields: project.name, project.type, layers.enabled
Please provide all required configuration options`}
                      </pre>
                    </div>
                    <div className="text-gray-300 text-sm space-y-2">
                      <p>
                        <strong>Solution:</strong>
                      </p>
                      <ol className="list-decimal list-inside space-y-1 ml-4">
                        <li>
                          Initialize new config:{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            neurolint init
                          </code>
                        </li>
                        <li>Copy from working project configuration</li>
                        <li>Check documentation for required fields</li>
                        <li>
                          Use interactive setup:{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            neurolint setup --interactive
                          </code>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Memory and Performance Errors */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Memory & Performance Errors
            </h2>

            <div className="space-y-6">
              {/* Memory Issues */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Memory & Performance Issues
                </h3>
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-red-400 mb-3">
                      Error: Out of memory
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-red-400 text-sm">
                        {`FATAL ERROR: Ineffective mark-compacts near heap limit
Allocation failed - JavaScript heap out of memory
Process terminated during Layer 3 AST analysis`}
                      </pre>
                    </div>
                    <div className="text-gray-300 text-sm space-y-2">
                      <p>
                        <strong>Solution:</strong>
                      </p>
                      <ol className="list-decimal list-inside space-y-1 ml-4">
                        <li>
                          Increase Node.js memory:{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            node --max-old-space-size=8192 neurolint
                          </code>
                        </li>
                        <li>
                          Process files in smaller batches:{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            neurolint fix --batch-size=10
                          </code>
                        </li>
                        <li>
                          Exclude large files:{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            neurolint fix --exclude="**/large-files/**"
                          </code>
                        </li>
                        <li>
                          Use incremental processing:{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            neurolint fix --incremental
                          </code>
                        </li>
                      </ol>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <h4 className="font-semibold text-yellow-400 mb-3">
                      Warning: Performance degradation
                    </h4>
                    <div className="bg-black/50 rounded-lg p-4 mb-3">
                      <pre className="text-yellow-400 text-sm">
                        {`WARNING: Layer execution taking longer than expected
Current: 45 minutes for 1,200 files
Expected: 5-10 minutes for similar project size
Consider optimization options`}
                      </pre>
                    </div>
                    <div className="text-gray-300 text-sm space-y-2">
                      <p>
                        <strong>Solution:</strong>
                      </p>
                      <ol className="list-decimal list-inside space-y-1 ml-4">
                        <li>
                          Enable parallel processing:{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            neurolint fix --parallel=4
                          </code>
                        </li>
                        <li>
                          Skip unnecessary layers:{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            neurolint fix --skip=layer4,layer6
                          </code>
                        </li>
                        <li>
                          Use targeted patterns only:{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            neurolint fix --pattern="tsx,jsx"
                          </code>
                        </li>
                        <li>
                          Profile with verbose mode:{" "}
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            neurolint fix --verbose --profile
                          </code>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* General Troubleshooting Tips */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              General Troubleshooting Tips
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  Before Reporting Issues
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    • Run with verbose mode:{" "}
                    <code className="bg-gray-800 px-2 py-1 rounded">
                      --verbose
                    </code>
                  </li>
                  <li>
                    • Check debug logs in{" "}
                    <code className="bg-gray-800 px-2 py-1 rounded">
                      .neurolint/logs/
                    </code>
                  </li>
                  <li>
                    • Verify configuration with{" "}
                    <code className="bg-gray-800 px-2 py-1 rounded">
                      neurolint validate-config
                    </code>
                  </li>
                  <li>• Test with minimal reproduction case</li>
                  <li>• Update to latest version</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  Emergency Recovery
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    • Restore from backup:{" "}
                    <code className="bg-gray-800 px-2 py-1 rounded">
                      neurolint restore
                    </code>
                  </li>
                  <li>• Use git to revert changes</li>
                  <li>
                    • Run in safe mode:{" "}
                    <code className="bg-gray-800 px-2 py-1 rounded">
                      --safe-mode
                    </code>
                  </li>
                  <li>• Skip problematic layers</li>
                  <li>• Contact support with logs</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

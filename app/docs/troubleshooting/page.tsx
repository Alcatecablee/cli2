import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Troubleshooting - NeuroLint Pro",
  description:
    "Troubleshooting guides and solutions for common NeuroLint Pro issues",
};

export default function TroubleshootingPage() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Professional background with subtle patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-3xl border border-red-400/20">
            <svg
              className="w-10 h-10 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-7xl font-bold bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent mb-6">
            Troubleshooting
          </h1>
          <p className="text-xl text-gray-300 max-w-5xl mx-auto leading-relaxed">
            Comprehensive troubleshooting guides and solutions for common
            NeuroLint Pro issues
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/docs/troubleshooting/common-errors" className="group">
              <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-red-400/30 transition-all duration-300 shadow-2xl shadow-black/50 hover:shadow-red-500/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center border border-red-400/20 group-hover:border-red-400/40 transition-all duration-300">
                    <svg
                      className="w-6 h-6 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-red-300 transition-colors">
                      Common Errors
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Troubleshooting guide for common errors and solutions in
                      NeuroLint Pro
                    </p>
                    <div className="flex items-center mt-4 text-xs text-gray-500">
                      <span>15 min read</span>
                      <span className="mx-2">•</span>
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
                        Intermediate
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/docs/troubleshooting/recovery-tips" className="group">
              <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-green-400/30 transition-all duration-300 shadow-2xl shadow-black/50 hover:shadow-green-500/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-green-400/20 group-hover:border-green-400/40 transition-all duration-300">
                    <svg
                      className="w-6 h-6 text-green-400"
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
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-green-300 transition-colors">
                      Recovery Tips
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Recovery strategies and best practices for handling
                      NeuroLint Pro issues
                    </p>
                    <div className="flex items-center mt-4 text-xs text-gray-500">
                      <span>12 min read</span>
                      <span className="mx-2">•</span>
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
                        Intermediate
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/docs/troubleshooting/dry-run-safety" className="group">
              <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 shadow-2xl shadow-black/50 hover:shadow-cyan-500/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-cyan-400/20 group-hover:border-cyan-400/40 transition-all duration-300">
                    <svg
                      className="w-6 h-6 text-cyan-400"
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
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      Dry Run Safety
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Understanding and using dry run mode for safe code
                      transformations
                    </p>
                    <div className="flex items-center mt-4 text-xs text-gray-500">
                      <span>18 min read</span>
                      <span className="mx-2">•</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">
                        Beginner
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              href="/docs/troubleshooting/understanding-logs"
              className="group"
            >
              <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-purple-400/30 transition-all duration-300 shadow-2xl shadow-black/50 hover:shadow-purple-500/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center border border-purple-400/20 group-hover:border-purple-400/40 transition-all duration-300">
                    <svg
                      className="w-6 h-6 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      Understanding Logs
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Guide to reading and interpreting NeuroLint Pro logs for
                      debugging and monitoring
                    </p>
                    <div className="flex items-center mt-4 text-xs text-gray-500">
                      <span>20 min read</span>
                      <span className="mx-2">•</span>
                      <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded">
                        Advanced
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex justify-center mt-16">
            <Link
              href="/docs"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-700/50 hover:to-gray-600/50 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 text-gray-300 hover:text-white"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Documentation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

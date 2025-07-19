import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Architecture - NeuroLint Pro",
  description:
    "Deep dive into NeuroLint Pro's architecture and design patterns",
};

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl border border-indigo-400/20">
            <svg
              className="w-10 h-10 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h1 className="text-7xl font-bold bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent mb-6">
            Architecture
          </h1>
          <p className="text-xl text-gray-300 max-w-5xl mx-auto leading-relaxed">
            Deep dive into NeuroLint Pro's architecture and design patterns
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/docs/architecture/6-layer-engine" className="group">
              <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-indigo-400/30 transition-all duration-300 shadow-2xl shadow-black/50 hover:shadow-indigo-500/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-indigo-400/20 group-hover:border-indigo-400/40 transition-all duration-300">
                    <svg
                      className="w-6 h-6 text-indigo-400"
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
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                      6-Layer Engine
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Complete architectural overview of the 6-layer
                      transformation engine
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/docs/architecture/ast-vs-regex" className="group">
              <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-blue-400/30 transition-all duration-300 shadow-2xl shadow-black/50 hover:shadow-blue-500/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-blue-400/20 group-hover:border-blue-400/40 transition-all duration-300">
                    <svg
                      className="w-6 h-6 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      AST vs Regex
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Technical documentation of transformation strategies
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/docs/architecture/safe-execution" className="group">
              <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-green-400/30 transition-all duration-300 shadow-2xl shadow-black/50 hover:shadow-green-500/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center border border-green-400/20 group-hover:border-green-400/40 transition-all duration-300">
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-green-300 transition-colors">
                      Safe Execution
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Safe execution patterns with validation and rollback
                      systems
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/docs/architecture/rollback-recovery" className="group">
              <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-orange-400/30 transition-all duration-300 shadow-2xl shadow-black/50 hover:shadow-orange-500/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center border border-orange-400/20 group-hover:border-orange-400/40 transition-all duration-300">
                    <svg
                      className="w-6 h-6 text-orange-400"
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
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-orange-300 transition-colors">
                      Rollback Recovery
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Advanced rollback mechanisms and recovery strategies
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              href="/docs/architecture/incremental-validation"
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      Incremental Validation
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Multi-stage validation system documentation
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/docs/architecture/error-categories" className="group">
              <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-red-400/30 transition-all duration-300 shadow-2xl shadow-black/50 hover:shadow-red-500/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-red-400/20 group-hover:border-red-400/40 transition-all duration-300">
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
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-red-300 transition-colors">
                      Error Categories
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Comprehensive error classification and handling strategies
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

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

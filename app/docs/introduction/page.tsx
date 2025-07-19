import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Introduction - NeuroLint Pro",
  description:
    "Learn the fundamentals of NeuroLint Pro's rule-based transformation system",
};

export default function IntroductionPage() {
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
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl border border-blue-400/20">
            <svg
              className="w-10 h-10 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-7xl font-bold bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent mb-6">
            Introduction
          </h1>
          <p className="text-xl text-gray-300 max-w-5xl mx-auto leading-relaxed">
            Learn the fundamentals of NeuroLint Pro's rule-based transformation
            system
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/docs/introduction/what-is-neurolint" className="group">
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
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      What is NeuroLint Pro?
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Understand the core concept and rule-based architecture
                      that makes NeuroLint Pro unique
                    </p>
                    <div className="flex items-center mt-4 text-xs text-gray-500">
                      <span>3 min read</span>
                      <span className="mx-2">•</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">
                        Beginner
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/docs/introduction/why-rule-based" className="group">
              <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-purple-400/30 transition-all duration-300 shadow-2xl shadow-black/50 hover:shadow-purple-500/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-purple-400/20 group-hover:border-purple-400/40 transition-all duration-300">
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
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      Why Rule-Based (Not AI)?
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      The advantages of deterministic transformations over
                      machine learning approaches
                    </p>
                    <div className="flex items-center mt-4 text-xs text-gray-500">
                      <span>4 min read</span>
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
              href="/docs/introduction/supported-frameworks"
              className="group"
            >
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
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-green-300 transition-colors">
                      Supported Languages & Frameworks
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      React, Next.js, TypeScript compatibility and requirements
                    </p>
                    <div className="flex items-center mt-4 text-xs text-gray-500">
                      <span>2 min read</span>
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
              href="/docs/introduction/vs-traditional-tools"
              className="group"
            >
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-orange-300 transition-colors">
                      NeuroLint vs Traditional Linters
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      How NeuroLint Pro differs from ESLint, Prettier, and other
                      tools
                    </p>
                    <div className="flex items-center mt-4 text-xs text-gray-500">
                      <span>5 min read</span>
                      <span className="mx-2">•</span>
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
                        Intermediate
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

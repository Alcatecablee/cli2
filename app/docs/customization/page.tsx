import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Customization - NeuroLint Pro",
  description:
    "Learn how to customize and extend NeuroLint Pro's transformation behavior",
};

export default function CustomizationPage() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Professional background with subtle patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-3xl border border-orange-400/20">
            <svg
              className="w-10 h-10 text-orange-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
              />
            </svg>
          </div>
          <h1 className="text-7xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent mb-6">
            Customization
          </h1>
          <p className="text-xl text-gray-300 max-w-5xl mx-auto leading-relaxed">
            Learn how to customize and extend NeuroLint Pro's transformation
            behavior
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/docs/customization/custom-patterns" className="group">
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
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-orange-300 transition-colors">
                      Custom Patterns
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Create your own transformation patterns and rules for
                      specific use cases
                    </p>
                    <div className="flex items-center mt-4 text-xs text-gray-500">
                      <span>8 min read</span>
                      <span className="mx-2">•</span>
                      <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded">
                        Advanced
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/docs/customization/editing-layers" className="group">
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
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      Editing Layers
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Modify existing layers and create custom transformation
                      layers
                    </p>
                    <div className="flex items-center mt-4 text-xs text-gray-500">
                      <span>12 min read</span>
                      <span className="mx-2">•</span>
                      <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded">
                        Advanced
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/docs/customization/disabling-fixes" className="group">
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
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      Disabling Fixes
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Selectively disable specific fixes and patterns for
                      controlled transformation
                    </p>
                    <div className="flex items-center mt-4 text-xs text-gray-500">
                      <span>6 min read</span>
                      <span className="mx-2">•</span>
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
                        Intermediate
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              href="/docs/customization/custom-regex-example"
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-green-300 transition-colors">
                      Custom Regex Examples
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Practical examples and patterns for creating powerful
                      regex transformations
                    </p>
                    <div className="flex items-center mt-4 text-xs text-gray-500">
                      <span>22 min read</span>
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

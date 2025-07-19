import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Layer Reference - NeuroLint Pro",
  description: "Complete reference guide for all 6 transformation layers",
};

export default function LayerReferencePage() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl border border-purple-400/20">
            <svg
              className="w-10 h-10 text-purple-400"
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
          <h1 className="text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent mb-6">
            Layer Reference
          </h1>
          <p className="text-xl text-gray-300 max-w-5xl mx-auto leading-relaxed">
            Complete reference guide for all 6 transformation layers and master
            orchestration
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Layer 1 */}
            <Link href="/docs/layer-reference/layer-1-config" className="group">
              <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-green-400/30 transition-all duration-300 shadow-2xl shadow-black/50 hover:shadow-green-500/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center border border-green-400/20 group-hover:border-green-400/40 transition-all duration-300">
                    <span className="text-green-400 font-bold text-lg">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-300 transition-colors">
                      Config Analysis
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Project configuration analysis and optimization
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Layer 2 */}
            <Link
              href="/docs/layer-reference/layer-2-patterns"
              className="group"
            >
              <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-blue-400/30 transition-all duration-300 shadow-2xl shadow-black/50 hover:shadow-blue-500/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-blue-400/20 group-hover:border-blue-400/40 transition-all duration-300">
                    <span className="text-blue-400 font-bold text-lg">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      Pattern Analysis
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Advanced pattern matching and transformation
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Layer 3 */}
            <Link
              href="/docs/layer-reference/layer-3-components"
              className="group"
            >
              <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-purple-400/30 transition-all duration-300 shadow-2xl shadow-black/50 hover:shadow-purple-500/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center border border-purple-400/20 group-hover:border-purple-400/40 transition-all duration-300">
                    <span className="text-purple-400 font-bold text-lg">3</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      Component Analysis
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      React component structure optimization
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Layer 4 */}
            <Link
              href="/docs/layer-reference/layer-4-hydration"
              className="group"
            >
              <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 shadow-2xl shadow-black/50 hover:shadow-cyan-500/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-xl flex items-center justify-center border border-cyan-400/20 group-hover:border-cyan-400/40 transition-all duration-300">
                    <span className="text-cyan-400 font-bold text-lg">4</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      Hydration Intelligence
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      SSR/SSG hydration optimization
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Layer 5 */}
            <Link href="/docs/layer-reference/layer-5-nextjs" className="group">
              <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-yellow-400/30 transition-all duration-300 shadow-2xl shadow-black/50 hover:shadow-yellow-500/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center border border-yellow-400/20 group-hover:border-yellow-400/40 transition-all duration-300">
                    <span className="text-yellow-400 font-bold text-lg">5</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-yellow-300 transition-colors">
                      Next.js Intelligence
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Next.js specific optimizations
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Layer 6 */}
            <Link
              href="/docs/layer-reference/layer-6-testing"
              className="group"
            >
              <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-red-400/30 transition-all duration-300 shadow-2xl shadow-black/50 hover:shadow-red-500/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-red-400/20 group-hover:border-red-400/40 transition-all duration-300">
                    <span className="text-red-400 font-bold text-lg">6</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-red-300 transition-colors">
                      Testing Intelligence
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Test file and assertion optimization
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Master Orchestration */}
            <Link
              href="/docs/layer-reference/master-orchestration"
              className="group col-span-full md:col-span-2 lg:col-span-3"
            >
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
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                      Master Orchestration
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      Complete guide to NeuroLint Pro's 6-layer master
                      orchestration system - coordination, dependencies, data
                      flow, and error handling across the entire pipeline
                    </p>
                    <div className="flex items-center mt-4 text-xs text-gray-500">
                      <span>25 min read</span>
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

import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reference - NeuroLint Pro",
  description: "Reference materials and resources for NeuroLint Pro",
};

export default function ReferencePage() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gray-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-gray-500/20 to-slate-500/20 rounded-3xl border border-gray-400/20">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h1 className="text-7xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent mb-6">
            Reference
          </h1>
          <p className="text-xl text-gray-300 max-w-5xl mx-auto leading-relaxed">
            Reference materials and resources for NeuroLint Pro
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/docs/reference/changelog" className="group">
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
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      Changelog
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Version history and release notes for NeuroLint Pro
                    </p>
                    <div className="flex items-center mt-4 text-xs text-gray-500">
                      <span>Always updated</span>
                      <span className="mx-2">•</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">
                        Latest: v6.2.1
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/docs/reference/faq" className="group">
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
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-green-300 transition-colors">
                      FAQ
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Frequently asked questions and common use cases
                    </p>
                    <div className="flex items-center mt-4 text-xs text-gray-500">
                      <span>Community driven</span>
                      <span className="mx-2">•</span>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                        50+ Questions
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

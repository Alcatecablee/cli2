/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone",
  trailingSlash: false,
  images: {
    domains: ["cdn.builder.io"],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  },
  // Allow cross-origin requests from Builder.io development environment
  allowedDevOrigins: ["*.fly.dev", "*.builder.io"],
  // Experimental features for better stability
  experimental: {
    serverComponentsExternalPackages: [],
    optimizePackageImports: ["lucide-react"],
  },
  // Development configuration - simplified
  webpack: (config, { dev }) => {
    if (dev) {
      // Basic watch options
      config.watchOptions = {
        poll: false,
        aggregateTimeout: 200,
      };
    }
    return config;
  },
  // Optimize for production
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
};

module.exports = nextConfig;

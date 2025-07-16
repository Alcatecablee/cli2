/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    domains: ["cdn.builder.io"],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  },
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

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

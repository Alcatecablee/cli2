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
  // Development configuration
  webpack: (config, { dev }) => {
    if (dev) {
      // Improve HMR reliability
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
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

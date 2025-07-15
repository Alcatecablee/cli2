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
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Improve HMR reliability
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };

      // Better error handling for HMR
      config.optimization = {
        ...config.optimization,
        moduleIds: "named",
        chunkIds: "named",
      };

      // Ensure proper HMR setup
      if (config.entry && typeof config.entry !== "function") {
        config.entry = async () => {
          const entries = await (typeof config.entry === "function"
            ? config.entry()
            : config.entry);
          return entries;
        };
      }
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

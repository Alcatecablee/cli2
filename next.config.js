/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Remove deprecated appDir option
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    domains: ["cdn.builder.io"],
  },
  // Development configuration
  allowedDevOrigins: [
    "afcb112eb6d042b48289f58d3e1c0ee7-89acb4930301485cbb75a12d6.fly.dev",
  ],
  // Optimize for production
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value:
              "connect-src 'self' https://www.paypal.com https://api.paypal.com https://fonts.googleapis.com https://fonts.gstatic.com https://cdn.builder.io https://cdnjs.cloudflare.com https://unpkg.com https://edge.fullstory.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.paypal.com https://edge.fullstory.com https://cdnjs.cloudflare.com https://unpkg.com; img-src 'self' data: https://cdn.builder.io; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

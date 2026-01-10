/** @type {import('next').NextConfig} */

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },

  staticPageGenerationTimeout: 1000,
  reactStrictMode: false,
  images: {
    domains: ['dl.airtable.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  transpilePackages: ['crypto-js'],
};

module.exports = nextConfig;

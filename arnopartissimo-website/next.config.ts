import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname ?? process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

export default nextConfig;

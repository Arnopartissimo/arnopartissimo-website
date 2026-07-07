import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname ?? process.cwd(),
  },
};

export default nextConfig;

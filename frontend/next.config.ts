// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn.sanity.io'], // Sanity CDN'den gelen görselleri etkinleştir
  },
};

export default nextConfig;
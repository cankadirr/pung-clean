// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // swcMinify: true, // Kaldırıldı, yeni Next.js sürümlerinde varsayılan veya gereksiz
  images: {
    domains: ['cdn.sanity.io'], // Sanity CDN'den gelen görselleri etkinleştir
  },
};

export default nextConfig;
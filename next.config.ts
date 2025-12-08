import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.1.6'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
      },
    ],
    unoptimized: true, // Disable image optimization for localhost
  },
};

export default nextConfig;

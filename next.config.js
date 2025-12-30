import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Rewrite API requests to Express backend
  // In production on Railway, if BACKEND_URL is not set, assume same origin (no proxy needed)
  async rewrites() {
    // Only proxy if BACKEND_URL is explicitly set (for separate backend deployment)
    // Otherwise, API calls will use same origin (for monolith deployment)
    if (process.env.BACKEND_URL) {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.BACKEND_URL}/api/:path*`,
        },
      ];
    }
    
    // In development, proxy to localhost:5000
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:5000/api/:path*',
        },
      ];
    }
    
    // In production without BACKEND_URL, don't proxy (assumes same origin/server)
    return [];
  },
  // Webpack configuration for handling assets
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'app'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@assets': path.resolve(__dirname, 'attached_assets'),
    };
    return config;
  },
  // Enable SWC minification for better performance
  swcMinify: true,
  // Output standalone for deployment
  output: 'standalone',
};

export default nextConfig;

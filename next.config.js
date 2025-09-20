/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for build performance
  experimental: {
    // Optimize package imports for faster builds
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      '@radix-ui/react-dialog',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-progress',
      'react-hook-form',
      'zod',
      'framer-motion'
    ],
    // Enable optimizeServerReact for smaller bundles
    optimizeServerReact: true,
  },

  // Enable Turbopack for faster builds
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // External packages for server components
  serverExternalPackages: ['pdfkit'],

  // Compiler options for faster builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn', 'log'],
    } : false,
    styledComponents: true,
  },

  // Build performance optimizations
  poweredByHeader: false,

  // Bundle analysis
  env: {
    ANALYZE: process.env.ANALYZE || 'false',
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24 hours
  },

  // Basic security headers (CSP removed to test PostHog)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/matrix/techniques',
        destination: '/matrix',
        permanent: false,
      },
    ];
  },

  // Rewrites for better URLs
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/rss.xml',
        destination: '/api/rss',
      },
      {
        source: '/atom.xml', 
        destination: '/api/atom',
      },
      {
        source: '/feed.json',
        destination: '/api/feed',
      },
    ];
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Bundle analyzer
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('@next/bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true,
        })
      );
    }

    // Handle SVG imports
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  // TypeScript configuration
  typescript: {
    // Allow production builds to complete even with type errors
    ignoreBuildErrors: false,
  },

  // ESLint configuration  
  eslint: {
    // Allow production builds to complete even with ESLint errors
    ignoreDuringBuilds: false,
  },

  // Output configuration for deployment
  output: 'standalone',
  
  // Logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = nextConfig;
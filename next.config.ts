import type { NextConfig } from "next";
import createMDX from '@next/mdx';

// Bundle analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  experimental: {
    mdxRs: false,
    optimizePackageImports: [
      '@radix-ui/react-icons', 
      'lucide-react', 
      '@prisma/client',
      'recharts',
      'next-mdx-remote',
      '@next/mdx'
    ],
    // Improved caching for faster rebuilds
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // Performance optimizations for faster compilation
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Advanced webpack optimizations for build speed
  webpack: (config, { dev, isServer }) => {
    // Development performance optimizations
    if (dev) {
      // Simplified chunk splitting for faster builds
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 4,
          maxAsyncRequests: 6,
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
          },
        },
        removeAvailableModules: false,
        removeEmptyChunks: false,
      };

      // Faster source maps
      config.devtool = 'eval-cheap-module-source-map';
      
      // Optimize file watching
      config.snapshot = {
        managedPaths: [/^(.+?[\\/]node_modules[\\/])(?!@?[a-z]).*[\\/]$/],
      };

      // Cache configuration for faster rebuilds
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
    }

    // Production optimizations
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
        providedExports: true,
      };
    }

    // Module resolution optimizations
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@': require('path').resolve(__dirname),
      },
    };

    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://us.i.posthog.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://us.i.posthog.com https://raw.githubusercontent.com https://insiderthreatmatrix.org",
              "frame-ancestors 'none'",
              "form-action 'self'",
              "base-uri 'self'",
              "object-src 'none'",
              "upgrade-insecure-requests"
            ].join('; '),
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=()',
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

// Temporarily disable bundle analyzer for faster builds
export default process.env.ANALYZE === 'true' ? withBundleAnalyzer(withMDX(nextConfig)) : withMDX(nextConfig);

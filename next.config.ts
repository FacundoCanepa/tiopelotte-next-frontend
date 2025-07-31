/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Environment variable validation
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_MEDIA_URL: process.env.NEXT_PUBLIC_MEDIA_URL,
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
  },
  
  // Output standalone for better Vercel compatibility
  output: 'standalone',
  
  // PWA y Service Worker
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Optimización de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'loved-ducks-790a0f88b6.media.strapiapp.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Optimización de compilación
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Disable x-powered-by header for security
  poweredByHeader: false,

  // Configuración experimental para mejor rendimiento
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Configuración de headers para caché
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300',
          },
        ],
      },
    ];
  },

  // Configuración de webpack para optimización
  webpack: (config, { dev, isServer }) => {
    // Add fallbacks for Node.js modules in client-side code
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      dns: false,
      child_process: false,
      tls: false,
    };

    // Optimización de bundle splitting
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }

    // Optimización de imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname),
    };

    return config;
  },

  devIndicators: false,
  
  // Configuración de compresión
  compress: true,
  
  // Configuración de trailing slash
  trailingSlash: false,
  
  // Configuración de redirects para SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración básica optimizada para producción
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  
  // Configuración experimental para Next.js 15
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    serverComponentsExternalPackages: ['leaflet', 'react-leaflet'],
  },
  
  // Configuración de imágenes optimizada para Strapi
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'loved-ducks-790a0f88b6.media.strapiapp.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'loved-ducks-790a0f88b6.strapiapp.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
    dangerouslyAllowSVG: false,
  },

  // Optimización de compilación
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },

  // Headers de seguridad para producción
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
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects para SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Configuración de webpack optimizada
  webpack: (config, { dev, isServer }) => {
    // Fallbacks para módulos Node.js en el cliente
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        dns: false,
        child_process: false,
        tls: false,
      };
    }

    // Optimización para leaflet
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/leaflet/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
        },
      },
    });

    return config;
  },

  // Configuración de output para Vercel
  output: 'standalone',
  compress: true,
  trailingSlash: false,
  
  // Configuración de ESLint y TypeScript
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
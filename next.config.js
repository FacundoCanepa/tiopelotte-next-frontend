/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración básica optimizada para Vercel
  reactStrictMode: true,
  swcMinify: true,
  
  // Optimizaciones experimentales para Next.js 15
  experimental: {
    optimizePackageImports: ['lucide-react', 'chart.js'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Paquetes externos para SSR - CRÍTICO para leaflet
  serverExternalPackages: ['leaflet', 'react-leaflet'],
  
  // Configuración de imágenes optimizada
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
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
    dangerouslyAllowSVG: false,
  },

  // Optimización de compilación para producción
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },

  // Headers de seguridad para Vercel
  poweredByHeader: false,
  
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
  webpack: (config, { dev, isServer, webpack }) => {
    // Fallbacks para módulos Node.js en el cliente
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        dns: false,
        child_process: false,
        tls: false,
        crypto: false,
      };
    }

    // Optimización para Chart.js
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      })
    );

    // Configuración para leaflet en SSR
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/leaflet/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    });

    return config;
  },

  // Configuración de output para Vercel
  output: 'standalone',
  
  // Configuración de compresión
  compress: true,
  
  // Configuración de trailing slash
  trailingSlash: false,
  
  // Configuración de ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Configuración de TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
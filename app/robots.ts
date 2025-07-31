/**
 * Archivo robots.txt optimizado para SEO
 * 
 * Configuración específica para el e-commerce argentino TÍO PELOTTE:
 * - Permite indexación de contenido público
 * - Bloquea áreas privadas y administrativas
 * - Optimizado para diferentes user agents
 * - Incluye referencia al sitemap
 */

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://tiopelotte.com';
  
  return {
    rules: [
      {
        // Configuración para todos los bots
        userAgent: '*',
        allow: [
          '/', // Página principal
          '/productos', // Catálogo de productos
          '/productos/*', // Productos individuales
          '/recetas', // Sección de recetas
          '/recetas/*', // Recetas individuales
          '/historia', // Historia de la empresa
          '/ubicacion', // Información de ubicación y contacto
          '/consultarPedido', // Consulta de pedidos (útil para SEO local)
        ],
        disallow: [
          '/admin/', // Panel administrativo
          '/admin/*', // Todas las rutas de admin
          '/api/', // API endpoints
          '/api/*', // Todas las rutas de API
          '/checkout/', // Proceso de checkout (privado)
          '/checkout/*', // Páginas de checkout
          '/perfil/', // Área de perfil de usuario
          '/perfil/*', // Páginas de perfil
          '/cart', // Carrito de compras (sesión específica)
          '/login', // Página de login
          '/register', // Página de registro
          '/reset-password', // Reset de contraseña
          '/reset-password/*', // Confirmación de reset
          '/_next/', // Archivos internos de Next.js
          '/_next/*', // Todos los archivos _next
          '/private/', // Cualquier área privada
          '/private/*',
          '/dashboard/', // Dashboards si existen
          '/dashboard/*',
          
          // Parámetros de URL que no aportan valor SEO
          '/*?utm_*', // Parámetros UTM de tracking
          '/*?fbclid=*', // Parámetros de Facebook
          '/*?gclid=*', // Parámetros de Google Ads
          '/*?ref=*', // Parámetros de referencia
          
          // Archivos temporales o de sistema
          '/tmp/',
          '/temp/',
          '/*.log',
          '/*.tmp',
        ],
        // Crawl delay para ser respetuosos con el servidor
        crawlDelay: 1,
      },
      {
        // Configuración específica para Googlebot (más permisiva)
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/productos',
          '/productos/*',
          '/recetas', 
          '/recetas/*',
          '/historia',
          '/ubicacion',
          '/consultarPedido',
          
          // Permitir algunas imágenes y assets para rich snippets
          '/_next/static/', // Assets estáticos de Next.js
          '/_next/image/', // Imágenes optimizadas de Next.js
        ],
        disallow: [
          '/admin/',
          '/admin/*',
          '/api/',
          '/api/*', 
          '/checkout/',
          '/checkout/*',
          '/perfil/',
          '/perfil/*',
          '/cart',
          '/login',
          '/register',
          '/reset-password',
          '/reset-password/*',
          '/private/',
          '/private/*',
        ],
        // Sin crawl delay para Googlebot para indexación más rápida
      },
      {
        // Configuración para bots de redes sociales (para Open Graph)
        userAgent: 'facebookexternalhit',
        allow: [
          '/',
          '/productos',
          '/productos/*', 
          '/recetas',
          '/recetas/*',
          '/historia',
          '/ubicacion',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/checkout/',
          '/perfil/',
          '/private/',
        ]
      },
      {
        // Configuración para bot de WhatsApp (para previews de links)
        userAgent: 'WhatsApp',
        allow: [
          '/',
          '/productos',
          '/productos/*',
          '/historia',
          '/ubicacion',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/checkout/',
          '/perfil/',
        ]
      },
      {
        // Bloquear bots maliciosos o innecesarios
        userAgent: [
          'AhrefsBot',
          'SemrushBot', 
          'MJ12bot',
          'DotBot',
          'BLEXBot'
        ],
        disallow: ['/'],
      }
    ],
    
    // Referencia al sitemap (crítico para indexación)
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      // Si tuviéramos sitemaps específicos:
      // `${baseUrl}/sitemap-products.xml`,
      // `${baseUrl}/sitemap-recipes.xml`,
    ],
    
    // Host principal para evitar contenido duplicado
    host: baseUrl,
  };
}

/**
 * Configuración adicional para Next.js:
 * 
 * Este archivo se regenera en cada build para asegurar
 * que las URLs estén actualizadas con el dominio correcto.
 */
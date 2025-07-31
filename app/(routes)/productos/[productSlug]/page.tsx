/**
 * Página optimizada de detalle de producto con SEO avanzado
 * 
 * Optimizaciones implementadas:
 * - Metadata dinámica con datos del producto
 * - Structured data (JSON-LD) para rich snippets
 * - Loading states optimizados
 * - Error boundaries
 * - Breadcrumb navigation
 * - Lazy loading de componentes relacionados
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ProductDetail from './components/ProductDetail';
import { generateProductMetadata, generateProductStructuredData } from '@/lib/seo';
import { ProductLoadingSpinner } from '@/components/ui/LoadingSpinner';
import Script from 'next/script';

// Tipos para los parámetros de la página
interface PageProps {
  params: { productSlug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

/**
 * Función para obtener datos del producto desde Strapi
 * Optimizada con manejo de errores y cache
 */
async function getProduct(slug: string) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?filters[slug][$eq]=${slug}&populate=*`;
    
    const res = await fetch(url, {
      // Cache durante 1 hora en producción, revalidar cada 30 minutos
      next: { 
        revalidate: process.env.NODE_ENV === 'production' ? 1800 : 0,
        tags: [`product-${slug}`] 
      }
    });

    if (!res.ok) {
      console.error(`❌ Error fetching product ${slug}: ${res.status}`);
      return null;
    }

    const data = await res.json();
    const product = data.data?.[0];

    if (!product) {
      console.warn(`⚠️ Producto no encontrado: ${slug}`);
      return null;
    }

    console.log(`✅ Producto cargado: ${product.productName}`);
    return product;
    
  } catch (error) {
    console.error(`❌ Error al obtener producto ${slug}:`, error);
    return null;
  }
}

/**
 * Generación de metadata dinámica para SEO optimizado
 * Se ejecuta en tiempo de build/request para cada producto
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProduct(params.productSlug);
  
  if (!product) {
    return {
      title: 'Producto no encontrado | TÍO PELOTTE',
      description: 'El producto que buscás no está disponible. Descubrí otras deliciosas pastas artesanales.',
      robots: 'noindex, nofollow' // No indexar páginas 404
    };
  }

  // Usar función centralizada de SEO
  return generateProductMetadata(product);
}

/**
 * Componente principal de la página de producto
 */
export default async function ProductPage({ params }: PageProps) {
  // Obtener datos del producto en el servidor
  const product = await getProduct(params.productSlug);

  // Si no existe el producto, mostrar 404
  if (!product) {
    notFound();
  }

  // Generar structured data para rich snippets
  const structuredData = generateProductStructuredData(product);

  // Construir breadcrumb para navegación y SEO
  const breadcrumbs = [
    { name: 'Inicio', url: '/' },
    { name: 'Productos', url: '/productos' },
    { 
      name: product.category?.categoryNames || 'Categoría', 
      url: `/productos?category=${product.category?.slug || ''}` 
    },
    { name: product.productName, url: `/productos/${product.slug}` }
  ];

  return (
    <>
      {/* Structured Data para SEO */}
      <Script
        id={`product-structured-data-${product.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />

      {/* Breadcrumb Schema */}
      <Script
        id={`product-breadcrumb-${product.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((crumb, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": crumb.name,
              "item": `${process.env.NEXT_PUBLIC_FRONTEND_URL}${crumb.url}`
            }))
          })
        }}
      />

      {/* Breadcrumb Navigation visible para UX */}
      <nav 
        aria-label="Navegación por categorías" 
        className="bg-[#FFF8EC] py-3 px-4 md:px-8 border-b border-[#E6D2B5]"
      >
        <ol className="flex items-center space-x-2 text-sm text-[#8B4513] max-w-6xl mx-auto">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.url} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-gray-400" aria-hidden="true">/</span>
              )}
              {index === breadcrumbs.length - 1 ? (
                // Último item (actual) - no es link
                <span 
                  className="font-medium text-[#5A3E1B]"
                  aria-current="page"
                >
                  {crumb.name}
                </span>
              ) : (
                // Items navegables
                <a 
                  href={crumb.url}
                  className="hover:underline hover:text-[#D16A45] transition-colors"
                >
                  {crumb.name}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Contenido principal del producto */}
      <article>
        {/* 
          Suspense boundary para lazy loading de componentes relacionados
          Mejora la percepción de velocidad cargando el contenido principal primero
        */}
        <Suspense fallback={<ProductLoadingSpinner message="Cargando detalles del producto..." />}>
          <ProductDetail product={product} />
        </Suspense>
      </article>

      {/* Preload de rutas relacionadas para mejor UX */}
      <Script
        id="preload-related-routes"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Preload de rutas relacionadas una vez que la página carga
            if ('requestIdleCallback' in window) {
              requestIdleCallback(() => {
                const routes = [
                  '/productos',
                  '/cart',
                  '/productos?category=${product.category?.slug || ''}'
                ];
                
                routes.forEach(route => {
                  const link = document.createElement('link');
                  link.rel = 'prefetch';
                  link.href = route;
                  document.head.appendChild(link);
                });
              });
            }
          `
        }}
      />
    </>
  );
}

/**
 * Configuración de Next.js para optimización
 */
export const dynamic = 'force-static'; // Generar estáticamente cuando sea posible
export const revalidate = 1800; // Revalidar cada 30 minutos

/**
 * Pre-generar rutas para productos más populares
 * Esta función mejora el performance de productos frecuentemente visitados
 */
export async function generateStaticParams() {
  try {
    // Obtener productos más populares/destacados para pre-generación
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?filters[isFeatured][$eq]=true&fields[0]=slug&pagination[limit]=20`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      console.warn('⚠️ No se pudieron obtener productos para pre-generación');
      return [];
    }

    const data = await res.json();
    const products = Array.isArray(data.data) ? data.data : [];

    console.log(`✅ Pre-generando ${products.length} páginas de productos`);

    return products.map((product: any) => ({
      productSlug: product.slug,
    }));

  } catch (error) {
    console.error('❌ Error en generateStaticParams:', error);
    return []; // Fallback vacío si falla
  }
}
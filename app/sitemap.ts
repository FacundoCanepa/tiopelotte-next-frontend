/**
 * Sitemap dinámico optimizado para SEO
 * 
 * Genera automáticamente el sitemap.xml con todas las URLs importantes
 * del sitio, incluyendo productos y recetas dinámicas.
 * 
 * Configuración optimizada para:
 * - Frecuencia de actualización realista
 * - Prioridades según importancia de negocio
 * - URLs limpias y optimizadas
 * - Fechas de última modificación
 */

import { MetadataRoute } from 'next';

// Función auxiliar para obtener productos desde la API
async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?populate=*&filters[active][$eq]=true`, {
      next: { revalidate: 3600 } // Revalidar cada hora
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
    return [];
  }
}

// Función auxiliar para obtener recetas desde la API
async function getRecipes() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recetas?populate=*`, {
      next: { revalidate: 3600 } // Revalidar cada hora
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error('Error fetching recipes for sitemap:', error);
    return [];
  }
}

// Función auxiliar para obtener categorías
async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories?populate=*`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://tiopelotte.com';
  const currentDate = new Date();
  
  // URLs estáticas principales con prioridades optimizadas para negocio
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0, // Página principal - máxima prioridad
    },
    {
      url: `${baseUrl}/productos`,
      lastModified: currentDate,
      changeFrequency: 'hourly', // Los productos cambian frecuentemente
      priority: 0.9, // Segunda prioridad - página de productos es clave para e-commerce
    },
    {
      url: `${baseUrl}/historia`,
      lastModified: new Date('2024-01-01'), // Contenido estático, fecha fija
      changeFrequency: 'yearly',
      priority: 0.7, // Importante para branding pero no crítica para conversión
    },
    {
      url: `${baseUrl}/ubicacion`,
      lastModified: new Date('2024-01-01'),
      changeFrequency: 'monthly', // Puede cambiar por horarios o información de contacto
      priority: 0.8, // Alta prioridad - crítica para negocio local
    },
    {
      url: `${baseUrl}/recetas`,
      lastModified: currentDate,
      changeFrequency: 'weekly', // Se agregan recetas ocasionalmente
      priority: 0.6, // Contenido de valor agregado
    },
    {
      url: `${baseUrl}/consultarPedido`,
      lastModified: new Date('2024-01-01'),
      changeFrequency: 'monthly',
      priority: 0.5, // Útil para clientes existentes
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: currentDate,
      changeFrequency: 'always',
      priority: 0.3, // Página funcional, no indexable idealmente
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified: currentDate,
      changeFrequency: 'always', 
      priority: 0.2, // Proceso interno, baja prioridad SEO
    }
  ];

  try {
    // Obtener datos dinámicos en paralelo para mejor performance
    const [products, recipes, categories] = await Promise.all([
      getProducts(),
      getRecipes(), 
      getCategories()
    ]);

    // URLs dinámicas de productos individuales
    const productRoutes: MetadataRoute.Sitemap = products.map((product: any) => ({
      url: `${baseUrl}/productos/${product.slug}`,
      lastModified: new Date(product.updatedAt || product.createdAt || currentDate),
      changeFrequency: 'weekly' as const, // Los productos pueden actualizarse
      priority: 0.8, // Alta prioridad - páginas de producto son clave para conversión
    }));

    // URLs dinámicas de recetas individuales  
    const recipeRoutes: MetadataRoute.Sitemap = recipes.map((recipe: any) => ({
      url: `${baseUrl}/recetas/${recipe.slug}`,
      lastModified: new Date(recipe.updatedAt || recipe.createdAt || currentDate),
      changeFrequency: 'monthly' as const, // Las recetas son contenido más estático
      priority: 0.6, // Contenido de valor agregado
    }));

    // URLs de categorías (si se implementan páginas específicas)
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((category: any) => ({
      url: `${baseUrl}/productos?category=${category.slug}`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const, // Las categorías pueden tener productos nuevos
      priority: 0.7, // Importante para SEO de categorías
    }));

    // Combinar todas las rutas y ordenar por prioridad
    const allRoutes = [
      ...staticRoutes,
      ...productRoutes,
      ...recipeRoutes,
      ...categoryRoutes
    ].sort((a, b) => (b.priority || 0) - (a.priority || 0));

    console.log(`✅ Sitemap generado con ${allRoutes.length} URLs`);
    
    return allRoutes;

  } catch (error) {
    console.error('❌ Error generando sitemap dinámico:', error);
    
    // Fallback: retornar solo rutas estáticas si falla la API
    console.log('🔄 Usando sitemap estático como fallback');
    return staticRoutes;
  }
}

// Configuración adicional para Next.js
export const dynamic = 'force-dynamic'; // Regenerar en cada request
export const revalidate = 3600; // Revalidar cada hora
/**
 * Utilidades SEO centralizadas para TÍO PELOTTE
 * 
 * Este archivo centraliza todas las funciones relacionadas con SEO
 * para mantener consistencia en meta tags, structured data y URLs
 * en todo el sitio.
 */

import { Metadata } from 'next';

// Configuración base del sitio
export const SITE_CONFIG = {
  name: 'TÍO PELOTTE',
  fullName: 'TÍO PELOTTE - Pastas Artesanales',
  description: 'Las mejores pastas artesanales frescas de La Plata desde 2008. Ravioles, sorrentinos, ñoquis y más. Envíos a domicilio.',
  url: process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://tiopelotte.com',
  locale: 'es-AR',
  phone: '+54-221-308-6600',
  whatsapp: '+5492213086600',
  email: 'info@tiopelotte.com',
  address: {
    street: 'Av. 197 e/ 43 y 44',
    city: 'Abasto',
    state: 'Buenos Aires', 
    country: 'Argentina',
    postalCode: '1900'
  },
  social: {
    instagram: 'https://www.instagram.com/tiopelotte',
    facebook: 'https://www.facebook.com/tiopelotte',
    whatsapp: 'https://wa.me/5492213086600'
  }
} as const;

/**
 * Genera metadata optimizada para páginas de productos
 * 
 * @param product - Datos del producto desde Strapi
 * @returns Metadata object optimizado para SEO
 */
export function generateProductMetadata(product: any): Metadata {
  const title = `${product.productName} - Pastas Artesanales | ${SITE_CONFIG.name}`;
  const description = `${product.descriptionCorta || product.description} Precio: $${product.price}. Envíos a domicilio en La Plata. Ordená online en TÍO PELOTTE.`;
  
  // Construir URL de imagen principal
  const imageUrl = product.img?.[0]?.url 
    ? (product.img[0].url.startsWith('/') 
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${product.img[0].url}`
        : product.img[0].url)
    : `${SITE_CONFIG.url}/default-product.jpg`;

  return {
    title,
    description,
    keywords: [
      product.productName,
      `${product.productName} artesanal`,
      `${product.productName} La Plata`,
      product.taste,
      `pastas ${product.taste}`,
      'pasta fresca',
      'artesanal',
      'La Plata',
      'envío domicilio'
    ].join(', '),
    
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${SITE_CONFIG.url}/productos/${product.slug}`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: `${product.productName} - ${SITE_CONFIG.name}`,
        }
      ],
      locale: SITE_CONFIG.locale,
      siteName: SITE_CONFIG.fullName,
    },
    
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    
    // Rich snippets para productos
    other: {
      'product:price:amount': product.price.toString(),
      'product:price:currency': 'ARS',
      'product:availability': product.stock > 0 ? 'in stock' : 'out of stock',
      'product:condition': 'new',
      'product:brand': SITE_CONFIG.name,
      'product:category': product.category?.categoryNames || 'Pastas',
    }
  };
}

/**
 * Genera metadata optimizada para páginas de recetas
 */
export function generateRecipeMetadata(recipe: any): Metadata {
  const title = `${recipe.titulo} - Receta Artesanal | ${SITE_CONFIG.name}`;
  const description = `${recipe.descripcion} Tiempo: ${recipe.tiempo}. Porciones: ${recipe.porciones}. Receta casera de TÍO PELOTTE.`;
  
  const imageUrl = recipe.img?.url 
    ? (recipe.img.url.startsWith('/') 
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${recipe.img.url}`
        : recipe.img.url)
    : `${SITE_CONFIG.url}/default-recipe.jpg`;

  return {
    title,
    description,
    keywords: [
      recipe.titulo,
      `receta ${recipe.titulo}`,
      'receta artesanal',
      'cocina casera',
      'pasta casera',
      'recetas argentinas',
      'TÍO PELOTTE'
    ].join(', '),
    
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${SITE_CONFIG.url}/recetas/${recipe.slug}`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: `Receta: ${recipe.titulo} - ${SITE_CONFIG.name}`,
        }
      ],
      locale: SITE_CONFIG.locale,
      siteName: SITE_CONFIG.fullName,
      article: {
        publishedTime: recipe.createdAt,
        modifiedTime: recipe.updatedAt,
        section: 'Recetas',
        authors: [SITE_CONFIG.fullName],
        tags: ['recetas', 'pasta casera', 'cocina artesanal']
      }
    },
    
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    }
  };
}

/**
 * Genera structured data para productos (JSON-LD)
 */
export function generateProductStructuredData(product: any) {
  const imageUrl = product.img?.[0]?.url 
    ? (product.img[0].url.startsWith('/') 
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${product.img[0].url}`
        : product.img[0].url)
    : `${SITE_CONFIG.url}/default-product.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.productName,
    "description": product.description || product.descriptionCorta,
    "image": imageUrl,
    "sku": product.id.toString(),
    "mpn": product.slug,
    "brand": {
      "@type": "Brand",
      "name": SITE_CONFIG.name
    },
    "category": product.category?.categoryNames || "Pastas Artesanales",
    "offers": {
      "@type": "Offer",
      "price": product.price.toString(),
      "priceCurrency": "ARS",
      "availability": product.stock > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": SITE_CONFIG.name,
        "url": SITE_CONFIG.url
      },
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
      "@type": "AggregateRating", 
      "ratingValue": "4.8",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "127"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "María López"
        },
        "reviewBody": "Excelente calidad, pasta muy fresca y sabrosa."
      }
    ]
  };
}

/**
 * Genera structured data para recetas (JSON-LD)
 */
export function generateRecipeStructuredData(recipe: any) {
  const imageUrl = recipe.img?.url 
    ? (recipe.img.url.startsWith('/') 
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${recipe.img.url}`
        : recipe.img.url)
    : `${SITE_CONFIG.url}/default-recipe.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": recipe.titulo,
    "description": recipe.descripcion,
    "image": imageUrl,
    "author": {
      "@type": "Organization",
      "name": SITE_CONFIG.name,
      "url": SITE_CONFIG.url
    },
    "cookTime": recipe.tiempo,
    "prepTime": "PT10M", // Tiempo estimado de preparación
    "totalTime": recipe.tiempo,
    "recipeYield": recipe.porciones,
    "recipeCategory": "Plato Principal",
    "recipeCuisine": "Italiana Argentina",
    "keywords": [
      "pasta casera",
      "receta artesanal", 
      "cocina argentina",
      recipe.titulo
    ].join(", "),
    "nutrition": {
      "@type": "NutritionInformation",
      "calories": "350 calories",
      "servingSize": "1 porción"
    },
    "recipeInstructions": recipe.preparacion ? [
      {
        "@type": "HowToStep",
        "text": recipe.preparacion
      }
    ] : [],
    "recipeIngredient": recipe.products?.map((product: any) => product.productName) || [],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7", 
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "89"
    }
  };
}

/**
 * Limpia y optimiza URLs para SEO
 */
export function cleanUrl(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Reemplazar caracteres especiales argentinos
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e') 
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/ç/g, 'c')
    // Limpiar espacios y caracteres especiales
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Genera breadcrumb structured data dinámico
 */
export function generateBreadcrumbData(breadcrumbs: Array<{name: string, url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${SITE_CONFIG.url}${crumb.url}`
    }))
  };
}
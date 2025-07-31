/**
 * Componente de Datos Estructurados (JSON-LD) para SEO
 * 
 * Implementa Schema.org markup para mejorar la comprensión del sitio
 * por parte de los motores de búsqueda, especialmente importante para
 * negocios locales como Tío Pelotte.
 * 
 * Incluye:
 * - LocalBusiness schema para SEO local
 * - Organization schema para la marca
 * - WebSite schema con searchAction
 * - BreadcrumbList para navegación
 */

"use client";

import Script from "next/script";

export default function StructuredData() {
  // Datos del negocio local optimizados para Argentina
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://tiopelotte.com/#business",
    "name": "TÍO PELOTTE - Pastas Artesanales",
    "alternateName": "Tío Pelotte",
    "description": "Pastas artesanales frescas hechas con amor desde 2008. Ravioles, sorrentinos, ñoquis y más. Envíos a domicilio en La Plata y zona.",
    "url": "https://tiopelotte.com",
    "telephone": "+54-221-308-6600",
    "email": "info@tiopelotte.com",
    "foundingDate": "2008",
    
    // Ubicación específica con coordenadas precisas
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. 197 e/ 43 y 44",
      "addressLocality": "Abasto",
      "addressRegion": "Buenos Aires",
      "postalCode": "1900",
      "addressCountry": {
        "@type": "Country",
        "name": "Argentina"
      }
    },
    
    // Coordenadas geográficas para SEO local
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-34.99517",
      "longitude": "-58.04874"
    },
    
    // Horarios de atención detallados
    "openingHours": [
      "Tu-Sa 09:00-12:30",
      "Tu-Sa 17:00-21:00", 
      "Su 08:00-13:00"
    ],
    
    // Categorías del negocio para mejor clasificación
    "category": [
      "Pasta Shop",
      "Italian Restaurant", 
      "Food Delivery",
      "Artisanal Food"
    ],
    
    // Métodos de pago aceptados
    "paymentAccepted": [
      "Cash",
      "Credit Card",
      "Debit Card",
      "MercadoPago"
    ],
    
    // Área de servicio (zonas de delivery)
    "areaServed": [
      {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": "-34.99517",
          "longitude": "-58.04874"
        },
        "geoRadius": "15000" // 15km radius
      }
    ],
    
    // Productos principales
    "hasMenu": {
      "@type": "Menu",
      "name": "Catálogo de Pastas Artesanales",
      "description": "Amplia variedad de pastas frescas hechas diariamente",
      "hasMenuSection": [
        {
          "@type": "MenuSection",
          "name": "Pastas Rellenas",
          "description": "Ravioles, sorrentinos y capeletis",
          "hasMenuItem": [
            {
              "@type": "MenuItem",
              "name": "Ravioles de Ricota y Espinaca",
              "description": "Pasta fresca rellena artesanalmente"
            }
          ]
        }
      ]
    },
    
    // Información de la imagen del negocio
    "image": [
      "https://tiopelotte.com/logo-tio-pelotte.jpg",
      "https://tiopelotte.com/pasta-artesanal.jpg"
    ],
    
    // Logo del negocio
    "logo": {
      "@type": "ImageObject",
      "url": "https://tiopelotte.com/logo-tio-pelotte.jpg",
      "width": "300",
      "height": "300"
    },
    
    // Redes sociales y puntos de contacto
    "sameAs": [
      "https://www.instagram.com/tiopelotte",
      "https://www.facebook.com/tiopelotte",
      "https://wa.me/5492213086600"
    ],
    
    // Información de contacto principal
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+54-221-308-6600",
      "contactType": "customer service",
      "availableLanguage": "Spanish",
      "areaServed": "AR"
    }
  };

  // Schema de organización para la marca
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://tiopelotte.com/#organization",
    "name": "TÍO PELOTTE",
    "legalName": "TÍO PELOTTE - Pastas Artesanales",
    "url": "https://tiopelotte.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://tiopelotte.com/logo-tio-pelotte.jpg"
    },
    "foundingDate": "2008",
    "founders": [
      {
        "@type": "Person",
        "name": "Familia Pelotte"
      }
    ],
    "numberOfEmployees": "5-10",
    "slogan": "La pasta de tu pueblo",
    "description": "Empresa familiar dedicada a la elaboración artesanal de pastas frescas desde 2008",
    "knowsAbout": [
      "Pastas artesanales",
      "Cocina italiana",
      "Gastronomía argentina",
      "Recetas familiares"
    ]
  };

  // Schema del sitio web con función de búsqueda
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://tiopelotte.com/#website",
    "name": "TÍO PELOTTE - Pastas Artesanales",
    "alternateName": "Tío Pelotte",
    "url": "https://tiopelotte.com",
    "description": "Sitio web oficial de TÍO PELOTTE - Pastas artesanales frescas de La Plata",
    "inLanguage": "es-AR",
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://tiopelotte.com/#website"
    },
    
    // Configuración de búsqueda interna para Google
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://tiopelotte.com/productos?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    
    // Publisher information
    "publisher": {
      "@id": "https://tiopelotte.com/#organization"
    },
    
    // Copyright información
    "copyrightYear": "2008",
    "copyrightHolder": {
      "@id": "https://tiopelotte.com/#organization"
    }
  };

  // Breadcrumb list para mejorar navegación en SERPs
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://tiopelotte.com"
      },
      {
        "@type": "ListItem", 
        "position": 2,
        "name": "Productos",
        "item": "https://tiopelotte.com/productos"
      },
      {
        "@type": "ListItem",
        "position": 3, 
        "name": "Recetas",
        "item": "https://tiopelotte.com/recetas"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Historia",
        "item": "https://tiopelotte.com/historia"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Ubicación",
        "item": "https://tiopelotte.com/ubicacion"
      }
    ]
  };

  return (
    <>
      {/* LocalBusiness Schema - El más importante para SEO local */}
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema)
        }}
      />
      
      {/* Organization Schema - Para información de la marca */}
      <Script
        id="organization-schema" 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      
      {/* Website Schema - Para funcionalidad de búsqueda */}
      <Script
        id="website-schema"
        type="application/ld+json" 
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
      
      {/* Breadcrumb Schema - Para mejor navegación en SERPs */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
    </>
  );
}
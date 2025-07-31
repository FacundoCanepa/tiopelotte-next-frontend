import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import { islandMoments, ebGaramond } from "@/lib/fonts/fonts";
import { Toaster } from "sonner";
import UserSessionLoader from "@/components/providers/UserSessionLoader";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import CartFloatButton from "@/components/ui/CartFloatButton";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import StructuredData from "@/components/seo/StructuredData";
import ScrollToTop from "@/components/ui/ScrollToTop";

// SEO optimizado para Argentina con palabras clave específicas del rubro
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://tiopelotte.com'),
  title: {
    default: "TÍO PELOTTE - Pastas Artesanales Frescas | La Plata, Buenos Aires",
    template: "%s | TÍO PELOTTE - Pastas Artesanales"
  },
  description: "🍝 Las mejores pastas artesanales frescas de La Plata. Ravioles, sorrentinos, ñoquis, canelones y más. Envíos a domicilio en Abasto, Olmos, Los Hornos y Etcheverry. Desde 2008 amasando tradición.",
  keywords: [
    // Palabras clave principales
    "pastas artesanales La Plata",
    "pastas frescas Buenos Aires", 
    "ravioles artesanales",
    "sorrentinos caseros",
    "ñoquis frescos",
    "pastas a domicilio La Plata",
    
    // Long tail keywords específicos de Argentina
    "pastas caseras Abasto",
    "ravioles Los Hornos",
    "sorrentinos Olmos",
    "pastas frescas Etcheverry",
    "canelones artesanales",
    "fideos caseros La Plata",
    
    // Palabras relacionadas con tradición y calidad
    "pastas tradicionales argentinas",
    "masa madre artesanal",
    "recetas familiares",
    "pasta fresca diaria",
    "ingredientes naturales",
    
    // Ubicación y servicio
    "delivery pastas La Plata",
    "envío gratis pastas",
    "pedidos online",
    "Tío Pelotte"
  ].join(", "),
  authors: [{ name: "TÍO PELOTTE", url: "https://tiopelotte.com" }],
  creator: "TÍO PELOTTE - Pastas Artesanales",
  publisher: "TÍO PELOTTE",
  category: "food",
  classification: "Gastronomía Argentina",
  
  // Configuración técnica optimizada
  formatDetection: {
    email: false,
    address: true, // Permitir detección de direcciones para el negocio local
    telephone: true, // Permitir detección de teléfonos para contacto
  },
  
  // Configuración de idioma específica para Argentina
  alternates: {
    canonical: '/',
    languages: {
      'es-AR': '/',
      'es': '/'
    }
  },
  
  // Open Graph optimizado para redes sociales argentinas
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    alternateLocale: ['es_ES', 'es'],
    title: "TÍO PELOTTE - Pastas Artesanales Frescas | La Plata 🍝",
    description: "Desde 2008 haciendo las mejores pastas artesanales de La Plata. Ravioles, sorrentinos, ñoquis y más. ¡Envíos a domicilio! 📦🚚",
    url: '/',
    siteName: 'TÍO PELOTTE - Pastas Artesanales',
    images: [
      {
        url: '/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TÍO PELOTTE - Pastas Artesanales Frescas de La Plata',
        type: 'image/jpeg',
      },
      {
        url: '/logo-tio-pelotte.jpg',
        width: 800,
        height: 600,
        alt: 'Logo TÍO PELOTTE - La pasta de tu pueblo',
        type: 'image/jpeg',
      }
    ],
  },
  
  // Twitter Card optimizado
  twitter: {
    card: 'summary_large_image',
    site: '@tiopelotte',
    creator: '@tiopelotte',
    title: "TÍO PELOTTE - Pastas Artesanales Frescas 🍝",
    description: "Las mejores pastas artesanales de La Plata con envío a domicilio. ¡Tradición desde 2008!",
    images: {
      url: '/opengraph-image.jpg',
      alt: 'TÍO PELOTTE - Pastas Artesanales',
    },
  },
  
  // Configuración de robots optimizada para SEO local
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Información de verificación y SEO técnico
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: {
      "facebook-domain-verification": process.env.FACEBOOK_DOMAIN_VERIFICATION || "",
    }
  },
  
  // Configuración adicional para SEO local argentino
  other: {
    "geo.region": "AR-B", // Buenos Aires, Argentina
    "geo.placename": "La Plata",
    "geo.position": "-34.9964963;-57.9810135", // Coordenadas de La Plata
    "ICBM": "-34.9964963, -57.9810135",
    "DC.title": "TÍO PELOTTE - Pastas Artesanales",
    "DC.subject": "Pastas artesanales, comida casera, La Plata",
    "DC.description": "Pastas artesanales frescas hechas con amor en La Plata desde 2008",
    "DC.language": "es-AR",
    "DC.coverage": "La Plata, Buenos Aires, Argentina",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="es-AR" className="scroll-smooth">
      {/* 
        Configuración de preload optimizada para performance 
        - DNS prefetch para dominios externos críticos
        - Preconnect para recursos que sabemos que vamos a usar
      */}
      <head>
        {/* DNS Prefetch para dominios externos */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//loved-ducks-790a0f88b6.strapiapp.com" />
        <link rel="dns-prefetch" href="//loved-ducks-790a0f88b6.media.strapiapp.com" />
        
        {/* Preconnect para recursos críticos */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Preload para fuentes críticas */}
        <link
          rel="preload"
          href="/_next/static/media/island-moments.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        
        {/* Meta tags adicionales para SEO local argentino */}
        <meta name="geo.region" content="AR-B" />
        <meta name="geo.placename" content="La Plata, Buenos Aires" />
        <meta name="geo.position" content="-34.9964963;-57.9810135" />
        <meta name="ICBM" content="-34.9964963, -57.9810135" />
        
        {/* Theme color para Android/PWA */}
        <meta name="theme-color" content="#FBE6D4" />
        <meta name="msapplication-TileColor" content="#FBE6D4" />
        
        {/* Apple specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TÍO PELOTTE" />
        
        {/* Manifest para PWA futuro */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Favicons optimizados */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      
      <body 
        className={`${islandMoments.variable} ${ebGaramond.variable} antialiased`}
        // Mejora de accesibilidad y UX
        suppressHydrationWarning={true}
      >
        {/* Google Analytics con verificación de ID */}
        {gaId && <GoogleAnalytics measurementId={gaId} />}
        
        {/* Structured Data para SEO local business */}
        <StructuredData />
        
        {/* 
          Skip link para accesibilidad - permite saltar directamente al contenido principal
          Crítico para usuarios de screen readers
        */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-[#FFD966] text-[#5A3E1B] px-4 py-2 rounded-md font-semibold"
        >
          Saltar al contenido principal
        </a>
        
        {/* 
          Loader de sesión optimizado - se ejecuta antes que el resto de componentes
          para evitar flickers de estado de login
        */}
        <UserSessionLoader />
        
        {/* 
          Navegación principal con role landmark para accesibilidad
        */}
        <nav role="navigation" aria-label="Navegación principal">
          <Navbar />
        </nav>
        
        {/* 
          Contenido principal con landmark semántico
          El ID permite el skip link de accesibilidad
        */}
        <main id="main-content" role="main">
          {children}
        </main>
        
        {/* 
          Componente para auto-scroll al cambiar de página
          Mejora UX en navegación entre secciones
        */}
        <ScrollToTop />
        
        {/* 
          Toast notifications optimizadas para UX
          - Posición central para mejor visibilidad
          - Rich colors para mejor feedback visual
          - Close button para accesibilidad
        */}
        <Toaster 
          position="top-center" 
          richColors 
          closeButton 
          duration={4000}
          toastOptions={{
            style: {
              fontFamily: 'var(--font-garamond)',
            }
          }}
        />
        
        {/* 
          Footer con role contentinfo para accesibilidad
        */}
        <footer role="contentinfo">
          <Footer />
        </footer>
        
        {/* 
          Botones flotantes optimizados para accesibilidad y UX
          - Posición fija pero sin interferir con el contenido
          - ARIA labels descriptivos
          - Orden de tabulación lógico
        */}
        <aside role="complementary" aria-label="Acciones rápidas">
          <CartFloatButton />
          <WhatsAppButton />
        </aside>
      </body>
    </html>
  );
}
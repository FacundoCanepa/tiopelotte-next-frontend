import type { Metadata } from "next";
import "./globals.css";
import { islandMoments, ebGaramond } from "@/lib/fonts/fonts";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import QueryProvider from "@/lib/providers/QueryProvider";
import UserSessionLoader from "@/components/providers/UserSessionLoader";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import CartFloatButton from "@/components/ui/CartFloatButton";
import ScrollToTop from "@/components/ui/ScrollToTop";
import StructuredData from "@/components/seo/StructuredData";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import PWAPrompt from "@/components/pwa/PWAPrompt";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

// SEO optimizado para e-commerce
export const metadata: Metadata = {
  title: {
    default: "TÍO PELOTTE - Pastas Artesanales Frescas | E-commerce La Plata",
    template: "%s | TÍO PELOTTE"
  },
  description: "🍝 E-commerce de pastas artesanales frescas en La Plata. Ravioles, sorrentinos, ñoquis y más. Envíos a domicilio. Comprá online las mejores pastas desde 2008.",
  keywords: [
    "e-commerce pastas La Plata",
    "comprar pastas online",
    "delivery pastas artesanales",
    "ravioles online La Plata",
    "sorrentinos delivery",
    "tienda online pastas",
    "pastas frescas e-commerce",
    "Tío Pelotte online"
  ].join(", "),
  
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    title: "TÍO PELOTTE - E-commerce de Pastas Artesanales 🍝",
    description: "Comprá online las mejores pastas artesanales de La Plata. Envíos a domicilio. Más de 15 años de tradición.",
    url: process.env.NEXT_PUBLIC_FRONTEND_URL,
    siteName: 'TÍO PELOTTE E-commerce',
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  manifest: '/manifest.json',
  
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="es-AR" className="scroll-smooth">
      <head>
        <meta name="geo.region" content="AR-B" />
        <meta name="geo.placename" content="La Plata, Buenos Aires" />
        <meta name="theme-color" content="#FBE6D4" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      
      <body 
        className={`${islandMoments.variable} ${ebGaramond.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ErrorBoundary>
          {/* Providers */}
          <QueryProvider>
            {/* SEO y Analytics */}
            <StructuredData />
            {gaId && <GoogleAnalytics measurementId={gaId} />}
            
            {/* Session Management */}
            <UserSessionLoader />
            
            {/* Layout principal */}
            <div className="min-h-screen flex flex-col">
              <Navbar />
              
              <main className="flex-1">
                {children}
              </main>
              
              <Footer />
            </div>
            
            {/* Componentes flotantes */}
            <ScrollToTop />
            <CartFloatButton />
            <WhatsAppButton />
            <PWAPrompt />
            
            {/* Sistema de notificaciones */}
            <Toaster 
              position="top-center" 
              richColors 
              closeButton 
              duration={4000}
              toastOptions={{
                style: {
                  background: '#FFF8EC',
                  color: '#5A3E1B',
                  border: '1px solid #E6D2B5',
                },
              }}
            />
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
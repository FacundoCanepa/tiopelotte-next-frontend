import type { Metadata } from "next";
import "./globals.css";
import { islandMoments, ebGaramond } from "@/lib/fonts/fonts";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import UserSessionLoader from "@/components/providers/UserSessionLoader";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import CartFloatButton from "@/components/ui/CartFloatButton";
import ScrollToTop from "@/components/ui/ScrollToTop";

// SEO optimizado para Argentina
export const metadata: Metadata = {
  title: {
    default: "TÍO PELOTTE - Pastas Artesanales Frescas | La Plata, Buenos Aires",
    template: "%s | TÍO PELOTTE - Pastas Artesanales"
  },
  description: "🍝 Las mejores pastas artesanales frescas de La Plata. Ravioles, sorrentinos, ñoquis, canelones y más. Envíos a domicilio en Abasto, Olmos, Los Hornos y Etcheverry. Desde 2008 amasando tradición.",
  keywords: [
    "pastas artesanales La Plata",
    "pastas frescas Buenos Aires", 
    "ravioles artesanales",
    "sorrentinos caseros",
    "ñoquis frescos",
    "pastas a domicilio La Plata",
    "pastas caseras Abasto",
    "ravioles Los Hornos",
    "sorrentinos Olmos",
    "pastas frescas Etcheverry",
    "canelones artesanales",
    "fideos caseros La Plata",
    "pastas tradicionales argentinas",
    "masa madre artesanal",
    "recetas familiares",
    "pasta fresca diaria",
    "ingredientes naturales",
    "delivery pastas La Plata",
    "envío gratis pastas",
    "pedidos online",
    "Tío Pelotte"
  ].join(", "),
  authors: [{ name: "TÍO PELOTTE", url: "https://tiopelotte.com" }],
  creator: "TÍO PELOTTE - Pastas Artesanales",
  publisher: "TÍO PELOTTE",
  
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    title: "TÍO PELOTTE - Pastas Artesanales Frescas | La Plata 🍝",
    description: "Desde 2008 haciendo las mejores pastas artesanales de La Plata. Ravioles, sorrentinos, ñoquis y más. ¡Envíos a domicilio! 📦🚚",
    url: '/',
    siteName: 'TÍO PELOTTE - Pastas Artesanales',
  },
  
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR" className="scroll-smooth">
      <head>
        <meta name="geo.region" content="AR-B" />
        <meta name="geo.placename" content="La Plata, Buenos Aires" />
        <meta name="theme-color" content="#FBE6D4" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      
      <body 
        className={`${islandMoments.variable} ${ebGaramond.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <UserSessionLoader />
        
        <nav role="navigation" aria-label="Navegación principal">
          <Navbar />
        </nav>
        
        <main id="main-content" role="main">
          {children}
        </main>
        
        <ScrollToTop />
        
        <Toaster 
          position="top-center" 
          richColors 
          closeButton 
          duration={4000}
        />
        
        <footer role="contentinfo">
          <Footer />
        </footer>
        
        <aside role="complementary" aria-label="Acciones rápidas">
          <CartFloatButton />
          <WhatsAppButton />
        </aside>
      </body>
    </html>
  );
}
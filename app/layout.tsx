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

export const metadata: Metadata = {
  title: "TÍO PELOTTE - Pastas Artesanales Frescas | La Plata",
  description: "Descubrí las mejores pastas artesanales frescas de La Plata. Ravioles, sorrentinos, ñoquis y más. Envíos a domicilio en Abasto, Olmos, Los Hornos y Etcheverry.",
  keywords: "pastas artesanales, pastas frescas, La Plata, ravioles, sorrentinos, ñoquis, envío domicilio",
  authors: [{ name: "TÍO PELOTTE" }],
  creator: "TÍO PELOTTE",
  publisher: "TÍO PELOTTE",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://tiopelotte.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "TÍO PELOTTE - Pastas Artesanales Frescas",
    description: "Las mejores pastas artesanales frescas de La Plata con envío a domicilio",
    url: '/',
    siteName: 'TÍO PELOTTE',
    images: [
      {
        url: '/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TÍO PELOTTE - Pastas Artesanales',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "TÍO PELOTTE - Pastas Artesanales Frescas",
    description: "Las mejores pastas artesanales frescas de La Plata",
    images: ['/opengraph-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="es">
      <body className={`${islandMoments.variable} ${ebGaramond.variable} antialiased`}>
        {gaId && <GoogleAnalytics measurementId={gaId} />}
        <UserSessionLoader />
        <Navbar />
        {children}
        <Toaster position="top-center" richColors closeButton />
        <Footer />
        <CartFloatButton />
        <WhatsAppButton />
      </body>
    </html>
  );
}
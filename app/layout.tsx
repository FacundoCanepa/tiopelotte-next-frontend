import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import { islandMoments, ebGaramond } from "@/lib/fonts/fonts";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import 'leaflet/dist/leaflet.css';
export const metadata: Metadata = {
  title: "Tio pelotte",
  description: "Ecommerce tio pelotte",
};
import ScrollToTop from "@/components/ui/ScrollToTop";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${islandMoments.variable} ${ebGaramond.variable} antialiased `}>
        <Navbar/>
        <ScrollToTop />
        {children}
        <WhatsAppButton />
        <Footer/>
      </body>
    </html>
  );
}


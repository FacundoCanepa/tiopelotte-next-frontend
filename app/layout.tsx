import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import { islandMoments, ebGaramond } from "@/lib/fonts/fonts";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import CartFloatButton from "@/components/ui/CartFloatButton";
import { Toaster } from "sonner";
import UserSessionLoader from "@/components/providers/UserSessionLoader";

export const metadata: Metadata = {
  title: "Tio pelotte",
  description: "Ecommerce tio pelotte",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
        <body className={`${islandMoments.variable} ${ebGaramond.variable} antialiased`}>
            <UserSessionLoader />
            <Navbar />
          {children}
          <Toaster position="top-center" richColors closeButton />
          <Footer />
          <CartFloatButton/>
          <WhatsAppButton/>
      </body>
    </html>
  );
}
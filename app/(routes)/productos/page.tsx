import { Metadata } from "next";
import ProductsSection from "./components/ProductsSection";

export const metadata: Metadata = {
  title: "Productos Artesanales | TÍO PELOTTE",
  description: "Descubrí nuestra amplia selección de pastas artesanales frescas. Ravioles, sorrentinos, ñoquis, canelones y más. Envíos a domicilio en La Plata.",
  openGraph: {
    title: "Productos Artesanales | TÍO PELOTTE",
    description: "Pastas frescas hechas con amor y tradición. Comprá online con envío a domicilio.",
    type: "website",
  },
};

export default function ProductsPage() {
  return <ProductsSection />;
}
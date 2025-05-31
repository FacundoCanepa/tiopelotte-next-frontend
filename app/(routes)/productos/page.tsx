import ProductosSection from "./components/ProductosSection";

export const metadata = {
  title: "Productos artesanales – TÍO PELOTTE",
  description: "Descubrí nuestras pastas frescas y ofertas semanales. Comprá ravioles, sorrentinos, fideos y más.",
  openGraph: {
    title: "Productos artesanales – TÍO PELOTTE",
    description: "Comprá pastas artesanales frescas con envío a domicilio.",
    url: "https://tiopelotte.com/productos",
    siteName: "TÍO PELOTTE",
    locale: "es_AR",
    type: "website",
  },
};

export default function ProductosPage() {
  return <ProductosSection />;
}

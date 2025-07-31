import { Metadata } from "next";
import UbicacionSection from "./components/UbicacionSection";

export const metadata: Metadata = {
  title: "Ubicación y Zonas de Entrega | TÍO PELOTTE",
  description: "Encontranos en Av. 197 e/ 43 y 44, Abasto. Realizamos envíos a domicilio en Etcheverry, Olmos, Los Hornos, Miralagos y más zonas de La Plata.",
  openGraph: {
    title: "Ubicación y Zonas de Entrega | TÍO PELOTTE",
    description: "Visitanos en nuestro local o pedí delivery en tu zona. Cobertura en toda La Plata y alrededores.",
    type: "website",
  },
};

export default function HistoriaPage() {
  return(
    
    <UbicacionSection />

  )
   
}

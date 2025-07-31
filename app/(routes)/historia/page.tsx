import { Metadata } from "next";
import HistoriaSection from "./components/HistoriaSection";

export const metadata: Metadata = {
  title: "Nuestra Historia | TÍO PELOTTE - Pastas Artesanales",
  description: "Conocé la historia de TÍO PELOTTE desde 2008. Una familia dedicada a crear las mejores pastas artesanales de La Plata con amor y tradición.",
  openGraph: {
    title: "Nuestra Historia | TÍO PELOTTE",
    description: "Más de 15 años amasando tradición y sabor en cada pasta fresca.",
    type: "website",
  },
};

export default function HistoriaPage() {
  return(
    
    <HistoriaSection />

  )
   
}

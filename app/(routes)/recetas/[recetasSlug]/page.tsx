import RecipeDetail from "./components/RecipeDetail";

type Props = { params: { recetasSlug: string } };

// ✅ Metadata genérica para todas las recetas
export const metadata = {
  title: "Receta artesanal | TÍO PELOTTE",
  description: "Una receta deliciosa hecha con ingredientes frescos y amor artesanal.",
  openGraph: {
    title: "Receta artesanal | TÍO PELOTTE",
    description: "Disfrutá de nuestras recetas clásicas y caseras. Hechas con pasión.",
    type: "article",
    images: [
      {
        url: "https://tiopelotte.ar/opengraph-recetas.jpg", // reemplazá si tenés una imagen genérica
        width: 1200,
        height: 630,
        alt: "Receta artesanal de TÍO PELOTTE",
      },
    ],
  },
};

export default function Page({ params }: Props) {
  return <RecipeDetail slug={params.recetasSlug} />;
}

// app/(routes)/recetas/[recetasSlug]/generateMetadata.ts
import { Metadata } from "next";

export async function generateRecipeMetadata(slug: string): Promise<Metadata> {
  const res = await fetch(
   `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recetas?filters[slug][$eq]=${slug}&populate[img]=true`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const receta = data?.data?.[0]?.attributes;

  if (!receta) {
    return {
      title: "Receta no encontrada | TÍO PELOTTE",
    };
  }

  return {
    title: `${receta.titulo} | TÍO PELOTTE`,
    description: receta.descripcion,
    openGraph: {
      title: receta.titulo,
      description: receta.descripcion,
      type: "article",
      images: [
        {
          url: receta.img?.data?.attributes?.url || "https://tu-dominio.com/fallback.jpg",
          width: 1200,
          height: 630,
          alt: receta.titulo,
        },
      ],
    },
  };
}

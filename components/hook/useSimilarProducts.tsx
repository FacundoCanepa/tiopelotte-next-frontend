import { useEffect, useState } from "react";
import { ProductType } from "@/types/product";

interface Props {
  categorySlug: string;
  excludeProductId: number;
}

export function useGetSimilarProducts({ categorySlug, excludeProductId }: Props) {
  const [similarProducts, setSimilarProducts] = useState<ProductType[] | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const res = await fetch(
          `https://loved-ducks-790a0f88b6.strapiapp.com/api/products?populate=*&filters[category][slug][$eq]=${categorySlug}&filters[id][$ne]=${excludeProductId}`
        );

        const json = await res.json();


        const productos: ProductType[] = json.data?.map((producto: any) => ({
          id: producto.id,
          productName: producto.productName,
          slug: producto.slug,
          description: producto.description,
          descriptionCorta: producto.descriptionCorta,
          img: producto.img || [],
          img_carousel: producto.img_carousel || [],
          taste: producto.taste,
          price: producto.price,
          unidadMedida: producto.unidadMedida,
          isFeatured: producto.isFeatured,
          isOffer: producto.isOffer,
          stock: producto.stock,
          tiempoEstimado: producto.tiempoEstimado,
          porciones: producto.porciones,
          ingredientes: producto.ingredientes || [],
          category: producto.category ?? {
            categoryNames: "",
            slug: "",
            description: "",
            mainImage: { url: "" },
          },
        }));

        setSimilarProducts(productos);
        setError(null);
      } catch (err: any) {
        console.error("❌ Error al obtener productos similares:", err);
        setError("No se pudieron cargar productos similares.");
        setSimilarProducts(undefined);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug && excludeProductId) {
      fetchSimilar();
    }
  }, [categorySlug, excludeProductId]);

  return {
    similarProducts,
    loading,
    error,
  };
}

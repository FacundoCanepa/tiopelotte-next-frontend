import { useMemo } from "react";
import { useFetch } from "./useFetch";
import type { ProductType } from "@/types/product";

interface Props {
  categorySlug: string;
  excludeProductId: number;
}

export function useGetSimilarProducts({ categorySlug, excludeProductId }: Props) {
  const url = useMemo(() => {
    if (!categorySlug || !excludeProductId) return undefined;
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?populate=*&filters[category][slug][$eq]=${categorySlug}&filters[id][$ne]=${excludeProductId}&filters[active][$eq]=true&pagination[limit]=8`;
  }, [categorySlug, excludeProductId]);

  const { data, loading, error, refetch } = useFetch<any>(url, {
    cacheKey: `similar-products-${categorySlug}-${excludeProductId}`,
    cacheTTL: 300000 // 5 minutos
  });
  
  // Manejar estructura de respuesta de Strapi v4
  let products: ProductType[] = [];
  
  if (data?.data && Array.isArray(data.data)) {
    products = data.data;
  } else if (Array.isArray(data)) {
    products = data;
  } else if (data && !loading && !error) {
    console.warn('⚠️ Estructura inesperada en productos similares:', data);
  }

  return {
    similarProducts: products,
    loading,
    error,
    refetch,
  };
}
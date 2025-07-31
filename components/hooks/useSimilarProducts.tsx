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
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?populate=*&filters[category][slug][$eq]=${categorySlug}&filters[id][$ne]=${excludeProductId}&filters[active][$eq]=true`;
  }, [categorySlug, excludeProductId]);

  const { data, loading, error } = useFetch<any>(url);
  
  // Simplificado: manejar estructura de Strapi
  let products = [];
  if (data?.data && Array.isArray(data.data)) {
    products = data.data;
  } else if (Array.isArray(data)) {
    products = data;
  }

  return {
    similarProducts: products,
    loading,
    error,
  };
}
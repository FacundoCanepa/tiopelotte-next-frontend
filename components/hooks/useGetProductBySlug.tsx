"use client";
import { useFetch } from "./useFetch";
import type { ProductType } from "@/types/product";

export function useGetProductBySlug(slug: string) {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = base && slug ? `${base}/api/products?filters[slug][$eq]=${slug}&populate=*` : undefined;
  
  const { data, loading, error, refetch } = useFetch<any>(url, {
    cacheKey: `product-${slug}`,
    cacheTTL: 300000 // 5 minutos
  });
  
  // Manejar estructura de respuesta de Strapi v4
  let product: ProductType | null = null;
  
  if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
    product = data.data[0];
  } else if (Array.isArray(data) && data.length > 0) {
    product = data[0];
  } else if (data && !loading && !error) {
    console.warn('⚠️ Producto no encontrado o estructura inesperada:', slug, data);
  }
  
  return { 
    product, 
    loading, 
    error,
    refetch
  };
}
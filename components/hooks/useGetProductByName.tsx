"use client";

import { useFetch } from "./useFetch";
import type { ProductType } from "@/types/product";

export function useGetProductByName(name: string) {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = base && name
    ? `${base}/api/products?filters[productName][$eq]=${encodeURIComponent(name)}&populate=*`
    : undefined;
    
  const { data, loading, error, refetch } = useFetch<any>(url, {
    cacheKey: `product-name-${name}`,
    cacheTTL: 300000 // 5 minutos
  });
  
  // Manejar estructura de respuesta de Strapi v4
  let product: ProductType | null = null;
  
  if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
    product = data.data[0];
  } else if (Array.isArray(data) && data.length > 0) {
    product = data[0];
  } else if (data && !loading && !error) {
    console.warn('⚠️ Producto no encontrado por nombre:', name, data);
  }
  
  return { 
    product, 
    loading, 
    error,
    refetch
  };
}
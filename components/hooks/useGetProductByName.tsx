"use client";

import { useFetch } from "./useFetch";
import type { ProductType } from "@/types/product";

export function useGetProductByName(name: string) {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = base && name
    ? `${base}/api/products?filters[productName][$eq]=${encodeURIComponent(name)}&populate=*`
    : undefined;
    
  const { data, loading, error } = useFetch<any>(url);
  
  // Simplificado: obtener el primer producto sin transformaciones complejas
  let product = null;
  
  if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
    product = data.data[0];
  } else if (Array.isArray(data) && data.length > 0) {
    product = data[0];
  }
  
  return { product, loading, error };
}
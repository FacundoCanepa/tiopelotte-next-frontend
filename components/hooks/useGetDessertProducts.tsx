import { useFetch } from "./useFetch";
import type { ProductType } from "@/types/product";

export function useGetDessertProducts() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?populate=*&filters[category][slug][$eq]=postres&filters[active][$eq]=true`;
  
  const { data, loading, error } = useFetch<any>(url);
  
  // Simplificado: manejar ambas estructuras de Strapi
  let products = [];
  if (data?.data && Array.isArray(data.data)) {
    products = data.data;
  } else if (Array.isArray(data)) {
    products = data;
  }
  
  return { 
    loading, 
    result: products, 
    error 
  };
}
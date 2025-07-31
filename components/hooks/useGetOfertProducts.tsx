import { useFetch } from "./useFetch";
import type { ProductType } from "@/types/product";

export function useGetOfferProducts() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?filters[isOffer][$eq]=true&filters[active][$eq]=true&populate=*`;
  
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
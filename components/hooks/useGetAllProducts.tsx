import { useFetch } from "./useFetch";
import type { ProductType } from "@/types/product";

export function useGetAllProducts() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?populate=*`;
  const { data, loading, error } = useFetch<any>(url);
  const { data, loading, error } = useFetch<any>(url);
  
  const products = data?.data || data || [];
  return { result: products, loading, error };
  
  return { 
    result: products, 
    loading, 
    error 
  };
}
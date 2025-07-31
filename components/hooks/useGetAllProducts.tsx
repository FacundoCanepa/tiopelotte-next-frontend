import { useFetch } from "./useFetch";
import type { ProductType } from "@/types/product";

export function useGetAllProducts() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?populate=*&filters[active][$eq]=true`;
  const { data, loading, error } = useFetch<any>(url);
  
  const products = Array.isArray(data?.data) ? data.data : [];
  
  return { 
    result: products, 
    loading, 
    error 
  };
}
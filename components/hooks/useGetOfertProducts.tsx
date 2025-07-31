import { useFetch } from "./useFetch";
import type { ProductType } from "@/types/product";

export function useGetOfferProducts() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?filters[isOffer][$eq]=true&filters[active][$eq]=true&populate=*`;
  
  const { data, loading, error } = useFetch<any>(url);
  
  const products = Array.isArray(data?.data) ? data.data : [];
  
  return { 
    loading, 
    result: products, 
    error 
  };
}
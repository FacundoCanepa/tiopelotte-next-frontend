import { useFetch } from "./useFetch";
import type { ProductType } from "@/types/product";

export function useGetOfferProducts() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?filters[isOffer][$eq]=true&filters[active][$eq]=true&populate=*`;
  
  const { data, loading, error, refetch } = useFetch<any>(url, {
    cacheKey: 'offer-products',
    cacheTTL: 300000 // 5 minutos
  });
  
  // Manejar estructura de respuesta de Strapi v4
  let products: ProductType[] = [];
  
  if (data?.data && Array.isArray(data.data)) {
    products = data.data;
  } else if (Array.isArray(data)) {
    products = data;
  } else if (data && !loading && !error) {
    console.warn('⚠️ Estructura de datos inesperada en useGetOfferProducts:', data);
  }
  
  return { 
    loading, 
    result: products, 
    error,
    refetch
  };
}
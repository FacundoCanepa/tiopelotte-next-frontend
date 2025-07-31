import { useFetch } from "./useFetch";
import type { ProductType } from "@/types/product";

export function useGetDessertProducts() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?populate=*&filters[category][slug][$eq]=postres&filters[active][$eq]=true`;
  
  const { data, loading, error, refetch } = useFetch<any>(url, {
    cacheKey: 'dessert-products',
    cacheTTL: 300000 // 5 minutos
  });
  
  // Manejar estructura de respuesta de Strapi v4
  let products: ProductType[] = [];
  
  if (data?.data && Array.isArray(data.data)) {
    products = data.data;
  } else if (Array.isArray(data)) {
    products = data;
  } else if (data && !loading && !error) {
    console.warn('⚠️ Estructura de datos inesperada en useGetDessertProducts:', data);
  }
  
  return { 
    loading, 
    result: products, 
    error,
    refetch
  };
}
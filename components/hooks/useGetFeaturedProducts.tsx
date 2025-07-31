import { useFetch } from './useFetch';
import type { ProductType } from '@/types/product';

export function useGetFeaturedProducts() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?populate=*&filters[isFeatured][$eq]=true&filters[active][$eq]=true`;
  
  const { data, loading, error, refetch } = useFetch<any>(url);
  
  // Simplificado: manejar ambas estructuras de Strapi sin transformaciones complejas
  let products = [];
  if (data?.data && Array.isArray(data.data)) {
    products = data.data;
  } else if (Array.isArray(data)) {
    products = data;
  }
  
  return {
    loading,
    result: products,
    error,
    refetch
  };
}
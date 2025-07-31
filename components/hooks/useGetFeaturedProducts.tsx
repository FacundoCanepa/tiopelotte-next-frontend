import { useFetch } from './useFetch';
import type { ProductType } from '@/types/product';

export function useGetFeaturedProducts() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?populate=*&filters[isFeatured][$eq]=true&filters[active][$eq]=true`;
  
  const { data, loading, error, refetch } = useFetch<any>(url);
  
  // Transformar datos de Strapi de manera segura
  const products = Array.isArray(data?.data) ? data.data : [];
  
  return {
    loading,
    result: products,
    error,
    refetch
  };
}
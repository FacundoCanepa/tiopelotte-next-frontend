/**
 * Hook para obtener productos destacados desde Strapi
 */
import { useFetch } from './useFetch';

export function useGetFeaturedProducts() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?populate=*&filters[destacado][$eq]=true`;
  
  const { data, loading, error, refetch } = useFetch(url);
  
  // Transformar datos para asegurar estructura correcta
  const products = Array.isArray(data?.data) ? data.data : [];
  
  return {
    loading,
    result: products,
    error,
    refetch
  };
}
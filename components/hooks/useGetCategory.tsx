import { useFetch } from "./useFetch";
import type { Category } from "@/types/category";

export function useGetCategory() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories?populate=*`;
  
  const { data, loading, error, refetch } = useFetch<any>(url, {
    cacheKey: 'categories',
    cacheTTL: 600000 // 10 minutos
  });
  
  // Manejar estructura de respuesta de Strapi v4
  let categories: Category[] = [];
  
  if (data?.data && Array.isArray(data.data)) {
    categories = data.data.map((item: any) => ({
      id: item.id,
      categoryNames: item.categoryNames,
      slug: item.slug,
      description: item.description,
      mainImage: item.mainImage || { url: '/placeholder.jpg' }
    }));
  } else if (Array.isArray(data)) {
    categories = data.map((item: any) => ({
      id: item.id,
      categoryNames: item.categoryNames,
      slug: item.slug,
      description: item.description,
      mainImage: item.mainImage || { url: '/placeholder.jpg' }
    }));
  } else if (data && !loading && !error) {
    console.warn('⚠️ Estructura de datos inesperada en useGetCategory:', data);
  }
  
  return { 
    loading, 
    result: categories, 
    error,
    refetch
  };
}
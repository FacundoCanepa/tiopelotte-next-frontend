import { useFetch } from "./useFetch";
import type { Category } from "@/types/category";

export function useGetCategory() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories?populate=*`;
  
  const { data, loading, error } = useFetch<any>(url);
  
  // Simplificado: manejar estructura de Strapi
  let categories = [];
  
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
  }
  
  return { 
    loading, 
    result: categories, 
    error 
  };
}
import { useFetch } from "./useFetch";
import type { Category } from "@/types/category";

export function useGetCategory() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories?populate=*`;
  const { data, loading, error } = useFetch<any>(url, undefined, (json) => {
    // Transformar la respuesta de Strapi al formato esperado
    if (json && json.data && Array.isArray(json.data)) {
      return json.data.map((item: any) => ({
        id: item.id,
        categoryNames: item.categoryNames,
        slug: item.slug,
        description: item.description,
        mainImage: item.mainImage || { url: '/placeholder.jpg' }
      }));
    }
    return [];
  });
  
  return { 
    loading, 
    result: Array.isArray(data) ? data : [], 
    error 
  };
}
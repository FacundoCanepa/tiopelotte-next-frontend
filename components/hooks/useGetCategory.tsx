import { useFetch } from "./useFetch";
import type { Category } from "@/types/category";

export function useGetCategory() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories?populate=*`;
  const { data, loading, error } = useFetch<any>(url, undefined, (json) => {
    if (json && json.data && Array.isArray(json.data)) {
      return json.data.map((item: any) => {
        const attrs = item.attributes || item;
        return {
          id: item.id,
          categoryNames: attrs.categoryNames,
          slug: attrs.slug,
          description: attrs.description,
          mainImage: attrs.mainImage || { url: '/placeholder.jpg' }
        };
      });
    }
    return [];
  });
  
  return { 
    loading, 
    result: Array.isArray(data) ? data : [], 
    error 
  };
}
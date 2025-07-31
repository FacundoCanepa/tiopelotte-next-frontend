import { useFetch } from "./useFetch";
import type { ProductType } from "@/types/product";

export function useGetFeaturedProducts() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?filters[isFeatured][$eq]=true&populate=*`;
  
  console.log('🔍 Fetching featured products from:', url);
  
  const { data, loading, error } = useFetch<ProductType[]>(url, undefined, (json) =>
    {
      console.log('📦 Featured products raw data:', json);
      const result = json && json.data && Array.isArray(json.data) ? json.data : [];
      console.log('✅ Featured products transformed:', result);
      return result;
    }
  );
  
  console.log('🎯 Featured products final result:', { data, loading, error });
  return { loading, result: data || [], error };
}
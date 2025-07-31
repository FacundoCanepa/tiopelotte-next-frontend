import { useFetch } from "./useFetch";
import type { ProductType } from "@/types/product";

export function useGetDessertProducts() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?populate=*&filters[category][slug][$eq]=postres&filters[active][$eq]=true`;
  
  console.log('🔍 Fetching dessert products from:', url);
  
  const { data, loading, error } = useFetch<ProductType[]>(url, undefined, (json) =>
    {
      console.log('📦 Dessert products raw data:', json);
      const result = json && json.data && Array.isArray(json.data) ? json.data : [];
      console.log('✅ Dessert products transformed:', result);
      return result;
    }
  );
  
  console.log('🎯 Dessert products final result:', { data, loading, error });
  return { loading, result: data || [], error };
}
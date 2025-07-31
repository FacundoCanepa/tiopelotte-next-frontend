import { useFetch } from "./useFetch";
import type { ProductType } from "@/types/product";

export function useGetOfferProducts() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?filters[isOffer][$eq]=true&filters[active][$eq]=true&populate=*`;
  
  console.log('🔍 Fetching offer products from:', url);
  
  const { data, loading, error } = useFetch<ProductType[]>(url, undefined, (json) =>
    {
      console.log('📦 Offer products raw data:', json);
      const result = json && json.data && Array.isArray(json.data) ? json.data : [];
      console.log('✅ Offer products transformed:', result);
      return result;
    }
  );
  
  console.log('🎯 Offer products final result:', { data, loading, error });
  return { loading, result: data || [], error };
}
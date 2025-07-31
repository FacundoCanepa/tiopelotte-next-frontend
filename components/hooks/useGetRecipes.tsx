import { useFetch } from "./useFetch";
import type { RecetaType } from "@/types/receta";

export function useGetRecipes() {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = base ? `${base}/api/recetas?populate=*` : undefined;
  
  console.log('🔍 Fetching recipes from:', url);
  
  const { data, loading, error } = useFetch<RecetaType[]>(url, undefined, (json) => {
    console.log('📦 Recipes raw data:', json);
    
    const result = Array.isArray(json.data)
      ? json.data.map((item: any) => ({
          id: item.id,
          titulo: item.titulo,
          slug: item.slug,
          descripcion: item.descripcion,
          tiempo: item.tiempo,
          porciones: item.porciones,
          preparacion: item.preparacion,
          img: item.img || null,
          products:
            item.products?.map((prod: any) => ({
              id: prod.id,
              productName: prod.productName,
              slug: prod.slug,
              img: prod.img ? (Array.isArray(prod.img) ? prod.img : [prod.img]) : [],
            })) || [],
        }))
      : [];
    
    console.log('✅ Recipes transformed:', result);
    return result;
  }
  );
  
  console.log('🎯 Recipes final result:', { data, loading, error });
  return { recipes: data || [], loading, error };
}
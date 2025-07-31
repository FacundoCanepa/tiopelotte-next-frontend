import { useFetch } from "./useFetch";
import type { RecetaType } from "@/types/receta";

export function useGetRecipes() {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = base ? `${base}/api/recetas?populate=*` : undefined;
  
  const { data, loading, error } = useFetch<any>(url, undefined, (json) => {
    if (!json || !Array.isArray(json.data)) {
      return [];
    }
    
    return json.data.map((item: any) => {
      const attrs = item.attributes || item;
      return {
        id: item.id,
        titulo: attrs.titulo,
        slug: attrs.slug,
        descripcion: attrs.descripcion,
        tiempo: attrs.tiempo,
        porciones: attrs.porciones,
        preparacion: attrs.preparacion,
        img: attrs.img || null,
        products: (attrs.products?.data || attrs.products || []).map((prod: any) => {
          const prodAttrs = prod.attributes || prod;
          return {
            id: prod.id,
            productName: prodAttrs.productName,
            slug: prodAttrs.slug,
            img: Array.isArray(prodAttrs.img) ? prodAttrs.img : [prodAttrs.img].filter(Boolean),
          };
        }),
      };
    });
  });
  
  return { recipes: data || [], loading, error };
}
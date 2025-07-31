import { useFetch } from "./useFetch";
import type { RecetaType } from "@/types/receta";

export function useGetRecipes() {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = base ? `${base}/api/recetas?populate=*` : undefined;
  
  const { data, loading, error, refetch } = useFetch<any>(url, {
    cacheKey: 'recipes',
    cacheTTL: 600000 // 10 minutos
  });
  
  // Manejar estructura de respuesta de Strapi v4
  let recipes: RecetaType[] = [];
  
  if (data?.data && Array.isArray(data.data)) {
    recipes = data.data.map((item: any) => ({
      id: item.id,
      titulo: item.titulo,
      slug: item.slug,
      descripcion: item.descripcion,
      tiempo: item.tiempo,
      porciones: item.porciones,
      preparacion: item.preparacion,
      img: item.img || null,
      products: Array.isArray(item.products) ? item.products.map((prod: any) => ({
        id: prod.id,
        productName: prod.productName,
        slug: prod.slug,
        img: Array.isArray(prod.img) ? prod.img : [prod.img].filter(Boolean),
      })) : [],
    }));
  } else if (Array.isArray(data)) {
    recipes = data.map((item: any) => ({
      id: item.id,
      titulo: item.titulo,
      slug: item.slug,
      descripcion: item.descripcion,
      tiempo: item.tiempo,
      porciones: item.porciones,
      preparacion: item.preparacion,
      img: item.img || null,
      products: Array.isArray(item.products) ? item.products.map((prod: any) => ({
        id: prod.id,
        productName: prod.productName,
        slug: prod.slug,
        img: Array.isArray(prod.img) ? prod.img : [prod.img].filter(Boolean),
      })) : [],
    }));
  } else if (data && !loading && !error) {
    console.warn('⚠️ Estructura de datos inesperada en useGetRecipes:', data);
  }
  
  return { 
    recipes, 
    loading, 
    error,
    refetch
  };
}
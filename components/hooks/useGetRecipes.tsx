import { useFetch } from "./useFetch";
import type { RecetaType } from "@/types/receta";

export function useGetRecipes() {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = base ? `${base}/api/recetas?populate=*` : undefined;
  
  const { data, loading, error } = useFetch<any>(url);
  
  // Simplificado: manejar estructura de Strapi sin transformaciones complejas
  let recipes = [];
  
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
  }
  
  return { recipes, loading, error };
}
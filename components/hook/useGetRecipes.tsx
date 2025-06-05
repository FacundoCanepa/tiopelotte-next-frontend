import { useEffect, useState } from "react";
import { RecetaType } from "@/types/receta";

export function useGetRecipes() {
  const [recipes, setRecipes] = useState<RecetaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!baseUrl) {
        setError("La URL del backend no está definida");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${baseUrl}/api/recetas?populate=*`);
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

        const json = await res.json();

        if (!Array.isArray(json.data)) {
          throw new Error("La propiedad 'data' no es un array");
        }

        const mapped = json.data.map((item: any) => ({
          id: item.id,
          titulo: item.titulo,
          slug: item.slug,
          descripcion: item.descripcion,
          tiempo: item.tiempo,
          porciones: item.porciones,
          img: item.img || null,
          products:
            item.products?.map((prod: any) => ({
              id: prod.id,
              productName: prod.productName,
              slug: prod.slug,
              img: prod.img ? (Array.isArray(prod.img) ? prod.img : [prod.img]) : [],
            })) || [],
        }));

        setRecipes(mapped);
      } catch (err: any) {
        console.error("💥 Error al obtener recetas:", err.message);
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return { recipes, loading, error };
}

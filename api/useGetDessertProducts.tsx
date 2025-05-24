import { useEffect, useState } from "react";
import { ProductType } from "@/types/product";

export function useGetDessertProducts() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?populate=*&filters[category][slug][$eq]=postres&filters[active][$eq]=true`;
  const [result, setResult] = useState<ProductType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(url);
        const json = await res.json();
        setResult(json.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Error al cargar los postres");
      }
    })();
  }, [url]);

  return { loading, result, error };
}

import { useEffect, useState } from "react";
import { ProductType } from "@/types/product";

export function useGetOfferProducts() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?filters[isOffer][$eq]=true&filters[active][$eq]=true&populate=*`;

  const [result, setResult] = useState<ProductType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(url);
        const json = await res.json();
        setResult(json.data);
      } catch (err: any) {
        setError(err.message || "Error al cargar las ofertas");
      } finally {
        setLoading(false);
      }
    })();
  }, [url]);

  return { loading, result, error };
}

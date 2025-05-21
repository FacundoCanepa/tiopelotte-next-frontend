import { useEffect, useState } from "react";
import { ProductType } from "@/types/product";

export const useGetDessertProducts = () => {
  const [result, setResult] = useState<ProductType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?populate=*&filters[category][slug][$eq]=postres&filters[active][$eq]=true`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        // Acá ya no se usa item.attributes, porque tus productos vienen planos
        const mappedData = data.data; 

        setResult(mappedData);
      } catch (err) {
        console.error("❌ Error al obtener los productos:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  return { result, loading, error };
};

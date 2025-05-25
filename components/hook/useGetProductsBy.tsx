import { useEffect, useState } from "react";
import { ProductType } from "@/types/product";

export function useGetProductsBy(filter: Record<string, unknown>) {
  const [products, setProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    const query = new URLSearchParams(
      Object.entries(filter).map(([key, value]) => [key, String(value)])
    );

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?${query}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch(console.error);
  }, [JSON.stringify(filter)]);

  return products;
}

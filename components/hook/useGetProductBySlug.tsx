"use client";
import { useEffect, useState } from "react";
import { ProductType } from "@/types/product";

export function useGetProductBySlug(slug: string) {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!baseUrl) {
        setError("La URL del backend no está definida");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${baseUrl}/api/products?filters[slug][$eq]=${slug}&populate=*`);
        const json = await res.json();
        setProduct(json.data[0] || null);
      } catch (err: any) {
        setError(err.message || "Error al obtener producto");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return { product, loading, error };
}

"use client";

import { useState } from "react";

export function useBuscarPedido() {
  const [telefono, setTelefono] = useState("");
  const [pedido, setPedido] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const buscarPedido = async () => {
    if (!telefono.trim()) return;

    setLoading(true);
    setError("");
    setPedido(null);

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos?filters[telefono][$eq]=${telefono}&sort=createdAt:desc&pagination[limit]=1`;
      console.log("🔍 Consultando pedido en:", url);

      const res = await fetch(url);
      const data = await res.json();

      console.log("📦 Respuesta de Strapi:", data);

      if (data?.data?.length > 0) {
        setPedido(data.data[0]);
      } else {
        setError("No encontramos ningún pedido con ese número.");
      }
    } catch (err) {
      console.error("❌ Error al consultar pedido:", err);
      setError("Ocurrió un error al consultar el pedido.");
    } finally {
      setLoading(false);
    }
  };

  return {
    telefono,
    setTelefono,
    pedido,
    loading,
    error,
    buscarPedido,
  };
}

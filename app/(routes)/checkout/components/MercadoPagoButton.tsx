"use client";

import { useCartStore } from "@/store/cart-store";
import { Loader2 } from "lucide-react";
import { useState } from "react";

type Props = {
  total: number;
};

export default function MercadoPagoButton({ total }: Props) {
  const [loading, setLoading] = useState(false);
  const cart = useCartStore((state) => state.cart);

  const handleClick = async () => {
    setLoading(true);

    // En este caso, solo mandamos un ítem resumen (uno solo con el total calculado)
    const items = [
      {
        id: "resumen",
        title: "TÍO PELOTTE - Pedido personalizado",
        quantity: 1,
        unit_price: total,
      },
    ];

    try {
      const res = await fetch("/api/mercadopago", {
        method: "POST",
        body: JSON.stringify({ items }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      window.location.href = data.url;
    } catch (err) {
      console.error("Error redirigiendo a Mercado Pago", err);
      alert("Hubo un error al iniciar el pago. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full bg-[#03A9F4] text-white px-4 py-3 rounded-md hover:bg-[#0288D1] transition disabled:opacity-50"
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        "Pagar ahora con Mercado Pago"
      )}
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { useUserStore } from "@/store/user-store";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const payment_id = searchParams.get("payment_id");

  const cart = useCartStore((state) => state.cart);
  const tipoEntrega = useCartStore((state) => state.tipoEntrega);
  const zona = useCartStore((state) => state.zona);
  const direccion = useCartStore((state) => state.direccion);
  const referencias = useCartStore((state) => state.referencias);
  const tipoPago = useCartStore((state) => state.tipoPago);
  const total = useCartStore((state) => state.total);
  const clearCart = useCartStore((state) => state.clearCart);

  const user = useUserStore((state) => state.user);

  const [estado, setEstado] = useState("Confirmando tu pedido...");

  useEffect(() => {
    const crearPedido = async () => {
      if (!payment_id || cart.length === 0 || !user) return;

      const res = await fetch("/api/verificar-pago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_id,
          userId: user.id,
          cart,
          tipoEntrega,
          zona,
          direccion,
          referencias,
          tipoPago,
          total,
        }),
      });

      const data = await res.json();
      if (data.status === "ok") {
        setEstado("¡Pedido confirmado! 🎉 Gracias por tu compra.");
        clearCart();
      } else {
        setEstado("Ocurrió un problema al confirmar tu pedido.");
      }
    };

    crearPedido();
  }, [payment_id]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{estado}</h1>
    </div>
  );
}

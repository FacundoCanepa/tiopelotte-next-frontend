"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cart-store";

export function useConfirmPedido() {
  const searchParams = useSearchParams();
  const payment_id = searchParams.get("payment_id");
  const clearCart = useCartStore((state) => state.clearCart);

  const [estado, setEstado] = useState("Confirmando tu pedido...");

  useEffect(() => {
    const confirmar = async () => {
      if (!payment_id) return;

      try {
        // 1. Verificar estado del pago con Mercado Pago
        const res = await fetch(`/api/verificar-pago`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payment_id }),
        });

        const data = await res.json();

        if (data.status !== "approved") {
          setEstado("Tu pago no fue aprobado.");
          return;
        }

        const pedidoToken = data.metadata?.pedidoToken;

        if (!pedidoToken) {
          setEstado("No se pudo identificar el pedido.");
          return;
        }

        const pedidoTempRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedido-temporals?filters[pedidoToken][$eq]=${pedidoToken}&populate=*`
        );
        const tempData = await pedidoTempRes.json();
        const pedidoTemp = tempData.data?.[0];

        if (!pedidoTemp) {
          setEstado("No se encontró el pedido temporal.");
          return;
        }

        const pedidoFinal = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
            },
            body: JSON.stringify({
              data: {
                ...pedidoTemp.attributes,
                estado: "Confirmado",
                payment_id,
              },
            }),
          }
        );

        if (!pedidoFinal.ok) {
          throw new Error("No se pudo crear el pedido final");
        }
        await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedido-temporals/${pedidoTemp.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
            },
          }
        );

        clearCart();

        setEstado("¡Pedido confirmado! 🎉 Gracias por tu compra.");
      } catch (error) {
        console.error("❌ Error al confirmar pedido:", error);
        setEstado("Ocurrió un error al confirmar tu pedido.");
      }
    };

    confirmar();
  }, [payment_id]);

  return { estado };
}

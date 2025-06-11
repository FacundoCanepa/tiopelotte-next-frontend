"use client";

import { useCartStore } from "@/store/cart-store";
import { useState } from "react";
import Button from "@/components/ui/Button";

interface Props {
  total: number;
}

export default function MercadoPagoCheckoutPro({ total }: Props) {
  const cart = useCartStore((state) => state.cart);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/create_preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, total }),
      });
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      }
    } catch (error) {
      console.error("❌ Error iniciando checkout", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleCheckout}
      disabled={loading}
      className="w-full bg-[#FFD966] text-[#5A3E1B] hover:bg-[#f5c741]"
    >
      {loading ? "Redirigiendo..." : "Pagar con Mercado Pago"}
    </Button>
  );
}
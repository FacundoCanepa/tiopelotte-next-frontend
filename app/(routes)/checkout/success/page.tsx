"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { useUserStore } from "@/store/user-store";
import { enviarPedido } from "@/components/hook/sendPedido";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const cart = useCartStore((state) => state.cart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const status = searchParams.get("status");

    if (status === "approved" && cart.length > 0) {
      const total = getTotalPrice();

      enviarPedido({
        cart,
        total,
        zona: user?.zona || "Sin zona",
        direccion: user?.direccion || "Sin direccion",
        referencias: user?.referencias || "",
        telefono: user?.telefono || "Sin telefono",
        nombreApellido: user?.username || "Cliente sin cuenta",
      }).then(() => {
        clearCart();
      });
    }
  }, [searchParams, cart, getTotalPrice, clearCart, user]);

  return (
    <div className="min-h-screen bg-[#FBE6D4] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-garamond text-[#5A3E1B] mb-3">
          ¡Gracias por tu compra!
        </h1>
        <p className="text-[#8B4513] text-sm mb-6">
          Tu pedido fue confirmado y ya está siendo procesado. Vas a poder
          consultar el estado con tu número de teléfono.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/consultar-pedido")}
            className="bg-[#6B8E23] hover:bg-[#5c7e1c] text-white px-4 py-2 rounded-md transition"
          >
            Consultar estado del pedido
          </button>
          <button
            onClick={() => router.push("/perfil")}
            className="border border-[#FFD966] text-[#5A3E1B] hover:bg-[#FFF3CD] px-4 py-2 rounded-md transition"
          >
            Ir a mi perfil
          </button>
        </div>
      </div>
    </div>
  );
}

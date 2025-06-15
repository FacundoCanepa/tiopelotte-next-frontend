"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const payment_id = searchParams.get("payment_id");

  const clearCart = useCartStore((state) => state.clearCart);

  const [estado, setEstado] = useState("Confirmando tu pedido...");

  useEffect(() => {
    toast.success("¡Tu pedido fue realizado con éxito!"); // ✅ Toast visual al entrar

    const crearPedido = async () => {
      if (!payment_id) return;

      const res = await fetch("/api/verificar-pago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_id }),
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
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 bg-[#FBE6D4] text-[#5A3E1B] text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl w-full space-y-6"
      >
        <CheckCircle size={64} className="mx-auto text-green-600" />
        <h1 className="text-3xl font-bold font-garamond">{estado}</h1>

        <p className="text-sm text-[#8B4513]">
          En breve nos pondremos en contacto para coordinar la entrega o el retiro del pedido.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <button
            onClick={() => router.push("/consultarPedido")}
            className="bg-[#FFD966] hover:bg-[#f5c741] text-[#5A3E1B] px-5 py-2 rounded-md text-sm font-medium"
          >
            Consultar mi pedido
          </button>

          <button
            onClick={() => router.push("/productos")}
            className="bg-white border border-[#E0E0E0] hover:bg-[#fff4d3] text-[#5A3E1B] px-5 py-2 rounded-md text-sm font-medium"
          >
            Seguir comprando
          </button>
        </div>
      </motion.div>
    </div>
  );
}

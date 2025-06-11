
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";

declare global {
  interface Window {
    mp: any;
  }
}

type Props = {
  total: number;
  onSuccess: () => void;
};

export default function MercadoPagoBricks({ total, onSuccess }: Props) {
  const cart = useCartStore((state) => state.cart);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
   const [paymentSuccess, setPaymentSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    script.onload = initBricks;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (preferenceId) {
      initBricks();
    }
  }, [preferenceId]);

  const initBricks = () => {
    if (!window.mp || !preferenceId) return;
    const bricksBuilder = window.mp.bricks();

    bricksBuilder.create("payment", "paymentBrick_container", {
      initialization: { preferenceId },
      callbacks: {
        onReady: () => console.log("🧱 PaymentBrick listo"),
        onSubmit: async ({ selectedPaymentMethod, formData }: any) => {
          console.log("✅ Pago procesado", formData);
          setPaymentSuccess(true);
          onSuccess();
          router.push("/checkout?status=success");
        },
        onError: (error: any) => {
          console.error("❌ Error en el pago", error);
        },
      },
    });

    bricksBuilder.create("wallet", "walletBrick_container", {
      initialization: { preferenceId },
      callbacks: {
        onReady: () => console.log("🧱 WalletBrick listo"),
        onError: (error: any) => {
          console.error("❌ Error en wallet", error);
        },
      },
    });
  };

  useEffect(() => {
    const createPreference = async () => {
      try {
        const res = await fetch("/api/create_preference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: cart, total }),
        });
        const json = await res.json();
        setPreferenceId(json.id);
      } catch (err) {
        console.error("❌ No se pudo crear la preferencia", err);
      }
    };

    createPreference();
  }, [cart, total]);

  return (
    <div ref={containerRef} className="mt-6 space-y-6">
      
      <div id="paymentBrick_container" className="min-h-[250px] bg-white p-4 rounded-xl shadow-md" />
      <div id="walletBrick_container" className="min-h-[100px] bg-white p-4 rounded-xl shadow-md" />
    </div>
  );
}

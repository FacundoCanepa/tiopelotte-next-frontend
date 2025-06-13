"use client";

import { useCartStore } from "@/store/cart-store";

interface Props {
  total: number;
}

export default function MercadoPagoButton({ total }: Props) {
  const cart = useCartStore((state) => state.cart);
  const tipoPago = useCartStore((state) => state.tipoPago); // ✅ importante

const handleClick = async () => {
  try {
    const cartStore = useCartStore.getState();

    const items = cartStore.cart.map((item) => ({
      title: item.product.productName,
      quantity: item.quantity,
      unit_price: item.product.price,
    }));

    const body = {
      items,
      cart: cartStore.cart,
      tipoEntrega: cartStore.tipoEntrega,
      zona: cartStore.zona,
      direccion: cartStore.direccion,
      referencias: cartStore.referencias,
      tipoPago: cartStore.tipoPago,
      total: cartStore.getTotalPrice(),
      nombre: cartStore.nombre,
      telefono: cartStore.telefono,
      userId: typeof window !== "undefined" && localStorage.getItem("userId") // o usá useUserStore si lo tenés
    };

    console.log("📦 Enviando body completo a MP:", body);

    const res = await fetch("/api/mercadopago", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (data?.url) {
      window.location.href = data.url;
    } else {
      alert("Error al generar pago");
      console.error("Respuesta:", data);
    }
  } catch (err) {
    console.error("❌ Error al generar link de pago:", err);
  }
};

  return (
    <button
      type="button"
      onClick={handleClick}
      className="mt-4 bg-[#2ecc71] hover:bg-[#27ae60] text-white w-full py-2 rounded-md"
    >
      Ir a pagar
    </button>
  );
}

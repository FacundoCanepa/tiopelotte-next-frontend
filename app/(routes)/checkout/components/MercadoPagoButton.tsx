"use client";

import { useCartStore } from "@/store/cart-store";
import { useUserStore } from "@/store/user-store";
import { zonas } from "@/app/(routes)/ubicacion/components/zonas";

interface Props {
  total: number;
}

export default function MercadoPagoButton({ total }: Props) {
  const tipoPago = useCartStore((state) => state.tipoPago);

  const handleClick = async () => {
    try {
      const cartStore = useCartStore.getState();
      const userId = useUserStore.getState().user?.id;

      // ✅ Formateamos los productos para que se vean bien en MP
      const items = cartStore.cart.map((item) => ({
        title: `${item.quantity} x ${item.product.productName}`,
        quantity: 1,
        unit_price: Math.round(item.quantity * item.product.price),
      }));

      // ✅ Agregamos el envío si corresponde
      if (cartStore.tipoEntrega === "domicilio" && cartStore.zona) {
        const zonaSeleccionada = zonas.find((z) => z.nombre === cartStore.zona);
        if (zonaSeleccionada) {
          const costoEnvio = parseInt(zonaSeleccionada.precio.replace(/[$.]/g, ""));
          items.push({
            title: "Envío a domicilio",
            quantity: 1,
            unit_price: costoEnvio,
          });
        }
      }

      const body = {
        items,
        cart: cartStore.cart,
        tipoEntrega: cartStore.tipoEntrega,
        zona: cartStore.zona,
        direccion: cartStore.direccion,
        referencias: cartStore.referencias,
        tipoPago: cartStore.tipoPago,
        total: total,
        nombre: cartStore.nombre,
        telefono: cartStore.telefono,
        userId,
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

"use client";

import { useCartStore } from "@/store/cart-store";
import { zonas } from "@/app/(routes)/ubicacion/components/zonas";

interface Props {
  total: number;
}

export default function MercadoPagoButton({ total }: Props) {
  const tipoPago = useCartStore((state) => state.tipoPago);

  const handleClick = async () => {
    try {
      const cartStore = useCartStore.getState();

      // ✅ 1. Preparar productos visibles para Mercado Pago
      const items = cartStore.cart
        .filter((item) => item.product?.productName && item.product?.price)
        .map((item) => ({
          title: item.product.productName,
          quantity: item.quantity,
          unit_price: item.product.price,
        }));

      // ✅ 2. Agregar el costo de envío si corresponde
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

      console.log("🧾 Items para MP:", items);

      // ✅ 3. Armar el cuerpo del pedido
      const pedidoData = {
        items,
        tipoEntrega: cartStore.tipoEntrega,
        zona: cartStore.zona,
        direccion: cartStore.direccion,
        referencias: cartStore.referencias,
        tipoPago: cartStore.tipoPago,
        total,
        nombre: cartStore.nombre,
        telefono: cartStore.telefono,
      };

      console.log("📦 Pedido temporal a guardar:", pedidoData);

      // ✅ 4. Guardar pedido temporal
      const tempRes = await fetch("/api/pedido-temporal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidoData),
      });

      const tempJson = await tempRes.json();
      console.log("📨 Respuesta de /api/pedido-temporal:", tempJson);

      const pedidoToken = tempJson?.pedidoToken;

      if (!pedidoToken) {
        alert("No se pudo generar el pedido temporal.");
        return;
      }

      // ✅ 5. Crear preferencia de Mercado Pago
      const res = await fetch("/api/mercadopago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          pedidoToken,
          tipoPago: cartStore.tipoPago,
        }),
      });

      const data = await res.json();
      console.log("🔗 Respuesta de /api/mercadopago:", data);

      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert("Error al generar el link de pago.");
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

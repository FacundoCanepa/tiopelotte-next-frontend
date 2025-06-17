"use client";

import { CartItem } from "@/store/cart-store";

export async function enviarPedido({
  cart,
  total,
  zona,
  direccion,
  referencias,
  telefono,
  nombreApellido,
}: {
  cart: CartItem[];
  total: number;
  zona: string;
  direccion: string;
  referencias?: string;
  telefono: string;
  nombreApellido?: string;
}) {
  console.log("📞 Teléfono recibido:", telefono);
  console.log("🙋‍♂️ Nombre recibido:", nombreApellido);

 const items = cart.map((item: any) => {
  const enrichedItem = {
    title: item.product.productName,                  
    quantity: item.quantity,                         
    unit_price: item.product.price,                   

    product_id: item.product.id,
    product_name: item.product.productName,
    slug: item.product.slug,
    img: item.product.img?.[0]?.url || "",
    description: item.product.description,
    unidad_medida: item.product.unidadMedida,
    is_offer: item.product.isOffer,
    subtotal: item.quantity * item.product.price,
  };

  return enrichedItem;
});


  const payload = {
    data: {
      items,
      total,
      estado: "Pendiente",
      zona,
      direccion,
      referencias,
      telefono: telefono?.trim() || "sin teléfono",
      nombre: nombreApellido || "Cliente sin cuenta",

    },
  };

  console.log("📦 Payload final:", payload);

  try {
    const res = await fetch("https://loved-ducks-790a0f88b6.strapiapp.com/api/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log("📨 Respuesta de Strapi:", text);

    const data = JSON.parse(text);

    if (!res.ok) {
      console.error("❌ Error creando pedido:", data);
      throw new Error(data?.error?.message || "Error al crear el pedido");
    }

    return data;
  } catch (error) {
    console.error("❌ Error inesperado al enviar pedido:", error);
    throw error;
  }
}

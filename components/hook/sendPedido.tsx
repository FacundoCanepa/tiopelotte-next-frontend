"use client";

import { CartItem } from "@/store/cart-store";
import { UserType } from "@/types/user";

export async function enviarPedido({
  cart,
  total,
  zona,
  direccion,
  referencias,
  user,
}: {
  cart: CartItem[];
  total: number;
  zona: string;
  direccion: string;
  referencias?: string;
  user?: UserType | null;
}) {
  const items = cart.map((item) => ({
    productId: item.product.id,
    productName: item.product.productName,
    quantity: item.quantity,
    unitPrice: item.product.price,
    subtotal: item.quantity * item.product.price,
    img: item.product.img?.url || "",
    slug: item.product.slug,
    unidadMedida: item.product.unidadMedida,
  }));

  const payload = {
    data: {
      items,
      total,
      estado: "Pendiente",
      zona,
      direccion,
      referencias,
      telefono: user?.telefono || "sin teléfono",
      nombreApellido: user?.username || "Cliente sin cuenta",
    },
  };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("📦 Error al crear pedido:", data);
      throw new Error(data?.error?.message || JSON.stringify(data) || "Error al crear el pedido");
    }

    return data;
  } catch (error) {
    console.error("❌ Error enviando pedido:", error);
    throw error;
  }
}

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
  }));

  const payload = {
    data: {
      items,
      total,
      estado: "Pendiente",
      zona,
      direccion,
      referencias,
      ...(user?.id && { user: user.id }),
    },
  };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify(payload),
      }
    );
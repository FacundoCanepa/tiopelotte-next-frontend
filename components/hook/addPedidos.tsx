"use server";

import { revalidatePath } from "next/cache";

export async function addPedido(pedidoData: any) {
  const STRAPI_URL = "https://loved-ducks-790a0f88b6.strapiapp.com/api/pedidos";
  const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

  if (!STRAPI_TOKEN) {
    console.error("❌ Faltante STRAPI_API_TOKEN en variables de entorno");
    throw new Error("Token de autenticación no disponible");
  }

  const payload = {
    data: pedidoData,
  };

  console.log("📦 Payload que se enviará a Strapi:", payload);

  try {
    const res = await fetch(STRAPI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_TOKEN}`,
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

    // Si estás usando vista interna tipo admin
    revalidatePath("/admin/pedidos");

    return data;
  } catch (error) {
    console.error("❌ Error inesperado al enviar pedido:", error);
    throw error;
  }
}

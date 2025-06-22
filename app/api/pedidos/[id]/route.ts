import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_ADMIN_TOKEN;

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const body = await req.json();

  console.log("🟠 ID recibido:", id);
  console.log("🟠 BODY recibido:", body);

  try {
    const res = await fetch(`${STRAPI_URL}/api/pedidos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-strapi-admin-token": STRAPI_API_TOKEN,
      },
      body: JSON.stringify(body), // debe venir como { data: { estado: "Entregado" } }
    });

    const json = await res.json();

    console.log("🟢 Respuesta de Strapi:", json);

    if (!res.ok) {
      console.error("❌ Error en la respuesta de Strapi:", json);
      return NextResponse.json({ error: "Error al actualizar en Strapi", details: json }, { status: res.status });
    }

    return NextResponse.json(json);
  } catch (err: any) {
    console.error("❌ Error inesperado:", err);
    return NextResponse.json({ error: "Error inesperado", message: err.message }, { status: 500 });
  }
}

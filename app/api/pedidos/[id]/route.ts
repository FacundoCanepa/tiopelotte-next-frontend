import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Record<string, string> }) {
  const id = params.id;
  console.log("🟡 [PUT] === ACTUALIZANDO PEDIDO ===");
  console.log("🔢 ID extraído:", id);

  try {
    const body = await req.json();
    console.log("📥 Body recibido:", body);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const token = process.env.STRAPI_PEDIDOS_TOKEN;

    const url = `${backendUrl}/api/pedidos/${id}`;
    console.log("🌍 URL de destino:", url);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: body }),
    });

    const json = await response.json();
    console.log("📦 Respuesta de Strapi:", json);

    if (!response.ok) {
      console.error("❌ Error:", json.error);
      return NextResponse.json({ error: json.error }, { status: response.status });
    }

    return NextResponse.json(json);
  } catch (err) {
    console.error("❌ Error interno:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const pedidoToken = crypto.randomUUID();

    console.log("📥 Pedido recibido:", body);
    console.log("🔑 Token generado:", pedidoToken);

    const payload = {
      data: {
        ...body,
        pedidoToken,
        estado: "Pendiente",
      },
    };

    console.log("📦 Payload final:", payload);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedido-temporals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("✅ Pedido temporal guardado:", data);

    return NextResponse.json({
      pedidoToken,
      strapiId: data?.data?.id,
    });
  } catch (err) {
    console.error("❌ Error en /api/pedido-temporal:", err);
    return new NextResponse("Error al guardar pedido temporal", { status: 500 });
  }
}

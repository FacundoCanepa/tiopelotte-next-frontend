import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const paymentIdFromQuery = url.searchParams.get("id");

  try {
    const body = await req.json().catch(() => null);
    const paymentIdFromBody = body?.data?.id;

    const paymentId = paymentIdFromBody || paymentIdFromQuery;

    console.log("📥 Webhook recibido. ID:", paymentId);

    if (!paymentId) {
      return new NextResponse("No payment ID", { status: 400 });
    }

    const resPago = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
    });

    const dataPago = await resPago.json();
    console.log("✅ Detalle del pago:", dataPago);

    if (dataPago.status !== "approved") {
      return new NextResponse("Pago no aprobado", { status: 400 });
    }

    const metadata = dataPago.metadata;

    const yaExiste = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos?filters[payment_id][$eq]=${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
      }
    );

    const existeData = await yaExiste.json();
    if (existeData?.data?.length > 0) {
      console.log("⚠️ Pedido ya existía.");
      return new NextResponse("Pedido ya creado", { status: 200 });
    }

    const payload = {
      data: {
        items: metadata.cart,
        tipoEntrega: metadata.tipoEntrega,
        zona: metadata.zona,
        direccion: metadata.direccion,
        referencias: metadata.referencias,
        tipoPago: metadata.tipoPago,
        total: metadata.total,
        payment_id: paymentId,
        estado: "Pendiente",
        nombre: metadata.nombre,
        telefono: metadata.telefono,
        user: metadata.userId || null,
      },
    };

    console.log("📦 Payload a Strapi:", payload);

    const crear = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await crear.json();
    console.log("✅ Pedido creado desde webhook:", result);

    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("❌ Error en webhook:", err);
    return new NextResponse("Error interno", { status: 500 });
  }
}

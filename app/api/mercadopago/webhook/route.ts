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

    // Obtener info del pago desde MP
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

    // Extraer metadata del pago
    const metadata = dataPago.metadata || {};
    const getMeta = (camel: string, snake: string) =>
      metadata[camel] ?? metadata[snake];

    const cart = metadata.cart || [];
    const tipoEntrega = getMeta("tipoEntrega", "tipo_entrega");
    const zona = metadata.zona;
    const direccion = metadata.direccion;
    const referencias = metadata.referencias;
    const tipoPago = getMeta("tipoPago", "tipo_pago");
    const total = metadata.total;
    const nombre = metadata.nombre;
    const telefono = metadata.telefono;
    const userId = getMeta("userId", "user_id");

    const payload = {
      data: {
        items: cart,
        tipoEntrega,
        zona,
        direccion,
        referencias,
        tipoPago,
        total,
        payment_id: paymentId,
        estado: "Pendiente",
        nombre,
        telefono
      },
    };

    console.log("📦 Payload a enviar a Strapi:", payload);

    // Verificar si ya existe un pedido con ese payment_id
    const yaExiste = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos?filters[payment_id][$eq]=${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      }
    );

    const existeData = await yaExiste.json();
    if (existeData?.data?.length > 0) {
      console.log("⚠️ Pedido ya existente, no se crea duplicado.");
      return new NextResponse("Pedido ya creado", { status: 200 });
    }

    // Crear nuevo pedido
    const crear = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
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

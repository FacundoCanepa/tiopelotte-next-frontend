import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { payment_id } = body;

    console.log("📥 Recibido en verificar-pago:", body);

    if (!payment_id) {
      return NextResponse.json(
        { error: "payment_id requerido" },
        { status: 400 }
      );
    }

    // Paso 1: Consultar Mercado Pago
    const resPago = await fetch(
      `https://api.mercadopago.com/v1/payments/${payment_id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const dataPago = await resPago.json();
    console.log("✅ Respuesta de Mercado Pago:", dataPago);

    if (dataPago.status !== "approved") {
      console.warn("❌ Pago no aprobado");
      return NextResponse.json({ error: "Pago no aprobado" }, { status: 400 });
    }

    const metadata = dataPago.metadata;

    // Paso 2: Verificar si ya existe
    const yaExiste = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos?filters[payment_id][$eq]=${payment_id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
      }
    );

    const existeData = await yaExiste.json();
    console.log("🔎 Pedido existente:", existeData);
    if (existeData?.data?.length > 0) {
      return NextResponse.json({ status: "ok", message: "Pedido ya creado" });
    }

    // Paso 3: Crear pedido en Strapi utilizando la metadata del pago
    const payload = {
      data: {
        items: metadata.cart,
        tipoEntrega: metadata.tipoEntrega,
        zona: metadata.zona,
        direccion: metadata.direccion,
        referencias: metadata.referencias,
        tipoPago: metadata.tipoPago,
        total: metadata.total,
        payment_id,
        estado: "Pendiente",
        nombre: metadata.nombre,
        telefono: metadata.telefono,
        user: metadata.userId || null,
      },
    };

    console.log("📦 Payload a enviar a Strapi:", payload);

    const crear = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await crear.json();
    console.log("✅ Pedido creado:", result);

    return NextResponse.json({ status: "ok", pedidoId: result?.data?.id });
  } catch (err) {
    console.error("❌ Error en verificar-pago:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
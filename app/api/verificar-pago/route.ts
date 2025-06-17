import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { payment_id } = await req.json();

    console.log("🔎 Payment ID recibido:", payment_id);
    if (!payment_id) {
      return NextResponse.json({ error: "payment_id requerido" }, { status: 400 });
    }

    // 1. Verificar en Mercado Pago
    const resPago = await fetch(`https://api.mercadopago.com/v1/payments/${payment_id}`, {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const dataPago = await resPago.json();
    console.log("📄 Respuesta de Mercado Pago:", dataPago);

    if (dataPago.status !== "approved") {
      return NextResponse.json({ error: "Pago no aprobado" }, { status: 400 });
    }

    const pedidoToken = dataPago.metadata?.pedidoToken;
    if (!pedidoToken) {
      return NextResponse.json({ error: "pedidoToken faltante" }, { status: 400 });
    }

    // 2. Verificar que el pedido no exista ya
    const yaExiste = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos?filters[payment_id][$eq]=${payment_id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      }
    );

    const existeData = await yaExiste.json();
    if (existeData?.data?.length > 0) {
      return NextResponse.json({ status: "ok", message: "Pedido ya creado" });
    }

    // 3. Buscar el pedido-temporal
    const tempRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedido-temporals?filters[pedidoToken][$eq]=${pedidoToken}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      }
    );

    const tempData = await tempRes.json();
    const pedidoTemp = tempData?.data?.[0];

    if (!pedidoTemp) {
      return NextResponse.json({ error: "No se encontró el pedido temporal" }, { status: 404 });
    }

    const payload = {
      data: {
        ...pedidoTemp.attributes,
        estado: "Confirmado",
        payment_id,
      },
    };

    // 4. Crear el pedido final en Strapi
    const crear = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await crear.json();
    console.log("✅ Pedido creado:", result);

    return NextResponse.json({ status: "ok", metadata: dataPago.metadata });
  } catch (err) {
    console.error("❌ Error interno en verificar-pago:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

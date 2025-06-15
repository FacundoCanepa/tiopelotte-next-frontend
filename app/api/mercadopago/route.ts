// app/api/mercadopago/route.ts

import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const {
      items,          // [{ title, quantity, unit_price }]
      cart,           // carrito completo (por si se necesita)
      tipoEntrega,
      zona,
      direccion,
      referencias,
      tipoPago,
      total,
      nombre,
      telefono,
      userId,
    } = await req.json();

    // 📋 Logs para debug
    console.log("🔹 items recibidos:", items);
    console.log("📦 tipoEntrega:", tipoEntrega);
    console.log("📍 zona:", zona);
    console.log("🏠 direccion:", direccion);
    console.log("📄 referencias:", referencias);
    console.log("💳 tipoPago:", tipoPago);
    console.log("💰 total:", total);
    console.log("🙋‍♂️ nombre:", nombre);
    console.log("📞 telefono:", telefono);
    console.log("🧑‍💻 userId:", userId);

    // ✅ Procesar cada item (1 por línea, sin quantity decimal)
    const itemsProcesados = items.map((item: any) => {
      const precio = tipoPago === "efectivo"
        ? Math.round(item.unit_price * 0.1)
        : item.unit_price;

      return {
        title: item.title,  // Ej: "1 x Ravioles Mixtos"
        quantity: 1,
        unit_price: precio,
      };
    });

    console.log("📦 itemsProcesados para MP:", itemsProcesados);

    const metadata = {
      cart: items,
      tipoEntrega,
      zona,
      direccion,
      referencias,
      tipoPago,
      total,
      nombre,
      telefono,
      userId,
    };

    console.log("📩 Metadata enviada:", metadata);

    const { id, init_point } = await new Preference(mp).create({
      body: {
        items: itemsProcesados,
        back_urls: {
          success: "https://8cg4tq4t-3000.brs.devtunnels.ms/checkout/success",
          failure: "https://8cg4tq4t-3000.brs.devtunnels.ms/checkout/failure",
          pending: "https://8cg4tq4t-3000.brs.devtunnels.ms/checkout/pending",
        },
        notification_url: "https://8cg4tq4t-3000.brs.devtunnels.ms/api/mercadopago/webhook",
        auto_return: "approved",
        metadata,
        statement_descriptor: "TIO PELOTTE", 
      },
    });

    console.log("✅ Preferencia creada:");
    console.log("🆔 ID:", id);
    console.log("🔗 Init Point:", init_point);

    return NextResponse.json({ url: init_point });
  } catch (error) {
    console.error("❌ Error al crear preferencia:", error);
    return new NextResponse("Error interno al crear preferencia", { status: 500 });
  }
}

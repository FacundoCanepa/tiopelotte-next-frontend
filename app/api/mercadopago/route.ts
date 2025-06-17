import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const {
      items,
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

    const itemsProcesados = items.map((item: any) => {
      const precio = tipoPago === "efectivo"
        ? Math.round(item.unit_price * 0.1)
        : item.unit_price;

      return {
        title: item.title,
        quantity: 1,
        unit_price: precio,
        productName: item.productName,
      };
    });

    const metadata = {
      cart: itemsProcesados,
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

    return NextResponse.json({ id, url: init_point });
  } catch (error) {
    console.error("❌ Error al crear preferencia:", error);
    return NextResponse.json({ error: "Error al crear preferencia" }, { status: 500 });
  }
}

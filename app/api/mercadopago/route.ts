import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import type { ItemType } from "@/types/item";

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

    const itemsProcesados = (items as ItemType[]).map((item) => {
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

    const successUrl = process.env.MP_SUCCESS_URL!;
    const failureUrl = process.env.MP_FAILURE_URL!;
    const pendingUrl = process.env.MP_PENDING_URL!;
    const webhookUrl = process.env.MP_WEBHOOK_URL!;

    const { id, init_point } = await new Preference(mp).create({
      body: {
        items: itemsProcesados,
        back_urls: {
          success: successUrl,
          failure: failureUrl,
          pending: pendingUrl,
        },
        notification_url: webhookUrl,
        auto_return: "approved",
        metadata,
        statement_descriptor: "TIO PELOTTE",
      },
    });

    return NextResponse.json({ id, url: init_point });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear preferencia" }, { status: 500 });
  }
}

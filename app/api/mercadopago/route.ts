// app/api/mercadopago/route.ts
import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { items, tipoPago } = await req.json();

    console.log("🧾 Tipo de pago:", tipoPago);

    const itemsProcesados = items.map((item: any) => ({
      ...item,
      unit_price:
        tipoPago === "efectivo"
          ? Math.round(item.unit_price * 0.1)
          : item.unit_price,
    }));

      const preference = await new Preference(mp).create({
        body: {
          items: itemsProcesados,
          back_urls: {
            success: "https://8cg4tq4t-3000.brs.devtunnels.ms/checkout/success",
            failure: "https://8cg4tq4t-3000.brs.devtunnels.ms/checkout/failure",
            pending: "https://8cg4tq4t-3000.brs.devtunnels.ms/checkout/pending",
          },
          notification_url: "https://tudominio.com/api/mercadopago/webhook", 
          auto_return: "approved" , 
          metadata: { tipo: tipoPago },
        },
      });


    return NextResponse.json({ url: preference.init_point });
  } catch (error) {
    console.error("❌ Error al crear preferencia:", error);
    return new NextResponse("Error interno al crear preferencia", { status: 500 });
  }
}

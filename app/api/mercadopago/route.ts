import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { items, pedidoToken, tipoPago } = await req.json();

    console.log("📥 Body recibido:", { items, pedidoToken, tipoPago });

    if (!items || !pedidoToken) {
      console.warn("⚠️ Faltan datos requeridos: items o pedidoToken");
      return new NextResponse("Faltan datos", { status: 400 });
    }

    const mpItems = items.map((item: any, index: number) => {
      const precio = tipoPago === "efectivo"
        ? Math.round(item.unit_price * 0.1)
        : item.unit_price;

      console.log(`🧾 Item ${index + 1}:`, {
        title: item.title,
        quantity: item.quantity,
        unit_price: precio,
      });

      return {
        title: item.title,
        quantity: item.quantity,
        unit_price: precio,
      };
    });

    console.log("✅ Items finales para MP:", mpItems);

    const preference = await new Preference(mp).create({
      body: {
        items: mpItems,
        metadata: {
          pedidoToken,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/checkout/success`,
          failure: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/checkout/failure`,
          pending: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/checkout/pending`,
        },
        notification_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/mercadopago/webhook`,
        auto_return: "approved",
        statement_descriptor: "TIO PELOTTE",
      },
    });

    console.log("🔗 Preferencia creada:", preference.body.init_point);
    return NextResponse.json({ url: preference.body.init_point });
  } catch (error: any) {
    console.error("❌ Error al crear preferencia:", error?.message || error);
    return new NextResponse("Error interno al crear preferencia", { status: 500 });
  }
}

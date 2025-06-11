import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, total } = body;

    const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: items.map((item: any) => ({
          title: item.productName,
          quantity: item.quantity,
          unit_price: item.price,
          currency_id: "ARS",
        })),
        back_urls: {
          success: "https://tupagina.com/checkout?status=success",
          failure: "https://tupagina.com/checkout?status=failure",
        },
        auto_return: "approved",
      }),
    });

    const data = await res.json();
    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error("❌ Error al crear preferencia:", err);
    return new NextResponse("Error al crear preferencia", { status: 500 });
  }
}

// app/api/create-preference/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { cart, total, user } = await req.json();

  const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      items: cart.map((item: any) => ({
        title: item.productName,
        quantity: item.quantity,
        currency_id: "ARS",
        unit_price: item.price,
      })),
      payer: {
        email: user.email,
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_FRONT_URL}/gracias`,
        failure: `${process.env.NEXT_PUBLIC_FRONT_URL}/checkout?error=1`,
        pending: `${process.env.NEXT_PUBLIC_FRONT_URL}/checkout?pending=1`,
      },
      auto_return: "approved",
    }),
  });

  const data = await res.json();
  return NextResponse.json({ init_point: data.init_point });
}

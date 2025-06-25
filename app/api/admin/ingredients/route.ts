import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ingredientes?sort[0]=ingredienteName&pagination[pageSize]=100`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_PEDIDOS_TOKEN}`,
      },
    }
  );

  const data = await res.json();
  return NextResponse.json(data);
}

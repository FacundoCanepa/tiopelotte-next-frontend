import { NextRequest, NextResponse } from "next/server";

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ingredientes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_PEDIDOS_TOKEN}`,
      },
      body: JSON.stringify({ data: body }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const pathParts = req.nextUrl.pathname.split("/");
  const id = pathParts[pathParts.length - 1];

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos?filters[id][$eq]=${id}&populate=*`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    }
  );

  const json = await res.json();
  const pedido = json.data?.[0] || null;

  return NextResponse.json(pedido);
}

export async function PUT(req: NextRequest) {
  const pathParts = req.nextUrl.pathname.split("/");
  const id = pathParts[pathParts.length - 1];

  const body = await req.json(); // ej: { estado: "Entregado" }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
    body: JSON.stringify({ data: body }),
  });

  const json = await res.json();
  return NextResponse.json(json);
}

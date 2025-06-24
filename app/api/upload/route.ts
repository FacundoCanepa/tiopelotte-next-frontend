import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const token = process.env.STRAPI_PEDIDOS_TOKEN;

    const res = await fetch(`${backendUrl}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error en POST /api/upload:", error);
    return NextResponse.json({ error: "Error al subir la imagen" }, { status: 500 });
  }
}
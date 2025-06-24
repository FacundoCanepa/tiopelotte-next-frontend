import { NextRequest, NextResponse } from "next/server";

const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
const token = process.env.STRAPI_PEDIDOS_TOKEN;

// GET todos los ingredientes
export async function GET() {
  try {
    const res = await fetch(`${backend}/api/ingredientes?populate=*`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.error("Error al obtener ingredientes:", res.statusText);
      return NextResponse.json({ error: "Error al obtener ingredientes" }, { status: res.status });
    }

    const json = await res.json();

    const data = Array.isArray(json?.data)
      ? json.data.map((item: any) => ({
          id: item.id,
          nombre: item.ingredienteName,
          stock: item.Stock,
          unidadMedida: item.unidadMedida,
          precio: item.precio,
          stockUpdatedAt: item.stockUpdatedAt,
        }))
      : [];

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("Error interno en GET ingredientes:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// POST nuevo ingrediente
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${backend}/api/ingredientes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: body }),
    });

    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (err) {
    console.error("Error interno en POST ingrediente:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// PUT para actualizar un ingrediente
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const res = await fetch(`${backend}/api/ingredientes/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: body }),
    });

    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (err) {
    console.error("Error interno en PUT ingrediente:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// DELETE para eliminar un ingrediente
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${backend}/api/ingredientes/${params.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (err) {
    console.error("Error interno en DELETE ingrediente:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

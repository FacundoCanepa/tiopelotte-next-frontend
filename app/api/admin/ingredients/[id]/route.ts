import { NextRequest, NextResponse } from "next/server";

const backend = process.env.NEXT_PUBLIC_BACKEND_URL!;
const token = process.env.STRAPI_PEDIDOS_TOKEN!;

async function getIngredientId(documentId: string) {
  console.log("🔍 Buscando ingrediente con documentId:", documentId);
  const search = await fetch(
    `${backend}/api/ingredientes?filters[documentId][$eq]=${documentId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const json = await search.json();
  console.log("🔎 Resultado búsqueda:", json);
  return json.data?.[0]?.id as number | undefined;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const body = await req.json();
    console.log("📥 PUT recibido body:", body);
    console.log("🆔 Params:", id);

    const ingredientId = await getIngredientId(id);

    if (!ingredientId) {
      console.warn("⚠️ Ingrediente no encontrado:", id);
      return NextResponse.json(
        { error: "Ingrediente no encontrado" },
        { status: 404 }
      );
    }

    const data = {
      ingredienteName: body.ingredienteName,
      Stock: body.Stock,
      unidadMedida: body.unidadMedida,
      precio: body.precio,
    };

    console.log("🛠️ Payload limpio para PUT:", data);

    const res = await fetch(`${backend}/api/ingredientes/${ingredientId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data }),
    });

    const json = await res.json();
    console.log("✅ Respuesta PUT:", json);
    return NextResponse.json(json, { status: res.status });
  } catch (error) {
    console.error("🔥 Error en PUT:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    console.log("🗑️ DELETE recibido para:", id);

    const ingredientId = await getIngredientId(id);

    if (!ingredientId) {
      console.warn(
        "⚠️ Ingrediente no encontrado para eliminar:",
        id
      );
      return NextResponse.json(
        { error: "Ingrediente no encontrado" },
        { status: 404 }
      );
    }

    const res = await fetch(`${backend}/api/ingredientes/${ingredientId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 204) {
      console.log("✅ Ingrediente eliminado correctamente");
      return new Response(null, { status: 204 });
    }

    const json = await res.json();
    console.log("⚠️ Respuesta DELETE (no 204):", json);
    return NextResponse.json(json, { status: res.status });
  } catch (error) {
    console.error("🔥 Error en DELETE:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

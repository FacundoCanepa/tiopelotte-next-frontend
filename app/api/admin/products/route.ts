import { NextRequest, NextResponse } from "next/server";
import { apiCall } from "@/lib/api";

const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
const token = process.env.STRAPI_PEDIDOS_TOKEN;

if (!backend || !token) {
  throw new Error("Backend URL and Strapi token are required");
}

export async function GET() {
  try {
    const result = await apiCall(`${backend}/api/products?populate=*`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error }, 
        { status: result.status }
      );
    }
    
    return NextResponse.json(result.data, { status: 200 });
  } catch (err) {
    console.error("Products GET error:", err);
    return NextResponse.json(
      { error: "Error al obtener productos" }, 
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      documentId,
      createdAt,
      updatedAt,
      publishedAt,
      img,
      img_carousel,
      category,
      recetas,
      ingredientes,
      ...rest
    } = body;

    const cleanBody = {
      ...rest,
      img: typeof img === "object" && img?.id ? img.id : img,
      img_carousel: Array.isArray(img_carousel)
        ? img_carousel.map((i) => i.id || i)
        : [],
      category: typeof category === "object" ? category.id : category,
      recetas: Array.isArray(recetas)
        ? recetas.map((r) => r.id || r)
        : [],
      ingredientes: Array.isArray(ingredientes)
        ? ingredientes.map((i) => i.id || i)
        : [],
    };

    const result = await apiCall(`${backend}/api/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: cleanBody }),
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error }, 
        { status: result.status }
      );
    }
    
    return NextResponse.json(result.data, { status: 200 });
  } catch (err) {
    console.error("❌ Error interno al crear producto:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" }, 
      { status: 500 }
    );
  }
}

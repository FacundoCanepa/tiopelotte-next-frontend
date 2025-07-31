import { NextRequest, NextResponse } from "next/server";
import { apiCall } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos?populate=*`;
    
    const result = await apiCall(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_PEDIDOS_TOKEN}`,
      },
    });
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error }, 
        { status: result.status }
      );
    }
    
    return NextResponse.json(result.data, { status: 200 });
  } catch (err) {
    console.error("Pedidos GET error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" }, 
      { status: 500 }
    );
  }
}
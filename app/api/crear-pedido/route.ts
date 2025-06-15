import { NextResponse } from "next/server";
import { addPedido } from "@/components/hook/addPedidos";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("📥 Body recibido en /api/crear-pedido:", body);

    const data = await addPedido(body);

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error en /api/crear-pedido:", error);
    return NextResponse.json(
      { error: error.message || "Error interno al crear pedido" },
      { status: 500 }
    );
  }
}

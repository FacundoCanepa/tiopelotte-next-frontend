import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { apiCall } from "@/lib/api";

// Validate environment variables
if (!process.env.MP_ACCESS_TOKEN) {
  throw new Error("MP_ACCESS_TOKEN is required");
}

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

export async function POST(req: Request) {
  try {
    if (!process.env.MP_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: "Configuración de MercadoPago faltante" },
        { status: 500 }
      );
    }

    const {
      items,
      tipoEntrega,
      zona,
      direccion,
      referencias,
      tipoPago,
      total,
      nombre,
      telefono,
      userId,
    } = await req.json();

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items son requeridos" },
        { status: 400 }
      );
    }

    const itemsProcesados = items.map((item: any) => {
      const precio = tipoPago === "efectivo"
        ? Math.round(item.unit_price * 0.1)
        : item.unit_price;

      return {
        title: item.title,
        quantity: 1,
        unit_price: precio,
        productName: item.productName,
      };
    });

    const metadata = {
      cart: itemsProcesados,
      tipoEntrega,
      zona,
      direccion,
      referencias,
      tipoPago,
      total,
      nombre,
      telefono,
      userId,
    };
    const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

    if (!baseUrl) {
      return NextResponse.json(
        { error: "URL del frontend no configurada" },
        { status: 500 }
      );
    }

    const preference = await new Preference(mp).create({
      body: {
        items: itemsProcesados,
        back_urls: {
          success: `${baseUrl}/checkout/success`,
          failure: `${baseUrl}/checkout/failure`,
          pending: `${baseUrl}/checkout/pending`,
        },
        notification_url: `${baseUrl}/api/mercadopago/webhook`,
        auto_return: "approved",
        metadata,
        statement_descriptor: "TIO PELOTTE",
      },
    });

    if (!preference.id || !preference.init_point) {
      throw new Error("Error al crear preferencia de MercadoPago");
    }

    return NextResponse.json({ 
      id: preference.id, 
      url: preference.init_point 
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error al crear preferencia:", error);
    return NextResponse.json(
      { 
        error: "Error al crear preferencia de pago",
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

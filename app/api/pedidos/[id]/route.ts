import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const pathParts = req.nextUrl.pathname.split("/");
  const id = pathParts[pathParts.length - 1];

  console.log("\n🟢 [GET] === CONSULTANDO PEDIDO ===");
  console.log("🔢 ID:", id);

  // Mostrar los env
  console.log("🌍 ENV > NEXT_PUBLIC_BACKEND_URL:", process.env.NEXT_PUBLIC_BACKEND_URL);
  console.log("🔐 ENV > STRAPI_PEDIDOS_TOKEN (parcial):", process.env.STRAPI_PEDIDOS_TOKEN?.slice(0, 10) + "..." + process.env.STRAPI_PEDIDOS_TOKEN?.slice(-5));

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos?filters[id][$eq]=${id}&populate=*`;
  console.log("🌐 URL:", url);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_PEDIDOS_TOKEN}`,
    },
  });

  const raw = await res.text();
  console.log("📦 [GET] Respuesta RAW:", raw);

  try {
    const json = JSON.parse(raw);
    console.log("🟢 [GET] JSON Parseado:", JSON.stringify(json, null, 2));
    const pedido = json.data?.[0] || null;
    return NextResponse.json(pedido);
  } catch (error) {
    console.error("❌ [GET] Error al parsear JSON:", error);
    return NextResponse.json({ error: "Error al parsear respuesta de Strapi" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  console.log("\n🟡 [PUT] === ACTUALIZANDO PEDIDO ===");

  const pathParts = req.nextUrl.pathname.split("/");
  const id = pathParts[pathParts.length - 1];
  console.log("🔢 ID extraído de la URL:", id);

  const token = process.env.STRAPI_PEDIDOS_TOKEN;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  console.log("🌍 ENV > NEXT_PUBLIC_BACKEND_URL:", backendUrl);
  console.log("🔐 ENV > STRAPI_PEDIDOS_TOKEN (parcial):", token?.slice(0, 10) + "..." + token?.slice(-5));

  if (!token || !backendUrl) {
    console.error("❌ [PUT] Faltan variables de entorno necesarias");
    return NextResponse.json({ error: "Faltan variables de entorno" }, { status: 500 });
  }

  const body = await req.json();
  console.log("📥 Body recibido del frontend:", JSON.stringify(body, null, 2));

  const payload = { data: body };
  const url = `${backendUrl}/api/pedidos/${id}`;

  console.log("🌐 URL de PUT:", url);
  console.log("📤 Payload enviado:", JSON.stringify(payload, null, 2));

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  console.log("📡 Status code:", res.status);
  console.log("📡 Status text:", res.statusText);

  const responseRaw = await res.text();
  console.log("📦 [PUT] Respuesta RAW:", responseRaw);

  let response;
  try {
    response = JSON.parse(responseRaw);
    console.log("✅ [PUT] Respuesta JSON:", JSON.stringify(response, null, 2));
  } catch (e) {
    console.error("❌ [PUT] Error al parsear JSON:", e);
    return NextResponse.json({ error: "Respuesta inválida de Strapi" }, { status: 500 });
  }

  // Verificación después del PUT
  const verifyUrl = `${backendUrl}/api/pedidos?filters[id][$eq]=${id}&populate=*`;
  console.log("🔍 [POST-PUT] Verificando con GET:", verifyUrl);

  const verify = await fetch(verifyUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const verifyRaw = await verify.text();
  console.log("📦 [POST-PUT] Respuesta RAW:", verifyRaw);

  try {
    const verificado = JSON.parse(verifyRaw);
    console.log("✅ [POST-PUT] JSON verificado:", JSON.stringify(verificado, null, 2));
    const pedido = verificado.data?.[0];
    if (pedido) console.log("📝 Estado actualizado:", pedido.estado);
    return NextResponse.json(response);
  } catch (e) {
    console.error("❌ [POST-PUT] Error al parsear verificación:", e);
    return NextResponse.json(response); // devolvemos igual el resultado del PUT
  }
}

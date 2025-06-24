import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
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
    ...rest
  } = body;

  const cleanBody = {
    ...rest,

    img: typeof img === "object" && img?.[0]?.id ? img[0].id : img,
    img_carousel: Array.isArray(img_carousel) ? img_carousel.map((i) => i.id) : [],
    category: typeof category === "object" ? category.id : category,
    recetas: Array.isArray(recetas) ? recetas.map((r) => r.id) : [],
  };


  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${params.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_PEDIDOS_TOKEN}`,
      },
      body: JSON.stringify({ data: cleanBody }),
    }
  );

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

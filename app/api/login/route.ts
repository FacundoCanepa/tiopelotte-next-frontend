import { NextRequest, NextResponse } from "next/server";
import { apiCall } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" }, 
        { status: 400 }
      );
    }

    // Login en Strapi
    const loginResult = await apiCall(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/local`,
      {
        method: "POST",
        body: JSON.stringify({ identifier, password }),
      }
    );

    if (loginResult.error) {
      return NextResponse.json(
        { error: loginResult.error }, 
        { status: loginResult.status }
      );
    }

    const loginData = loginResult.data;
    const jwt = loginData?.jwt;
    const userId = loginData?.user?.id;

    if (!jwt || !userId) {
      return NextResponse.json(
        { error: "Respuesta inválida del servidor" }, 
        { status: 500 }
      );
    }

    // Traer usuario completo con rol
    const userResult = await apiCall(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}?populate=role`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (userResult.error) {
      return NextResponse.json(
        { error: "No se pudo obtener el rol del usuario" }, 
        { status: userResult.status }
      );
    }

    const user = userResult.data;

    return NextResponse.json({ jwt, user }, { status: 200 });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" }, 
      { status: 500 }
    );
  }
}

"use client";

import { useCartStore } from "@/store/cart-store";
import { useUserStore } from "@/store/user-store";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Phone } from "lucide-react";

import CheckoutProductsList from "./CheckoutProductsList";
import CheckoutResumen from "./CheckoutResumen";
import CheckoutDeliverySelector from "./CheckoutDeliverySelector";
import CheckoutForm from "./CheckoutForm";
import CheckoutDeliveryMap from "./CheckoutDeliveryMap";
import { zonas } from "@/app/(routes)/ubicacion/components/zonas";
import Button from "@/components/ui/button";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useUserStore((state) => state.user);
  const jwt = useUserStore((state) => state.jwt);

  const [tipoEntrega, setTipoEntrega] = useState<"domicilio" | "local">("domicilio");
  const [zona, setZona] = useState("");
  const [direccion, setDireccion] = useState("");
  const [referencias, setReferencias] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleConfirmarPedido = async () => {
    setIsLoading(true);
    try {
      if (tipoEntrega === "local") {
        // Crea el pedido sin pagar
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            data: {
              items: cart,
              total,
              estado: "Pendiente",
              tipoEntrega: "local",
              user: user.id,
            },
          }),
        });

        if (!res.ok) throw new Error("Error al crear el pedido");

        clearCart();
        router.push("/gracias");
      } else {
        // Checkout Pro
        const res = await fetch("/api/create-preference", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cart, total, user }),
        });

        const data = await res.json();
        if (data?.init_point) {
          window.location.href = data.init_point;
        } else {
          throw new Error("No se pudo iniciar Mercado Pago");
        }
      }
    } catch (err) {
      alert("Hubo un problema al procesar el pedido.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-center mb-6">Finalizá tu compra</h1>

      <CheckoutDeliverySelector tipoEntrega={tipoEntrega} setTipoEntrega={setTipoEntrega} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {tipoEntrega === "domicilio" && (
            <>
              <CheckoutForm
                zona={zona}
                setZona={setZona}
                direccion={direccion}
                setDireccion={setDireccion}
                referencias={referencias}
                setReferencias={setReferencias}
              />
              <CheckoutDeliveryMap
                tipoEntrega={tipoEntrega}
                zona={zona}
                setZona={setZona}
                direccion={direccion}
                setDireccion={setDireccion}
                referencias={referencias}
                setReferencias={setReferencias}
              />
            </>
          )}

          <CheckoutProductsList />
        </div>

        <div className="space-y-4">
          <CheckoutResumen />
          <Button onClick={handleConfirmarPedido} disabled={isLoading} className="w-full mt-4">
            {isLoading ? "Procesando..." : "Confirmar pedido"}
          </Button>
        </div>
      </div>
    </main>
  );
}

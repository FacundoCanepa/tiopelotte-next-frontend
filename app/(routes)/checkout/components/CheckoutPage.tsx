"use client";

import { useCartStore } from "@/store/cart-store";
import { useUserStore } from "@/store/user-store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import CheckoutProductsList from "./CheckoutProductsList";
import CheckoutResumen from "./CheckoutResumen";
import CheckoutDeliverySelector from "./CheckoutDeliverySelector";
import CheckoutForm from "./CheckoutForm";
import CheckoutSubmitButton from "./CheckoutSubmitButton";
import CheckoutDeliveryMap from "./CheckoutDeliveryMap";
import { zonas } from "@/app/(routes)/ubicacion/components/zonas";

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const user = useUserStore((state) => state.user);

  const [tipoEntrega, setTipoEntrega] = useState<"domicilio" | "local">("domicilio");
  const [nombre, setNombre] = useState(user?.username || "");
  const [telefono, setTelefono] = useState(user?.telefono || "");
  const [zona, setZona] = useState(user?.zona || "");
  const [direccion, setDireccion] = useState(user?.direccion || "");
  const [referencias, setReferencias] = useState(user?.referencias || "");

  useEffect(() => {
    if (!user) return;
    setNombre(user.username ?? "");
    setTelefono(user.telefono ?? "");
    setZona(user.zona ?? "");
    setDireccion(user.direccion ?? "");
    setReferencias(user.referencias ?? "");
  }, [user]);

  const zonaSeleccionada =
    tipoEntrega === "domicilio" ? zonas.find((z) => z.nombre === zona) : null;
  const costoEnvio = zonaSeleccionada
    ? parseInt(zonaSeleccionada.precio.replace(/[$.]/g, ""))
    : 0;
  const totalProductos = getTotalPrice();
  const totalGeneral = totalProductos + costoEnvio;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    router.push("/perfil");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-20 px-6 text-center text-[#8B4513]">
        <h2 className="text-3xl font-garamond italic">Tu carrito está vacío 🧺</h2>
        <Button
          onClick={() => router.push("/productos")}
          className="mt-6 bg-[#FFD966] hover:bg-[#e6c753] text-[#5A3E1B]"
        >
          Ver productos
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 md:px-12 space-y-8">
      <h1 className="text-4xl font-garamond text-[#5A3E1B] text-center">
        Confirmá tu pedido
      </h1>

      <CheckoutProductsList />

      <CheckoutResumen
        subtotal={totalProductos}
        envio={costoEnvio}
        total={totalGeneral}
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow-lg rounded-xl p-6 border border-[#E0E0E0]"
      >
        <div>
          <label className="block text-sm font-semibold text-[#5A3E1B] mb-1">
            Nombre y Apellido
          </label>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#5A3E1B] mb-1">
            Teléfono
          </label>
          <input
            type="tel"
            required
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        <CheckoutDeliverySelector
          tipoEntrega={tipoEntrega}
          setTipoEntrega={setTipoEntrega}
        />

        {tipoEntrega === "domicilio" ? (
          <CheckoutDeliveryMap
            tipoEntrega={tipoEntrega}
            zona={zona}
            setZona={setZona}
            direccion={direccion}
            setDireccion={setDireccion}
            referencias={referencias}
            setReferencias={setReferencias}
          />
        ) : (
          <CheckoutForm
            tipoEntrega={tipoEntrega}
            zona={zona}
            setZona={setZona}
            direccion={direccion}
            setDireccion={setDireccion}
            referencias={referencias}
            setReferencias={setReferencias}
          />
        )}

        <CheckoutSubmitButton />
      </form>
    </div>
  );
}

"use client";

import { useCartStore } from "@/store/cart-store";
import { useUserStore } from "@/store/user-store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone } from "lucide-react";

import CheckoutProductsList from "./CheckoutProductsList";
import CheckoutResumen from "./CheckoutResumen";
import CheckoutDeliverySelector from "./CheckoutDeliverySelector";
import CheckoutForm from "./CheckoutForm";
import CheckoutSubmitButton from "./CheckoutSubmitButton";
import CheckoutDeliveryMap from "./CheckoutDeliveryMap";
import CheckoutPaymentMethod from "./CheckoutPaymentMethod";
import MercadoPagoButton from "./MercadoPagoButton";
import { zonas } from "@/app/(routes)/ubicacion/components/zonas";

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const user = useUserStore((state) => state.user);

  const [tipoEntrega, setTipoEntrega] = useState<"domicilio" | "local">("domicilio");
  const [metodoPago, setMetodoPago] = useState<"mercado_pago" | "efectivo">("mercado_pago");

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

    const porcentajeSenia =
      tipoEntrega === "domicilio" && metodoPago === "efectivo" ? 0.1 : 1;
    const montoFinal = Math.round(totalGeneral * porcentajeSenia);
    clearCart();
    router.push("/perfil");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-20 px-6 text-center text-[#8B4513]">
        <h2 className="text-3xl font-garamond italic">Tu carrito está vacío 🧺</h2>
        <button
          onClick={() => router.push("/productos")}
          className="mt-6 bg-[#FFD966] hover:bg-[#e6c753] text-[#5A3E1B] px-4 py-2 rounded-md"
        >
          Ver productos
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBE6D4] py-12 px-4 md:px-16 space-y-10">
      <h1 className="text-4xl font-garamond text-[#5A3E1B] text-center mb-4">
        Confirmá tu pedido 🍝
      </h1>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr,1fr]">
        {/* Columna izquierda */}
        <div className="space-y-6">
          <CheckoutProductsList />
          <CheckoutResumen
            subtotal={totalProductos}
            envio={costoEnvio}
            total={totalGeneral}
            metodoPago={metodoPago}
          />
        </div>

        {/* Columna derecha */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#FFF8EB] rounded-2xl border border-[#E0E0E0] shadow-lg p-6 space-y-6"
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#8B4513]">Tus datos</h2>

            {/* Nombre */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#5A3E1B] flex items-center gap-1">
                <User size={16} /> Nombre y Apellido
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border px-4 py-2 rounded-md text-sm bg-white"
              />
            </div>

            {/* Teléfono */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#5A3E1B] flex items-center gap-1">
                <Phone size={16} /> Teléfono
              </label>
              <input
                type="tel"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full border px-4 py-2 rounded-md text-sm bg-white"
              />
            </div>

            {/* Tipo de entrega */}
            <CheckoutDeliverySelector
              tipoEntrega={tipoEntrega}
              setTipoEntrega={setTipoEntrega}
            />

            {/* Formulario dinámico */}
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

            {/* Método de pago solo si es entrega a domicilio */}
            {tipoEntrega === "domicilio" && (
              <CheckoutPaymentMethod
                metodoPago={metodoPago}
                setMetodoPago={setMetodoPago}
              />
            )}
            {tipoEntrega === "domicilio" && (
              <MercadoPagoButton
                total={
                  metodoPago === "efectivo"
                    ? Math.round(totalGeneral * 0.1)
                    : totalGeneral
                }
              />
            )}

          </div>

           {tipoEntrega === "local" && (
            <CheckoutSubmitButton/>
            )}

        </form>
      </div>
    </div>
  );
}

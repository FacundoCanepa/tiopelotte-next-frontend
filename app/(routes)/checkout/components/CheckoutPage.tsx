"use client";

import { useCartStore } from "@/store/cart-store";
import { useUserStore } from "@/store/user-store";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

const formatQuantity = (qty: number, unidad: string) => {
  const u = unidad?.trim().toLowerCase();
  if (u === "kg") return qty >= 1 ? `${qty} Kg` : `${qty * 1000} gr`;
  if (u === "unidad") return `${qty} Unidad`;
  if (u === "planchas") return `${qty} Planchas`;
  return `${qty}`;
};

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const user = useUserStore((state) => state.user);

  const [nombre, setNombre] = useState(user?.username || "");
  const [telefono, setTelefono] = useState("");
  const [zona, setZona] = useState("");
  const [direccion, setDireccion] = useState("");
  const [referencias, setReferencias] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se podría enviar la orden al backend
    clearCart();
    router.push("/perfil");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-20 px-6 text-center text-[#8B4513]">
        <h2 className="text-3xl font-garamond italic">Tu carrito está vacío 🧺</h2>
        <Button onClick={() => router.push("/productos")}
          className="mt-6 bg-[#FFD966] hover:bg-[#e6c753] text-[#5A3E1B]">
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

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.product.id}
            className="flex justify-between items-center bg-white/40 rounded-xl p-4 border border-[#E0E0E0]"
          >
            <span className="text-[#5A3E1B] font-garamond">
              {item.product.productName}
            </span>
            <span className="text-sm">
              {formatQuantity(item.quantity, item.product.unidadMedida)}
            </span>
            <span className="font-semibold text-[#5A3E1B]">
              ${(item.product.price * item.quantity).toLocaleString("es-AR")}
            </span>
          </div>
        ))}
      </div>

      <p className="text-lg font-semibold text-right text-[#5A3E1B]">
        Total: ${getTotalPrice().toLocaleString("es-AR")}
      </p>

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
        <div>
          <label className="block text-sm font-semibold text-[#5A3E1B] mb-1">
            Zona
          </label>
          <input
            type="text"
            required
            value={zona}
            onChange={(e) => setZona(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#5A3E1B] mb-1">
            Dirección
          </label>
          <input
            type="text"
            required
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#5A3E1B] mb-1">
            Referencias (opcional)
          </label>
          <textarea
            value={referencias}
            onChange={(e) => setReferencias(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-[#FFD966] text-[#5A3E1B] hover:bg-[#f5c741]"
        >
          Confirmar pedido
        </Button>
      </form>
    </div>
  );
}
"use client";

import { useCartStore } from "@/store/cart-store";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const formatQuantity = (qty: number, unidad: string) => {
  const u = unidad?.trim().toLowerCase();
  if (u === "kg") return qty >= 1 ? `${qty} Kg` : `${qty * 1000} gr`;
  if (u === "unidad") return `${qty} Unidad`;
  if (u === "planchas") return `${qty} Planchas`;
  return `${qty}`;
};

export default function CheckoutProductsList() {
  const cart = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const increment = (id: number, qty: number, unidad: string) => {
    const step = unidad === "kg" ? 0.25 : 1;
    updateQuantity(id, Math.round((qty + step) * 100) / 100);
  };

  const decrement = (id: number, qty: number, unidad: string) => {
    const step = unidad === "kg" ? 0.25 : 1;
    const min = step;
    if (qty > min) {
      updateQuantity(id, Math.round((qty - step) * 100) / 100);
    }
  };

  return (
    <div className="space-y-4">
      {cart.map((item) => (
        <Card key={item.product.id} className="bg-[#FFF4E3] rounded-2xl shadow-sm">
          <CardContent className="flex flex-col sm:flex-row items-center gap-4 p-4">
            <Image
              src={item.product.img?.[0]?.url || "/placeholder.jpg"}
              alt={item.product.productName}
              width={80}
              height={80}
              className="rounded-lg object-cover w-20 h-20"
            />
            <div className="flex-1 w-full">
              <h3 className="font-garamond text-lg text-[#8B4513]">
                {item.product.productName}
              </h3>
              <p className="text-sm text-[#D16A45]">
                ${item.product.price.toLocaleString("es-AR")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => decrement(item.product.id, item.quantity, item.product.unidadMedida)}
                className="bg-[#FFD966] text-[#5A3E1B] px-2 py-1 rounded hover:bg-[#f5c741] cursor-pointer"
              >
                –
              </button>
              <span className="text-sm font-medium w-14 text-center">
                {formatQuantity(item.quantity, item.product.unidadMedida)}
              </span>
              <button
                onClick={() => increment(item.product.id, item.quantity, item.product.unidadMedida)}
                className="bg-[#FFD966] text-[#5A3E1B] px-2 py-1 rounded hover:bg-[#f5c741] cursor-pointer"
              >
                +
              </button>
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="ml-2 text-[#D16A45] hover:text-red-600 cursor-pointer"
                aria-label="Eliminar producto"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="font-semibold text-[#8B4513]">
              ${(item.quantity * item.product.price).toLocaleString("es-AR")}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

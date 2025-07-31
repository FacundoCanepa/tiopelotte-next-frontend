"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { usePathname, useRouter } from "next/navigation";

/**
 * Botón flotante del carrito optimizado
 * Componente cliente para manejo de estado
 */
export default function CartFloatButton() {
  const { cart } = useCartStore();
  const router = useRouter();
  const pathname = usePathname();

  const itemCount = cart.length;

  if (["/cart", "/checkout"].includes(pathname) || itemCount === 0) return null;

  return (
    <button
      onClick={() => router.push("/cart")}
      className="fixed bottom-24 right-5 z-50 p-4 rounded-full bg-white/90 backdrop-blur-sm text-[#8B4513] shadow-xl hover:bg-[#FFD966] transition-all duration-300 ease-out hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer group"
      aria-label="Ir al carrito"
    >
      <div className="relative">
        <ShoppingCart className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" />
        <span className="absolute -top-2 -right-2 bg-[#D16A45] text-white text-xs font-bold px-2 py-0.5 rounded-full cursor-pointer shadow-sm animate-bounce">
          {itemCount}
        </span>
      </div>
    </button>
  );
}
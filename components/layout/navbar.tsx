"use client";

import { useRouter } from "next/navigation";
import { Menu, X, ShoppingCart, UserCog, UserRound } from "lucide-react";
import { useToggleMenu } from "../hook/useMenuToggle";
import MenuList from "./menuList";
import { useUserStore } from "@/store/user-store";
import { useCartStore } from "@/store/cart-store";

export default function Navbar() {
  const router = useRouter();
  const { isOpen, toggleMenu, closeMenu } = useToggleMenu();

  const user = useUserStore((state) => state.user);
  const cartCount = useCartStore((state) =>
    state.cart.reduce((acc, item) => acc + item.quantity, 0)
  );

  return (
    <header className="sticky top-0 left-0 w-full flex items-center justify-between py-3 md:py-0 md:px-5 shadow-md z-50 navbar-secondary bg-white/90 backdrop-blur-sm">
      {/* Logo */}
      <div className="hidden md:flex size-[6vw]">
        <img src="/favicon.ico" alt="Tio Pelotte Icon" />
      </div>

      {/* Título */}
      <div className="flex flex-col items-start space-y-2">
        <span
          className="text-[9vw] md:text-[2.8vw] md:tracking-widest md:font-semibold font-island cursor-pointer"
          onClick={() => router.push("/")}
        >
          Las pastas de tu pueblo
        </span>
      </div>

      {/* Íconos a la derecha */}
      <div className="flex items-center space-x-4 md:space-x-8">
        {/* Menú hamburguesa */}
        <button onClick={toggleMenu} className="cursor-pointer">
          {isOpen ? (
            <X className="w-[7vw] h-[7vw] md:w-[2vw] md:h-[2vw]" />
          ) : (
            <Menu className="w-[7vw] h-[7vw] md:w-[2vw] md:h-[2vw]" />
          )}
        </button>

        {/* Carrito */}
        <div className="relative cursor-pointer" onClick={() => router.push("/cart")}>
          <ShoppingCart className="w-[7vw] h-[7vw] md:w-[2vw] md:h-[2vw]" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-1.5 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </div>

        {/* Usuario */}

{user ? (
<div
  onClick={() => router.push("/perfil")}
  className="w-[8vw] h-[8vw] md:w-[2.5vw] md:h-[2.5vw] bg-[#0000007c] rounded-full flex items-center justify-center cursor-pointer text-white font-semibold text-[3vw] md:text-[0.9vw] hover:opacity-90 transition"
  title="Perfil"
>
  {user.username?.split(" ").length > 1
    ? user.username
        .split(" ")
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join("")
    : user.username?.charAt(0).toUpperCase()}
</div>

) : (
  <UserRound
    className="w-[7vw] h-[7vw] md:w-[2vw] md:h-[2vw] cursor-pointer"
    onClick={() => router.push("/login")}
  />
)}


      </div>

      {/* Menú desplegable */}
      <MenuList isOpen={isOpen} closeMenu={closeMenu} />
    </header>
  );
}

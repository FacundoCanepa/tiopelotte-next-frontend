"use client";

import { useRouter, usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, UserRound, LogOut } from "lucide-react";
import { useToggleMenu } from "../hook/useMenuToggle";
import MenuList from "./menuList";
import { useUserStore } from "@/store/user-store";
import { useCartStore } from "@/store/cart-store";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, toggleMenu, closeMenu } = useToggleMenu();

  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const cartCount = useCartStore((state) =>
    state.cart.reduce((acc, item) => acc + item.quantity, 0)
  );

  return (
    <header className="sticky top-0 left-0 w-full flex items-center justify-between py-3 md:py-0 md:pl-5 md:pr-5 shadow-md z-50 navbar-secondary bg-white/90 backdrop-blur-sm">
      <div className="hidden md:flex size-[6vw]">
        <img src="/favicon.ico" alt="Tio Pelotte Icon" />
      </div>

      <div className="flex flex-col items-start space-y-2">
        <span
          className="text-[10vw] md:text-[3vw] md:tracking-widest md:font-semibold font-island cursor-pointer"
          onClick={() => router.push("/")}
        >
          Las pastas de tu pueblo
        </span>
      </div>

      <div className="flex items-center space-x-3 md:space-x-10 md:pr-5">
        <button className="cursor-pointer" onClick={toggleMenu}>
          {isOpen ? (
            <X className="w-[7vw] h-[7vw] md:w-[2vw] md:h-[2vw]" />
          ) : (
            <Menu className="w-[7vw] h-[7vw] md:w-[2vw] md:h-[2vw]" />
          )}
        </button>

        {/* 🛒 Icono carrito con contador */}
        <div className="relative cursor-pointer" onClick={() => router.push("/cart")}>
          <ShoppingCart className="w-[7vw] h-[7vw] md:w-[2vw] md:h-[2vw]" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#D16A45] text-white text-xs px-1.5 py-0.5 rounded-full cursor-pointer">
              {cartCount}
            </span>
          )}
        </div>

        {/* 👤 Usuario logueado o login */}
        {user ? (
          <div className="flex items-center gap-2 text-[#8B4513]">
            <span className="text-sm font-medium hidden md:inline">¡Hola, {user.username}!</span>
            <LogOut
              className="w-[6vw] h-[6vw] md:w-[2vw] md:h-[2vw] cursor-pointer"
              onClick={() => {
                logout();
                router.push("/");
              }}
            />
          </div>
        ) : (
          <UserRound
            className="w-[7vw] h-[7vw] md:w-[2vw] md:h-[2vw] cursor-pointer"
            onClick={() => router.push("/login")}
          />
        )}
      </div>

      {/* Menú animado */}
      <MenuList isOpen={isOpen} closeMenu={closeMenu} />
    </header>
  );
}

"use client";
import { Menu, X, ShoppingCart, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToggleMenu } from "../hook/useMenuToggle";
import MenuList from "./menuList";

export default function Navbar() {
  const router = useRouter();
  const { isOpen, toggleMenu, closeMenu } = useToggleMenu();

  return (
    <header className="w-full flex items-center justify-between py-3 md:py-0 md:pl-5 md:pr-5 shadow-md relative z-50 navbar-secondary">
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
        <ShoppingCart
          className="w-[7vw] h-[7vw] md:w-[2vw] md:h-[2vw] cursor-pointer"
          onClick={() => router.push("/carrito")}
        />
        <UserRound
          className="w-[7vw] h-[7vw] md:w-[2vw] md:h-[2vw] cursor-pointer"
          onClick={() => router.push("/login")}
        />
      </div>

      {/* Menú animado */}
      <MenuList isOpen={isOpen} closeMenu={closeMenu} />
    </header>
  );
}

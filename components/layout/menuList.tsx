"use client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  MapPin,
  ShoppingBag,
  Percent,
  ScrollText,
} from "lucide-react";

interface MenuListProps {
  isOpen: boolean;
  closeMenu: () => void;
}

const links = [
  { text: "Inicio", href: "/", icon: Home },
  { text: "Productos", href: "/products", icon: ShoppingBag },
  { text: "Ubicación", href: "/ubicacion", icon: MapPin },
  { text: "Ofertas", href: "/ofertas", icon: Percent },
  { text: "Nuestra historia", href: "/historia", icon: ScrollText },
];

const menuVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } },
};

const MenuList = ({ isOpen, closeMenu }: MenuListProps) => {
  const router = useRouter();

  const handleClick = (href: string) => {
    router.push(href);
    closeMenu();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.nav
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={menuVariants}
          className="absolute top-full left-0 w-full bg-[#FFD28C]/90 backdrop-blur-md z-30 py-6 shadow-md rounded-b-3xl md:left-1/2 md:-translate-x-1/2 md:w-[50vw]"
        >
          <ul className="flex flex-col items-start font-garamond text-[4.5vw] sm:text-base md:text-lg text-stone-800 px-6 gap-4 lg:justify-center">

            {links.map(({ text, href, icon: Icon }) => (
              <li
                key={text}
                onClick={() => handleClick(href)}
                className="flex items-center w-full gap-4 py-2 border-b border-black/30 last:border-none cursor-pointer hover:underline hover:text-yellow-900 transition-all"
              >
                <Icon size={20} className="text-yellow-800 shrink-0" />
                <span className="select-none">{text}</span>
              </li>

            ))}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default MenuList;

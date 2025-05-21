"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProductType } from "@/types/product";

interface Props {
  product: ProductType;
}

const DessertProductCard = ({ product }: Props) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const handleImageClick = () => {
    if (window.innerWidth < 768) {
      setExpanded(!expanded);
    }
  };

  return (
    <Card className="relative w-full h-full bg-transparent border-none overflow-hidden rounded-xl shadow-md transition-all duration-300">
      {/* Fondo translúcido */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-2xl z-0 rounded-xl" />

      <CardContent className="relative z-10 flex flex-col items-center text-center gap-4 p-3 md:p-4 h-full">
        {/* Imagen con expansión en mobile */}
        <div
          className={`relative w-full overflow-hidden rounded-xl shadow-lg cursor-pointer transition-all duration-300
            h-[15rem] md:h-[17rem]
            ${expanded ? "h-[22rem]" : ""}
            md:cursor-default md:transition-none`}
          onClick={handleImageClick}
        >
          <img
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.img?.[0]?.url}`}
            alt={product.productName}
            className="w-full h-full object-cover rounded-xl transition-all duration-300"
          />
          {/* Ícono de zoom solo en mobile */}
          <div className="absolute top-2 right-2 md:hidden">
            {expanded ? (
              <ZoomOut className="w-6 h-6 text-white drop-shadow" strokeWidth={2.2} />
            ) : (
              <ZoomIn className="w-6 h-6 text-white drop-shadow" strokeWidth={2.2} />
            )}
          </div>
        </div>

        <h1 className="text-lg md:text-xl font-semibold font-garamond mb-2 lowercase line-clamp-1 text-black">
          {product.productName}
        </h1>
        <span className="text-sm md:text-base text-black font-garamond line-clamp-3">
          {product.descriptionCorta}
        </span>

        <button
          className="bg-white/60 hover:bg-[#FFD966] text-black py-2 px-6 rounded-full shadow-md transition-all duration-300 mt-auto cursor-pointer font-semibold text-sm md:text-base hover:scale-105"
          onClick={() => router.push(`/productos/${product.slug}`)}
        >
          VER MÁS
        </button>
      </CardContent>
    </Card>
  );
};

export default DessertProductCard;

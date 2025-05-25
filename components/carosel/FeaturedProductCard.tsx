"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProductType } from "@/types/product";
import Button from "@/components/ui/Button";

interface Props {
  product: ProductType;
}

const FeaturedProductCard = ({ product }: Props) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const handleImageClick = () => {
    if (window.innerWidth < 768) {
      setExpanded(!expanded);
    }
  };

  return (
<Card className="relative w-full min-h-[520px] mb-6 bg-gradient-to-b from-[#F3C4A5] via-[#F5D3B0] to-[#F9E3C8] border-none overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.015] ease-in-out">


      <CardContent className="relative z-10 flex flex-col items-center text-center gap-3 p-3 md:p-4 h-full">
        {/* Imagen */}
        <div
          className={`relative w-full overflow-hidden rounded-xl shadow-md cursor-pointer transition-all duration-300
            h-[15rem] md:h-[17rem]
            ${expanded ? "h-[22rem]" : ""}
            md:cursor-default md:transition-none group`}
          onClick={handleImageClick}
        >
          <img
            src={`${product.img?.[0]?.url}`}
            alt={product.productName}
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:-translate-y-1 hidden lg:block"
          />
          <img
            src={`${product.img?.[0]?.url}`}
            alt={product.productName}
            className="w-full h-full object-cover object-center lg:hidden"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden lg:block" />

          <div className="absolute top-2 right-2 md:hidden">
            {expanded ? (
              <ZoomOut className="w-6 h-6 text-white drop-shadow" strokeWidth={2.2} />
            ) : (
              <ZoomIn className="w-6 h-6 text-white drop-shadow" strokeWidth={2.2} />
            )}
          </div>
        </div>
<h1 className="font-garamond italic text-xl md:text-2xl tracking-wide text-black line-clamp-1">
  {product.productName}
</h1>
<p className="text-stone-600 italic font-garamond text-sm md:text-base mt-1 line-clamp-3">
  {product.descriptionCorta}
</p>




<Button
  onClick={() => router.push(`/productos/${product.slug}`)}
  className="uppercase tracking-wide font-poppins mt-2 bg-white/50  text-black hover:bg-[#6B8E23]"
>
  VER MÁS
</Button>
      </CardContent>
    </Card>
  );
};

export default FeaturedProductCard;

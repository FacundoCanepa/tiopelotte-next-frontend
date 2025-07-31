"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProductType } from "@/types/product";
import { InteractiveButton } from "@/components/ui/animations/MicroInteractions";
import { useCartStore } from "@/store/cart-store";
import OptimizedImage from "@/components/ui/OptimizedImage";

interface Props {
  product: ProductType;
}

const FeaturedProductCard = ({ product }: Props) => {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const [expanded, setExpanded] = useState(false);

  const unidad = product.unidadMedida?.trim().toLowerCase() || "";
  const isByWeight = unidad === "kg";
  const step = isByWeight ? 0.25 : 1;
  const min = isByWeight ? 0.25 : 1;
  const [quantity, setQuantity] = useState<number>(min);

  const toFixedStep = (val: number) => Math.round(val * 100) / 100;
  const increment = () => setQuantity((prev) => toFixedStep(prev + step));
  const decrement = () =>
    setQuantity((prev) => (prev > min ? toFixedStep(prev - step) : prev));

  const formatQuantity = (qty: number) => {
    if (unidad === "kg") return qty >= 1 ? `${qty} Kg` : `${qty * 1000} gr`;
    if (unidad === "unidad") return `${qty} Unidad`;
    if (unidad === "planchas") return `${qty} Planchas`;
    return `${qty}`;
  };

  return (
    <Card className="relative w-full min-h-[560px] bg-gradient-to-b from-[#F3C4A5] via-[#F5D3B0] to-[#F9E3C8] border-none overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.015] ease-in-out">
      <CardContent className="relative z-10 flex flex-col items-center text-center gap-3 p-4 md:p-5 h-full">
        {/* Imagen */}
        <div
          className={`relative w-full overflow-hidden rounded-xl shadow-md transition-all duration-300 cursor-pointer
            h-[15rem] md:h-[17rem] ${expanded ? "h-[22rem]" : ""}
            group`}
          onClick={() => {
            if (window.innerWidth < 768) setExpanded(!expanded);
          }}
        >
          <OptimizedImage
            src={product.img?.[0]?.url || "/placeholder.jpg"}
            alt={product.productName}
            fill
            className="object-cover object-center"
            priority={false}
            sizes="(max-width: 768px) 100vw, 300px"
          />
          {expanded && (
            <div className="absolute top-2 right-2 md:hidden">
              <ZoomOut className="w-6 h-6 text-white drop-shadow" strokeWidth={2.2} />
            </div>
          )}
          {!expanded && (
            <div className="absolute top-2 right-2 md:hidden">
              <ZoomIn className="w-6 h-6 text-white drop-shadow" strokeWidth={2.2} />
            </div>
          )}
        </div>

        {/* Nombre */}
        <h1 className="font-garamond italic text-xl md:text-2xl tracking-wide text-black line-clamp-1">
          {product.productName}
        </h1>

        {/* Descripción */}
        <p className="text-stone-600 italic font-garamond text-sm md:text-base mt-1 line-clamp-3">
          {product.descriptionCorta}
        </p>

        {/* Precio */}
        <span className="text-[#D16A45] font-semibold text-base">
          ${product.price.toLocaleString("es-AR")}
          {unidad && <span className="text-sm text-stone-500"> /{unidad}</span>}
        </span>

        {/* Cantidad */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={decrement}
            className="cursor-pointer px-2 py-1 rounded bg-[#FFD966] text-[#8B4513] font-bold hover:bg-[#f5c741]"
          >
            –
          </button>
          <span className="text-sm font-medium w-20 text-center">
            {formatQuantity(quantity)}
          </span>
          <button
            onClick={increment}
            className="cursor-pointer px-2 py-1 rounded bg-[#FFD966] text-[#8B4513] font-bold hover:bg-[#f5c741]"
          >
            +
          </button>
        </div>

        {/* Botones */}
        <InteractiveButton
          onClick={() => addToCart(product, quantity)}
          variant="secondary"
          className="mt-2"
        >
          Añadir al carrito
        </InteractiveButton>
        <InteractiveButton
          onClick={() => router.push(`/productos/${product.slug}`)}
          variant="outline"
          className="mt-1"
        >
          Ver más
        </InteractiveButton>
      </CardContent>
    </Card>
  );
};

export default FeaturedProductCard;

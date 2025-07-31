"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, Eye, Minus, Plus } from "lucide-react";
import { ProductType } from "@/types/product";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";

interface Props {
  product: ProductType;
}

export default function ProductCard({ product }: Props) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      addToCart(product, quantity);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => setQuantity(prev => Math.max(1, prev - 1));

  const imageUrl = product.img?.[0]?.url || '/placeholder.jpg';
  const fullImageUrl = imageUrl.startsWith('/') 
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${imageUrl}`
    : imageUrl;

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-[#E6D2B5]">
      {/* Imagen del producto */}
      <div className="relative aspect-square overflow-hidden">
        {product.isOffer && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            OFERTA
          </div>
        )}
        
        <Image
          src={fullImageUrl}
          alt={product.productName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        
        {/* Overlay con acciones */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={() => router.push(`/productos/${product.slug}`)}
            className="bg-white/90 hover:bg-white text-[#8B4513] p-2 rounded-full shadow-lg transition-all"
          >
            <Eye size={20} />
          </button>
        </div>
      </div>

      {/* Información del producto */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-garamond text-lg font-semibold text-[#8B4513] line-clamp-1">
            {product.productName}
          </h3>
          <p className="text-sm text-stone-600 line-clamp-2 mt-1">
            {product.descriptionCorta || product.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-[#D16A45]">
            ${product.price.toLocaleString('es-AR')}
          </div>
          <div className="text-xs text-stone-500">
            por {product.unidadMedida}
          </div>
        </div>

        {/* Selector de cantidad */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={decrement}
              className="w-8 h-8 rounded-full bg-[#FFD966] hover:bg-[#F5C741] text-[#8B4513] flex items-center justify-center transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <button
              onClick={increment}
              className="w-8 h-8 rounded-full bg-[#FFD966] hover:bg-[#F5C741] text-[#8B4513] flex items-center justify-center transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all",
              isAddingToCart
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#8B4513] hover:bg-[#6B3410] text-white"
            )}
          >
            <ShoppingCart size={16} />
            {isAddingToCart ? "Agregando..." : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
}
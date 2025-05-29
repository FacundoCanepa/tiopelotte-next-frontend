"use client";

import { ShoppingCart, Info, Package } from "lucide-react";
import { ProductType } from "@/types/product";

interface Props {
  product: ProductType;
}

const ProductInfo = ({ product }: Props) => {
  const unidad = product.unidadMedida?.trim().toLowerCase();

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-garamond font-bold text-[#8B4513] leading-tight">
        {product.productName}
      </h1>

      <div className="text-stone-700 text-lg leading-relaxed">
        <p>{product.description}</p>
        <div className="flex items-center gap-2 text-sm text-stone-500 mt-2">
          <Info className="w-4 h-4" />
          <span>Producto artesanal, hecho con ingredientes frescos.</span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-base text-[#6B8E23] font-medium">
        <Package className="w-5 h-5" />
        <span>Presentación: por {unidad}</span>
      </div>

      <div className="text-3xl font-bold text-[#D16A45]">
        ${product.price.toFixed(2)}
        <span className="text-base font-normal text-stone-500 ml-1">/ {unidad}</span>
      </div>

      <button className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-[#D16A45] hover:bg-[#b45733] text-white text-base font-semibold rounded-xl shadow transition-transform hover:scale-105">
        <ShoppingCart className="w-5 h-5" />
        Agregar al carrito
      </button>
    </div>
  );
};

export default ProductInfo;

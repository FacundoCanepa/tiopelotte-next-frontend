"use client";

import { ProductType } from "@/types/product";
import ProductImageCarousel from "./ProductImageCarousel";
import { ShoppingCart, Timer, ChefHat, Soup, UtensilsCrossed } from "lucide-react";

interface Props {
  product: ProductType;
}

const ProductDetail = ({ product }: Props) => {
  const carouselImages = (product as any)?.img_carousel || product?.img || [];
  const unidad = product.unidadMedida?.trim().toLowerCase();

  return (
    <section className="min-h-screen bg-[#FBE6D4] text-[#8B4513] px-6 md:px-12 py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Carrusel */}
        <div>
          <ProductImageCarousel
            images={carouselImages}
            productName={product.productName}
          />
        </div>

        {/* Información */}
        <div className="flex flex-col justify-center gap-6">
          <h1 className="text-4xl font-garamond font-bold leading-snug">
            {product.productName}
          </h1>

          <div className="text-lg text-stone-700 leading-relaxed">
            <p>{product.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#6B8E23] font-medium text-base">
            <div className="flex items-center gap-2">
              <Soup className="w-5 h-5" />
              <span>Sabor: {product.taste}</span>
            </div>
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5" />
              <span>Unidad: {unidad}</span>
            </div>
            {product?.category?.categoryNames && (
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5" />
                <span>Categoría: {product.category.categoryNames}</span>
              </div>
            )}
            {/* Campos opcionales para futuro */}
            {/*
            <div className="flex items-center gap-2">
              <List className="w-5 h-5" />
              <span>Ingredientes: {product.ingredientes}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Porciones: {product.porciones}</span>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              <span>Tiempo estimado: {product.tiempo}</span>
            </div>
            */}
          </div>

          <div className="text-3xl font-bold text-[#D16A45]">
            ${product.price.toFixed(2)}
            <span className="text-base font-normal text-stone-500 ml-1">/ {unidad}</span>
          </div>

          <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#D16A45] hover:bg-[#b45733] text-white text-base font-semibold rounded-xl shadow transition-transform hover:scale-105">
            <ShoppingCart className="w-5 h-5" />
            Agregar al carrito
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;

"use client";

import { useOfferProducts } from "@/hooks/useProducts";
import ProductCarousel from "@/components/ui/ProductCarousel";
import { CarouselLoading } from "@/components/ui/LoadingStates";
import { ProductErrorBoundary } from "@/components/ui/ErrorBoundary";

export default function OfferProducts() {
  const { data: products = [], isLoading, error } = useOfferProducts();

  if (error) {
    return null; // No mostrar sección si hay error
  }

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-r from-[#FFF4E3] to-[#FBE6D4]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-garamond italic text-[#8B4513]">
              Ofertas Especiales
            </h2>
            <p className="text-stone-600 mt-2">Aprovechá estos precios únicos</p>
          </div>
          <CarouselLoading />
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <ProductErrorBoundary>
      <section className="py-16 px-4 bg-gradient-to-r from-[#FFF4E3] to-[#FBE6D4]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-garamond italic text-[#8B4513]">
              Ofertas Especiales
            </h2>
            <p className="text-stone-600 mt-2">Aprovechá estos precios únicos</p>
          </div>
          
          <ProductCarousel products={products} />
        </div>
      </section>
    </ProductErrorBoundary>
  );
}
"use client";

import { useFeaturedProducts } from "@/hooks/useProducts";
import ProductCarousel from "@/components/ui/ProductCarousel";
import { CarouselLoading } from "@/components/ui/LoadingStates";
import { ProductErrorBoundary } from "@/components/ui/ErrorBoundary";

export default function FeaturedProducts() {
  const { data: products = [], isLoading, error } = useFeaturedProducts();

  if (error) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-600">Error al cargar productos destacados</p>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-garamond italic text-[#8B4513]">
              Nuestros Destacados
            </h2>
            <p className="text-stone-600 mt-2">Pastas que enamoran</p>
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
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-garamond italic text-[#8B4513]">
              Nuestros Destacados
            </h2>
            <p className="text-stone-600 mt-2">Pastas que enamoran</p>
          </div>
          
          <ProductCarousel products={products} />
        </div>
      </section>
    </ProductErrorBoundary>
  );
}
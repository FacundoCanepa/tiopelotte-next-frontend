"use client";

import { useGetSimilarProducts } from "@/components/hook/useSimilarProducts";
import { ProductType } from "@/types/product";
import SimilarProductCard from "./SimilarProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Sparkles } from "lucide-react";

interface Props {
  product: ProductType;
}

const SimilarProductsCarousel = ({ product }: Props) => {
  const categorySlug = product?.category?.slug ?? "";
  const productId = product?.id;

  const { similarProducts, loading, error } = useGetSimilarProducts({
    categorySlug,
    excludeProductId: productId,
  });

  if (loading) return <p className="text-center text-[#8B4513]">Cargando productos similares...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;
  if (!similarProducts?.length) return <p className="text-center text-[#8B4513]">No hay productos similares.</p>;

  return (
    <section className="bg-[#FBE6D4] py-14 px-4">
      <div className="flex items-center justify-center mb-8 gap-2">
        <Sparkles className="w-6 h-6 text-[#D16A45]" />
        <h2 className="text-3xl sm:text-4xl font-garamond italic text-[#D16A45]">
          También te pueden gustar
        </h2>
        <Sparkles className="w-6 h-6 text-[#D16A45]" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <Carousel
          opts={{
            align: "start",
            slidesToScroll: 1,
            loop: true,
            containScroll: "trimSnaps",
          }}
          plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
        >
          <CarouselContent className="gap-4">
            {similarProducts.map((product) => (
              <CarouselItem
                key={product.id}
                className="px-2 w-[95%] sm:w-1/2 md:w-1/3 lg:w-1/4"
              >
                <SimilarProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="hidden lg:flex -left-6" />
          <CarouselNext className="hidden lg:flex -right-6" />
        </Carousel>
      </div>
    </section>
  );
};

export default SimilarProductsCarousel;

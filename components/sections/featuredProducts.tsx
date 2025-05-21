"use client";

import { useGetFeaturedProducts } from "@/api/useGetFeaturedProducts";
import { ResponseType } from "@/types/response";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import SkeletonSchema from "../ui/skeletonSchema";
import { ProductType } from "@/types/product";
import AnimatedSection from "../ui/AnimatedWrapper";
import FeaturedProductCard from "../carosel/FeaturedProductCard";

const FeaturedProducts = () => {
  const { error, loading, result }: ResponseType = useGetFeaturedProducts();

  // Clase dinámica para justificar los ítems dependiendo de la cantidad
  const justifyClass =
    result && result.length <= 4 ? "justify-around" : "justify-start";

  return (
    <AnimatedSection>
      <div className="max-w-5xl md:max-w-full py-4 mx-auto sm:py-8 sm:px-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-10 pb-4">
          <div className="text-center">
<h3 className="font-garamond text-[4vh] md:text-[6vh] italic tracking-wide">
Sabores que brillan
</h3>
<p className="text-stone-600 italic font-garamond text-lg mt-1">
 Favoritos del público, con el sello del Tío.
</p>
<div className="inline-block mt-3 bg-[#FFD966] text-[#8B4513] font-semibold px-4 py-1 rounded-full shadow-sm text-sm sm:text-base md:text-lg uppercase tracking-wide">
  ¡Delicias garantizadas!
</div>


          </div>
        </div>

        <Carousel className="mt-4 xl:mx-40">
          <CarouselContent
            className={`ml-0 flex ${justifyClass} gap-4 overflow-visible`}
          >
            {loading && <SkeletonSchema grid={4} />}
            {result !== null &&
              result.map((product: ProductType) => (
                <CarouselItem
                  key={product.id}
                  className="flex-shrink-0 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 p-2"
                >
                  <FeaturedProductCard product={product} />
                </CarouselItem>
              ))}
          </CarouselContent>

          <CarouselPrevious className="hidden md:flex cursor-pointer" />
          <CarouselNext className="hidden md:flex cursor-pointer" />
        </Carousel>
      </div>
    </AnimatedSection>
  );
};

export default FeaturedProducts;

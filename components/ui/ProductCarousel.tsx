"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { ProductType } from "@/types/product";
import FeaturedProductCard from "../carousel/FeaturedProductCard";

interface Props {
  products: ProductType[];
}

const ProductCarousel = ({ products }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      slidesToScroll: 1,
      containScroll: "trimSnaps",
      dragFree: false,
      loop: false,
    },
    []
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    if (products && products.length > 4) {
      setShowButtons(true);
    }
  }, [products.length]);

  return (
    <div className="relative px-2 sm:px-4 md:px-8">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {products && products.map((product) => (
            <div
              key={product.id}
              className="
                shrink-0 
                w-full 
                sm:w-1/2 
                md:w-1/3 
                lg:w-1/4 
                px-2
              "
            >
              <FeaturedProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Botones: solo visibles si hay más de 4 productos y en desktop */}
      {showButtons && (
        <>
          <button
            onClick={scrollPrev}
            aria-label="Anterior"
            className="cursor-pointer hidden lg:flex absolute left-[-3rem] top-1/2 -translate-y-1/2 z-30 bg-white p-2 rounded-full shadow hover:bg-[#6B8E23] hover:text-white transition"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={scrollNext}
            aria-label="Siguiente"
            className="cursor-pointer hidden lg:flex absolute right-[-3rem] top-1/2 -translate-y-1/2 z-30 bg-white p-2 rounded-full shadow hover:bg-[#6B8E23] hover:text-white transition"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
};

export default ProductCarousel;
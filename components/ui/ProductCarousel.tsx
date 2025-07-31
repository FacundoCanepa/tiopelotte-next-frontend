"use client";

import { useEffect, useState } from "react";
import { ProductType } from "@/types/product";
import ProductCard from "@/app/(routes)/productos/components/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  products: ProductType[];
}

export default function ProductCarousel({ products }: Props) {
  const [emblaRef, setEmblaRef] = useState<any>(null);
  const [emblaApi, setEmblaApi] = useState<any>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const loadEmbla = async () => {
      try {
        if (typeof window === 'undefined') return;

        const useEmblaCarousel = (await import("embla-carousel-react")).default;
        const [emblaRefResult, emblaApiResult] = useEmblaCarousel({
          align: "start",
          slidesToScroll: 1,
          containScroll: "trimSnaps",
          dragFree: false,
          loop: false,
        });
        
        setEmblaRef(emblaRefResult);
        setEmblaApi(emblaApiResult);
      } catch (error) {
        console.error("Error cargando Embla Carousel:", error);
      }
    };

    loadEmbla();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const updateButtons = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on("select", updateButtons);
    emblaApi.on("reInit", updateButtons);
    updateButtons();

    return () => {
      emblaApi.off("select", updateButtons);
      emblaApi.off("reInit", updateButtons);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  // Fallback grid si no hay carousel
  if (!isClient || !emblaRef) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] px-3"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Botones de navegación */}
      {products.length > 4 && emblaApi && (
        <>
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductType } from "@/types/product";
import FeaturedProductCard from "../carousel/FeaturedProductCard";

interface Props {
  products: ProductType[];
}

/**
 * Carrusel de productos optimizado para producción
 * Carga Embla Carousel de forma asíncrona
 */
const ProductCarousel = ({ products }: Props) => {
  const [emblaRef, setEmblaRef] = useState<any>(null);
  const [emblaApi, setEmblaApi] = useState<any>(null);
  const [showButtons, setShowButtons] = useState(false);
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
          skipSnaps: false,
        });
        
        setEmblaRef(emblaRefResult);
        setEmblaApi(emblaApiResult);
      } catch (error) {
        console.error("Error cargando Embla Carousel:", error);
      }
    };

    const timeoutId = setTimeout(loadEmbla, 100);
    return () => clearTimeout(timeoutId);
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

  useEffect(() => {
    if (products && products.length > 4) {
      setShowButtons(true);
    }
  }, [products.length]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  // Fallback para cuando no hay Embla cargado
  if (!isClient || !emblaRef) {
    return (
      <div className="px-2 sm:px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products?.slice(0, 4).map((product) => (
            <div key={product.id} className="w-full">
              <FeaturedProductCard product={product} />
            </div>
          ))}
        </div>
        {products?.length > 4 && (
          <p className="text-center text-sm text-[#8B4513] mt-4 italic">
            Cargando carrusel interactivo...
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="relative px-2 sm:px-4 md:px-8">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {products && products.map((product) => (
            <div
              key={product.id}
              className="shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2"
            >
              <FeaturedProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Botones de navegación */}
      {showButtons && emblaApi && (
        <>
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Producto anterior"
            className={`
              hidden lg:flex absolute left-[-3rem] top-1/2 -translate-y-1/2 z-30 
              bg-white p-3 rounded-full shadow-lg transition-all duration-200
              ${canScrollPrev 
                ? 'hover:bg-[#6B8E23] hover:text-white cursor-pointer hover:scale-110' 
                : 'opacity-50 cursor-not-allowed'
              }
            `}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Producto siguiente"
            className={`
              hidden lg:flex absolute right-[-3rem] top-1/2 -translate-y-1/2 z-30 
              bg-white p-3 rounded-full shadow-lg transition-all duration-200
              ${canScrollNext 
                ? 'hover:bg-[#6B8E23] hover:text-white cursor-pointer hover:scale-110' 
                : 'opacity-50 cursor-not-allowed'
              }
            `}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Indicador móvil */}
      <div className="lg:hidden flex justify-center mt-4">
        <p className="text-sm text-[#8B4513] bg-white/60 px-3 py-1 rounded-full">
          👈 Deslizá para ver más productos 👉
        </p>
      </div>
    </div>
  );
};

export default ProductCarousel;
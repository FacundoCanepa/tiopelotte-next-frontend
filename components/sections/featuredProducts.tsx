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
import { useRouter } from "next/navigation";
import FeaturedProductCard from "../carosel/FeaturedProductCard";

const FeaturedProducts = () => {
  const { error, loading, result }: ResponseType = useGetFeaturedProducts();
 const router = useRouter();
  const justifyClass =
    result && result.length <= 4 ? "justify-around" : "justify-start";

  return (
    <AnimatedSection>
      <div className="max-w-6xl md:max-w-full py-4 mx-auto sm:py-8 sm:px-12">
        <div className="max-w-6xl mx-auto md:max-w-full  px-4 sm:px-8 pt-10 pb-4">
          <div className="text-center">
<h3 className="font-garamond text-[4vh] md:text-[6vh] italic tracking-wide">
Sabores que brillan
</h3>
<p className="text-stone-600 italic font-garamond text-lg mt-1">
 Favoritos del público, con el sello del Tío.
</p>
<button
  onClick={() => router.push("/productos")}
  className="mt-4 bg-[#6B8E23] text-white px-4 py-2 rounded-full font-semibold text-sm sm:text-base transition-transform transform duration-300 hover:scale-105 cursor-pointer"
>
  Ver más productos
</button>


          </div>
        </div>

   <Carousel className="mt-4 xl:mx-40">
  <CarouselContent className="ml-0 flex justify-start gap-4 overflow-visible">
    {loading && <SkeletonSchema grid={4} />}
    {result !== null &&
      result.map((product: ProductType) => (
        <CarouselItem
          key={product.id}
          className="flex-shrink-0 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 p-2"
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
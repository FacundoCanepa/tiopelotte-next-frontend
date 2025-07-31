import { Suspense } from "react";
import HeroSection from "@/components/sections/home/HeroSection";
import FeaturedProducts from "@/components/sections/home/FeaturedProducts";
import OfferProducts from "@/components/sections/home/OfferProducts";
import CategoryShowcase from "@/components/sections/home/CategoryShowcase";
import AboutSection from "@/components/sections/home/AboutSection";
import LocationSection from "@/components/sections/home/LocationSection";
import TestimonialsSection from "@/components/sections/home/TestimonialsSection";
import { CarouselLoading } from "@/components/ui/LoadingStates";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      
      <Suspense fallback={<CarouselLoading />}>
        <FeaturedProducts />
      </Suspense>
      
      <Suspense fallback={<CarouselLoading />}>
        <OfferProducts />
      </Suspense>
      
      <CategoryShowcase />
      <AboutSection />
      <LocationSection />
      <TestimonialsSection />
    </>
  );
}
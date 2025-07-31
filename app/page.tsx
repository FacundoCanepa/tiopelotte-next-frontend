"use client";

import CaroseText from "@/components/sections/shared/caroseText";
import ProductCarouselSection from "@/components/sections/home/product-carousel/ProductCarouselSection";
import NuestraHistoria from "@/components/sections/home/nuestraHistoria";
import Ubicacion from "@/components/sections/home/ubicacion";
import CommentsUser from "@/components/sections/home/commentsUsers";
import CategoryHome from "@/components/sections/home/categoryHome";
import RedesSociales from "@/components/sections/home/redesSociales";
import { useGetFeaturedProducts } from "@/components/hooks/useGetFeaturedProducts";
import { useGetOfferProducts } from "@/components/hooks/useGetOfertProducts";
import { useGetDessertProducts } from "@/components/hooks/useGetDessertProducts";

export default function Home() {
  const featuredProducts = useGetFeaturedProducts();
  const offerProducts = useGetOfferProducts();
  const dessertProducts = useGetDessertProducts();

  return (
    <>
      <CaroseText />
      
      <ProductCarouselSection
        title="Nuestros recomendados"
        subtitle="Pastas que enamoran"
        products={featuredProducts}
      />
      
      <ProductCarouselSection
        title="Dulzura artesanal"
        subtitle="Los más tentadores"
        products={dessertProducts}
      />
      
      <ProductCarouselSection
        title="Ofertas semanales"
        subtitle="Aprovechá estas promos"
        products={offerProducts}
      />
      
      <NuestraHistoria />
      <Ubicacion />
      <CommentsUser />
      <CategoryHome />
      <RedesSociales />
    </>
  );
}
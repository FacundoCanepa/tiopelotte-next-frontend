"use client";

import { useGetFeaturedProducts } from "@/components/hook/useGetFeaturedProducts";
import { useGetOfferProducts } from "@/components/hook/useGetOfertProducts";
import { useGetDessertProducts } from "@/components/hook/useGetDessertProducts";

import CaroseText from "@/components/sections/caroseText";
import ProductCarouselSection from "@/components/sections/product-carousel/ProductCarouselSection";
import NuestraHistoria from "@/components/sections/nuestraHistoria";
import Ubicacion from "@/components/sections/ubicacion";
import CommentsUser from "@/components/sections/commentsUsers";
import CategoryHome from "@/components/sections/categoryHome";
import RedesSociales from "@/components/sections/redesSociales";

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

      <NuestraHistoria />

      <ProductCarouselSection
        title="Dulzura artesanal"
        subtitle="Los más tentadores"
        products={dessertProducts}
      />

      <Ubicacion />

      <ProductCarouselSection
        title="Ofertas semanales"
        subtitle="Aprovechá estas promos"
        products={offerProducts}
      />

      <CommentsUser />
      <CategoryHome />
      <RedesSociales />
    </>
  );
}

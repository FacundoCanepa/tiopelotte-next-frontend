"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

import CaroseText from "@/components/sections/shared/caroseText";
import LazySection from "@/components/ui/LazySection";

// Lazy loading de componentes pesados
const ProductCarouselSection = dynamic(
  () => import("@/components/sections/home/product-carousel/ProductCarouselSection"),
  { 
    loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-xl" />,
    ssr: false 
  }
);

const NuestraHistoria = dynamic(
  () => import("@/components/sections/home/nuestraHistoria"),
  { 
    loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-xl" />,
    ssr: false 
  }
);

const Ubicacion = dynamic(
  () => import("@/components/sections/home/ubicacion"),
  { 
    loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-xl" />,
    ssr: false 
  }
);

const CommentsUser = dynamic(
  () => import("@/components/sections/home/commentsUsers"),
  { 
    loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-xl" />,
    ssr: false 
  }
);

const CategoryHome = dynamic(
  () => import("@/components/sections/home/categoryHome"),
  { 
    loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-xl" />,
    ssr: false 
  }
);

const RedesSociales = dynamic(
  () => import("@/components/sections/home/redesSociales"),
  { 
    loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded-xl" />,
    ssr: false 
  }
);

// Hooks lazy
const useGetFeaturedProducts = dynamic(
  () => import("@/components/hooks/useGetFeaturedProducts").then(mod => ({ default: mod.useGetFeaturedProducts })),
  { ssr: false }
);

const useGetOfferProducts = dynamic(
  () => import("@/components/hooks/useGetOfertProducts").then(mod => ({ default: mod.useGetOfferProducts })),
  { ssr: false }
);

const useGetDessertProducts = dynamic(
  () => import("@/components/hooks/useGetDessertProducts").then(mod => ({ default: mod.useGetDessertProducts })),
  { ssr: false }
);

function ProductSections() {
  const { useGetFeaturedProducts } = require("@/components/hooks/useGetFeaturedProducts");
  const { useGetOfferProducts } = require("@/components/hooks/useGetOfertProducts");
  const { useGetDessertProducts } = require("@/components/hooks/useGetDessertProducts");
  
  const featuredProducts = useGetFeaturedProducts();
  const offerProducts = useGetOfferProducts();
  const dessertProducts = useGetDessertProducts();

  return (
    <>
      <LazySection>
        <ProductCarouselSection
          title="Nuestros recomendados"
          subtitle="Pastas que enamoran"
          products={featuredProducts}
        />
      </LazySection>

      <LazySection>
        <ProductCarouselSection
          title="Dulzura artesanal"
          subtitle="Los más tentadores"
          products={dessertProducts}
        />
      </LazySection>

      <LazySection>
        <ProductCarouselSection
          title="Ofertas semanales"
          subtitle="Aprovechá estas promos"
          products={offerProducts}
        />
      </LazySection>
    </>
  );
}

export default function Home() {
  return (
    <>
      <CaroseText />

      <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-xl" />}>
        <ProductSections />
      </Suspense>

      <LazySection>
        <NuestraHistoria />
      </LazySection>

      <LazySection>
        <Ubicacion />
      </LazySection>

      <LazySection>
        <CommentsUser />
      </LazySection>

      <LazySection>
        <CategoryHome />
      </LazySection>

      <LazySection>
        <RedesSociales />
      </LazySection>
    </>
  );
}

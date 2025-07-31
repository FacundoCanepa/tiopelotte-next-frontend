"use client";

import dynamic from "next/dynamic";
const ProductCarousel = dynamic(() => import("@/components/ui/ProductCarousel"));
import SkeletonSchema from "@/components/ui/skeletonSchema";
import { useRouter } from "next/navigation";
import type { ProductType } from "@/types/product";
import Button from "@/components/ui/button";

interface ProductState {
  loading: boolean;
  result: ProductType[] | null;
  error: string;
  refetch?: () => void;
}

interface Props {
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonHref?: string;
  products: ProductState;
}

const ProductCarouselSection = ({
  title,
  subtitle,
  buttonText,
  buttonHref,
  products,
}: Props) => {
  const { loading, result, error, refetch } = products;
  const router = useRouter();

  // Validación para asegurar que result sea un array
  const productList = Array.isArray(result) ? result : [];

  return (
    <div>
      <div className="w-full max-w-[90rem] mx-auto py-12 px-2 sm:px-4 lg:px-6">
        <div className="text-center mb-6">
          <h3 className="font-garamond text-3xl md:text-5xl italic tracking-wide">
            {title}
          </h3>
          <p className="text-stone-600 italic font-garamond text-lg mt-1">
            {subtitle}
          </p>
          {buttonText && buttonHref && (
            <Button className="mt-4" onClick={() => router.push(buttonHref)}>
              {buttonText}
            </Button>
          )}
        </div>

        <div className="mt-4">
          {loading && <SkeletonSchema count={4} />}
          {!loading && error && (
            <div className="text-center space-y-4 py-12">
              <p className="text-stone-500 text-lg">{error}</p>
              {refetch && (
                <button
                  onClick={refetch}
                  className="px-4 py-2 bg-[#FFD966] text-[#8B4513] rounded-lg hover:bg-[#F5C741] transition-all"
                >
                  Intentar nuevamente
                </button>
              )}
            </div>
          )}
          {!loading && !error && productList.length > 0 && (
            <ProductCarousel products={productList} />
          )}
          {!loading && !error && productList.length === 0 && (
            <p className="text-center text-stone-500">No hay productos disponibles en este momento.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCarouselSection;
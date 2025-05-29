"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Image {
  id: number;
  url: string;
  alternativeText?: string;
}

interface Props {
  images: Image[];
  productName: string;
}

const ProductImageCarousel = ({ images, productName }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (isPaused) return;
    timeoutRef.current = setTimeout(next, 5000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, isPaused]);

  const slideStyle = {
    transform: `translateX(-${currentIndex * 100}%)`,
    transition: "transform 0.5s ease-in-out",
  };

  return (
    <div
      className="w-full space-y-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative w-full overflow-hidden rounded-xl shadow-md bg-[#FBE6D4] aspect-[4/3]">
        <div className="flex h-full" style={slideStyle}>
          {images.map((img) => (
            <img
              key={img.id}
              src={img.url}
              alt={img.alternativeText || productName}
              className="w-full h-full flex-shrink-0 object-cover object-center"
            />
          ))}
        </div>

        <button
          onClick={prev}
          className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white/70 backdrop-blur-sm rounded-full p-2 shadow hover:scale-110 transition cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-[#8B4513]" />
        </button>
        <button
          onClick={next}
          className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white/70 backdrop-blur-sm rounded-full p-2 shadow hover:scale-110 transition cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 text-[#8B4513]" />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto overflow-y-hidden">
        {images.map((img, index) => (
          <button
            key={img.id}
            onClick={() => setCurrentIndex(index)}
            className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-transform cursor-pointer hover:scale-105 hover:border-[#D16A45] ${
              currentIndex === index ? "border-[#D16A45]" : "border-transparent"
            }`}
          >
            <img
              src={img.url}
              alt={img.alternativeText || productName}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageCarousel;

"use client";

import { googleReviews } from "@/types/comments";
import { Star } from "lucide-react";
import AnimatedSection from "../ui/AnimatedWrapper";

const CommentsUser = () => {
  return (
    <AnimatedSection className="relative py-16 overflow-hidden">
      {/* Imagen de fondo decorativa */}
      <img
        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/photo_1563599175592_c58dc214deff_72de742650.jpg`}
        className="absolute inset-0 w-full h-full object-cover  -z-20"
        alt="Decoración fondo"
      />

      {/* Capa de color encima de la imagen */}
      <div className="absolute inset-0 bg-[#FBE0C2] opacity-50 -z-10" />

      {/* SVG superior */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-[60px]">
          <path
            d="M0,0 C150,100 350,0 600,80 C850,160 1050,0 1200,80 L1200,0 L0,0 Z"
            fill="#FBE6D4"
          />
        </svg>
      </div>

      {/* Contenido */}
      <section className="max-w-4xl mx-auto px-4 py-10 relative z-10">
        <h2 className="text-center text-3xl font-garamond italic mb-8">
          Opiniones de nuestros clientes
        </h2>

        <div className="space-y-6">
          {googleReviews.map((review, index) => (
            <div
              key={index}
              className="flex items-start gap-4 bg-white/20 p-4 rounded-xl backdrop-blur-sm"
            >
              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${review.avatar}`}
                alt={review.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-black/90"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-stone-700">{review.name}</p>
                  <span className="text-xs text-stone-500">{review.date}</span>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="#facc15" stroke="#facc15" />
                  ))}
                </div>
                <p className="text-sm text-stone-700 font-medium italic">
                  "{review.comment}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SVG inferior invertido */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180 z-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-[60px]">
          <path
            d="M0,0 C150,100 350,0 600,80 C850,160 1050,0 1200,80 L1200,0 L0,0 Z"
            fill="#FBE6D4"
          />
        </svg>
      </div>
    </AnimatedSection>
  );
};

export default CommentsUser;

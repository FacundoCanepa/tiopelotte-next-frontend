// components/sections/historia/HistoriaIntro.tsx
"use client";

import { Heart } from "lucide-react";

const HistoriaIntro = () => {
  return (
    <section className="relative bg-[#FFDBB5] text-[#8B4513] pt-24 pb-40 px-6 overflow-hidden">
      {/* SVG superior */}
      <svg
        className="absolute top-0 left-0 w-full h-24 text-[#FBE6D4]"
        viewBox="0 0 1440 320"
        fill="currentColor"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,32 C240,160 960,-40 1440,128 L1440,0 L0,0 Z" />
      </svg>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-serif font-semibold flex justify-center items-center gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#8B4513]/10">
            <Heart className="w-5 h-5 text-[#8B4513]" />
          </span>
          Nuestra historia
        </h2>
        <p className="text-base md:text-lg leading-relaxed font-sans">
          TÍO PELOTTE nace en el corazón de una familia apasionada por la cocina casera.
          Todo comenzó con una vieja receta de la nona, que fue pasando de generación en
          generación hasta convertirse en tradición.
        </p>
        <p className="text-base md:text-lg leading-relaxed font-sans flex justify-center items-center gap-2">
          Con esfuerzo y mucho amor, transformamos esas recetas familiares en pastas
          frescas hechas a mano
          <Heart className="inline-block w-4 h-4 text-[#8B4513]" />, elaboradas cada día con ingredientes nobles.
        </p>
      </div>

      {/* SVG inferior */}
      <svg
        className="absolute bottom-0 left-0 w-full h-40 text-[#FBE6D4]"
        viewBox="0 0 1440 320"
        fill="currentColor"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,224 C360,320 1080,160 1440,240 L1440,320 L0,320 Z" />
      </svg>
    </section>
  );
};

export default HistoriaIntro;

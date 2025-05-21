"use client";

import AnimatedSection from "../ui/AnimatedWrapper";
import { useRouter } from "next/navigation";

const NuestraHistoria = () => {
  const router = useRouter();
  return (
    <AnimatedSection className="relative py-16 overflow-hidden">
      {/* Imagen de fondo decorativa */}
      <img
        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/premium_photo_1661962560564_220abc8b6bf2_1795602fae.avif`}
        className="absolute inset-0 w-full h-full object-cover -z-20"
        alt="Decoración fondo"
      />

      {/* Capa de color encima de la imagen */}
      <div className="absolute inset-0 bg-[#FBE0C2] opacity-50  -z-10" />

      {/* SVG arriba */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-[80px]">
          <path fill="#FBE6D4" d="M0,100 C480,0 960,100 1440,0 L1440,100 L0,100 Z" />
        </svg>
      </div>

      {/* Contenido */}
      <section className="text-center py-10 px-4 space-y-6 relative z-10 flex justify-around">
        <div className=" rounded-xl  p-5">
          <h2 className="text-center text-3xl font-garamond italic">Nuestra Historia</h2>
          <p className="max-w-xl mx-auto text-sm md:text-base leading-relaxed text-stone-700 font-medium">
            Más de 30 años de tradición nos avalan. <br />
            Desde los primeros ravioles de Doña Rosa hasta nuestras pastas frescas de hoy,
            cada creación está llena de amor y dedicación.
          </p>
        <div className="pt-5">
          <button  onClick={() => router.push(`/historia`)} className=" cursor-pointer navbar-secondary font-garamond text-stone-900 font-semibold py-2 px-6 rounded-full shadow-md border border-amber-300 hover:scale-105 transition-all">
            ver más
          </button>
        </div>
        </div>
      </section>

      {/* SVG abajo */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-[80px]">
          <path fill="#FBE6D4" d="M0,100 C480,0 960,100 1440,0 L1440,100 L0,100 Z" />
        </svg>
      </div>
    </AnimatedSection>
  );
};

export default NuestraHistoria;

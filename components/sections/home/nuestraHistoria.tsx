"use client";

import AnimatedSection from "../../ui/AnimatedWrapper";
import { useRouter } from "next/navigation";
import Button from "../../ui/Button";
import Image from "next/image";

const NuestraHistoria = () => {
  const router = useRouter();

  return (
    <AnimatedSection className="relative py-16 overflow-hidden">
      {/* Imagen de fondo decorativa */}
      <Image
        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/premium_photo_1661962560564_220abc8b6bf2_f9f2261ff0.avif`}
        fill
        className="absolute inset-0 object-cover -z-20"
        alt="Decoración fondo"
      />

      {/* Capa de color encima de la imagen */}
      <div className="absolute inset-0 bg-[#FBE0C2] opacity-50 -z-10" />

      {/* SVG arriba */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-[80px]">
          <path fill="#FBE6D4" d="M0,100 C480,0 960,100 1440,0 L1440,100 L0,100 Z" />
        </svg>
      </div>

      {/* Contenido */}
      <section className="text-center py-10 px-4 space-y-6 relative z-10 flex justify-around">
        <div className="rounded-xl p-5">
          <h2 className="text-center font-garamond italic text-3xl md:text-5xl tracking-wide">
            Nuestra Historia
          </h2>
          <p className="max-w-xl mx-auto text-stone-700 font-garamond italic text-sm md:text-base leading-relaxed">
            Más de 30 años de tradición nos avalan. <br />
            Desde los primeros ravioles de Doña Rosa hasta nuestras pastas frescas de hoy,
            cada creación está llena de amor y dedicación.
          </p>

          <div className="pt-5">
            <Button
              onClick={() => router.push("/historia")}
              variant="secondary"
              size="md"
            >
              ver más
            </Button>
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

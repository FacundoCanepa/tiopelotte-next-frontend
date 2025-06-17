"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";

export const datacaroseltop = [
  {
    id: 1,
    title: "Pastas caseras todos los días",
    description: "Frescas, artesanales y con ingredientes de primera calidad.",
    href: "/productos",
    buttonLabel: "Ver productos",
    img: "/photo_1465911817134_741b5e473a1b_732b198613.avif",
  },
  {
    id: 2,
    title: "Envíos a tu casa",
    description:
      "Realizá tu pedido online y recibilo en Abasto, Olmos, Los Hornos y Etcheverry.",
    href: "/ubicacion",
    buttonLabel: "Ver zonas",
    img: "/photo_1465911817134_741b5e473a1b_732b198613.avif",
  },
  {
    id: 3,
    title: "¡Conocé nuestras ofertas!",
    description:
      "Descubrí los combos y descuentos semanales. Solo en tienda online.",
    href: "/productos?ofertas=true",
    buttonLabel: "Ver descuentos",
    img: "/photo_1465911817134_741b5e473a1b_732b198613.avif",
  },
  {
    id: 4,
    title: "Nuestra historia",
    description: "Desde hace años, llevando el sabor del pueblo a tu mesa.",
    href: "/historia",
    buttonLabel: "Leer historia",
    img: "/photo_1465911817134_741b5e473a1b_732b198613.avif",
  },
];

const CaroseText = () => {
  const router = useRouter();
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: false,
    },
    [autoplay.current]
  );

  return (
    <div
      role="region"
      aria-label="Carrusel de bienvenida"
      className="w-full max-w-[100vw] mx-auto"
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {datacaroseltop.map(({ id, title, description, href, img, buttonLabel }) => (
            <div key={id} className="shrink-0 w-full">
              <div
                className="h-[20vh] md:h-[25vh] bg-cover bg-center relative"
                style={{
                  backgroundImage: `url(${process.env.NEXT_PUBLIC_MEDIA_URL}${img})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
                <div className="relative z-10 h-full w-full flex flex-col items-center justify-end text-center px-4 pt-8 pb-6 text-white">
                  <motion.h2
                    className="text-xl md:text-4xl font-garamond italic tracking-wide mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {title}
                  </motion.h2>
                  <motion.p
                    className="text-sm md:text-lg font-garamond italic mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {description}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <Button
                      onClick={() => router.push(href)}
                      className="bg-white text-[#6B8E23] font-semibold tracking-wide mt-2"
                    >
                      {buttonLabel}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaroseText;

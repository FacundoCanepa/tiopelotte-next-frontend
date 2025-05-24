"use client";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import Autoplay from "embla-carousel-autoplay";

export const datacaroseltop = [
  {
    id: 1,
    title: "Pastas caseras todos los días",
    description: "Frescas, artesanales y con ingredientes de primera calidad.",
    img: "/photo_1465911817134_741b5e473a1b_732b198613.avif",
  },
  {
    id: 2,
    title: "Envíos a tu casa",
    description:
      "Realizá tu pedido online y recibilo en Abasto, Olmos, Los Hornos y Etcheverry.",
    img: "/photo_1465911817134_741b5e473a1b_732b198613.avif",
  },
  {
    id: 3,
    title: "¡Conocé nuestras ofertas!",
    description:
      "Descubrí los combos y descuentos semanales. Solo en tienda online.",
    img: "/photo_1465911817134_741b5e473a1b_732b198613.avif",
  },
  {
    id: 4,
    title: "Nuestra historia",
    description: "Desde hace años, llevando el sabor del pueblo a tu mesa.",
    img: "/photo_1465911817134_741b5e473a1b_732b198613.avif",
  },
];

const CaroseText = () => {
  const router = useRouter();

  return (
    <div>
      <Carousel
        plugins={[Autoplay({ delay: 2500 })]}
        className="w-full max-w-[100vw] mx-auto pointer-events-none"
      >
        <CarouselContent>
          {datacaroseltop.map(({ id, title, img, description }) => (
            <CarouselItem className="cursor-default" key={id}>
              <div>
                <Card
                  className="shadow-none border-none bg-cover bg-center h-[15vh] md:h-[25vh] p-0 rounded-none"
                  style={{
                    backgroundImage: `url(${process.env.NEXT_PUBLIC_MEDIA_URL}${img})`,
                  }}
                >
                  <CardContent className="flex flex-col justify-center items-center text-center h-full text-white bg-black/30">
                    <h2 className="text-lg md:text-6xl font-bold font-garamond italic mb-3">
                      {title}
                    </h2>
                    <p className="text-xs md:text-3xl font-light font-garamond italic mb-3">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default CaroseText;

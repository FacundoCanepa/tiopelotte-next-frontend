"use client";

import AnimatedSection from "../../ui/AnimatedWrapper";
import Button from "../../ui/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Ubicacion = () => {
  const router = useRouter();

  return (
    <AnimatedSection className="relative py-16 overflow-hidden">
      <Image
        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/photo_1723473620176_8d26dc6314cf_803f81fe52.jpg`}
        fill
        className="absolute inset-0 object-cover -z-20"
        alt="Decoración fondo"
      />

      <div className="absolute inset-0 bg-[#FBE0C2] opacity-50 -z-10" />

      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-10">
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="w-full h-[100px]"
        >
          <path
            fill="#FBE6D4"
            fillOpacity="1"
            d="M0,160L48,149.3C96,139,192,117,288,128C384,139,480,181,576,170.7C672,160,768,96,864,90.7C960,85,1056,139,1152,165.3C1248,192,1344,192,1392,192L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>

      <section className="py-10 px-4 relative z-10">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center text-center md:text-left">
          <div className="md:bg-white/20 md:shadow-md md:p-10 md:rounded-lg md:backdrop-blur-sm">
            <h2 className="font-garamond italic text-3xl md:text-5xl tracking-wide mb-3">
              Visítanos
            </h2>

            <p className="text-stone-700 font-garamond italic text-sm md:text-base leading-relaxed mb-6">
              Te esperamos en nuestra tienda para disfrutar de nuestras
              <br className="hidden md:inline" />
              pastas frescas, hechas con tradición y dedicación.
            </p>

            <p className="text-stone-700 font-garamond italic text-sm md:text-base leading-relaxed">
              <strong>Dirección:</strong> Calle 197 y 44, La Plata, Buenos Aires.
              <br />
              <strong>Horarios:</strong>
              <br />
              Martes a Sábados: 8:30 a 13:00 hs y 16:30 a 20:30 hs
              <br />
              Domingos: 8:30 a 13:00 hs
              <br />
              Lunes: cerrado <em>(excepto los días 29)</em>
            </p>

            <Button className="mt-6" onClick={() => router.push("/ubicacion")}>
              Cómo llegar
            </Button>
          </div>

          <div className="flex justify-center md:justify-end">
            <iframe
              title="Ubicación Tío Pelotte"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1943.441186044965!2d-58.04923693284867!3d-34.99505193558028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a2c2ff1e9727d7%3A0x221e187cd7ad3b9d!2sT%C3%ADo%20Pelotte%20(La%20pasta%20de%20mi%20pueblo)!5e0!3m2!1ses!2sar!4v1747165963286!5m2!1ses!2sar"
              width="100%"
              height="300"
              className="rounded-xl shadow-lg max-w-md w-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* SVG abajo */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180 z-10">
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="w-full h-[100px]"
        >
          <path
            fill="#FBE6D4"
            fillOpacity="1"
            d="M0,160L48,149.3C96,139,192,117,288,128C384,139,480,181,576,170.7C672,160,768,96,864,90.7C960,85,1056,139,1152,165.3C1248,192,1344,192,1392,192L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>
    </AnimatedSection>
  );
};

export default Ubicacion;

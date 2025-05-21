import { Facebook, Instagram, MessageCircle } from "lucide-react";

const RedesSociales = () => {
  return (
    <section className="text-center py-10 px-4 space-y-6">
      <h2 className="text-2xl md:text-3xl font-garamond italic tracking-wide">
        Seguinos en redes
      </h2>

      <p className="text-sm md:text-base text-stone-700 font-garamond max-w-md mx-auto">
        Encontranos en nuestras redes sociales y conocé nuestras últimas novedades, recetas y promociones.
      </p>

      <div className="flex justify-center gap-8 mt-4">
        <a
          href="https://wa.me/5492211234567"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:scale-110 transition-transform"
        >
          <MessageCircle className="w-10 h-10 md:w-12 md:h-12" />
        </a>

        <a
          href="https://www.instagram.com/tuusuario"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-500 hover:scale-110 transition-transform"
        >
          <Instagram className="w-10 h-10 md:w-12 md:h-12" />
        </a>

        <a
          href="https://www.facebook.com/tuusuario"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:scale-110 transition-transform"
        >
          <Facebook className="w-10 h-10 md:w-12 md:h-12" />
        </a>
      </div>

    </section>
  );
};

export default RedesSociales;

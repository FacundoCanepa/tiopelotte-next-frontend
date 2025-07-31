// components/sections/historia/HistoriaItem.tsx
"use client";

import HistoriaCarousel from "./HistoriaCarousel";

interface Props {
  year: string;
  title: string;
  description: string;
  note: string;
  images: string[];
  iconColor: string;
  reversed?: boolean;
}

const HistoriaItem = ({ year, title, description, note, images, iconColor, reversed = false }: Props) => {
  return (
    <div
      className={`relative flex flex-col md:flex-row ${
        reversed ? "md:flex-row-reverse" : ""
      } items-center gap-10 animate-in slide-in-from-bottom-8 duration-800`}
    >
      {/* Carrusel de imagenes */}
      <div className="w-full md:w-1/2">
        <HistoriaCarousel images={images} />
      </div>

      {/* Texto */}
      <div className="w-full md:w-1/2 text-[#8B4513] space-y-4">
        <h3 className="text-2xl font-serif font-semibold">
          {year} — {title}
        </h3>
        <p className="text-gray-700 font-sans text-base leading-relaxed">
          {description}
        </p>
        <p className="text-sm italic" style={{ color: iconColor }}>{note}</p>
      </div>
    </div>
  );
};

export default HistoriaItem;

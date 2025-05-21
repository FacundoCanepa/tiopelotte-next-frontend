"use client";

import { useGetCategory } from "@/api/useGetCategory";
import { ResponseType } from "@/types/response";
import { useState } from "react";

const CategoryHome = () => {
  const { loading, result } = useGetCategory() as ResponseType;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleClick = (categoryId: string, slug: string) => {
    if (window.innerWidth < 1024) {
      if (expandedId === categoryId) {
        window.location.href = `/category/${slug}`;
      } else {
        setExpandedId(categoryId);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className=" text-center  font-garamond text-[4vh] md:text-[6vh] sm:pb-1 italic tracking-wide  ">
  ¿Qué te gustaría disfrutar hoy?
</h2>
<p className="text-center text-lg font-garamond italic text-stone-600 mb-2  border-b-2 border-dashed border-black/50 md:border-0 ">
  Descubrí nuestras especialidades frescas y artesanales.
</p>

<div className="flex overflow-x-auto rounded-xl  h-[400px] lg:h-[400px] ">
  {!loading &&
    result &&
    result.map((category) => {
      const isExpandedMobile = expandedId === category.id;

      return (
        <div
          key={category.id}
          onClick={() => handleClick(category.id, category.slug)}
          className={`
            group relative flex-shrink-0 cursor-pointer
            overflow-hidden 
            transition-all duration-500 ease-in-out
            ${isExpandedMobile ? "flex-[3]" : "flex-[1]"}
            lg:flex-[1] lg:hover:flex-[3]
            w-[280px] lg:w-auto
          `}
        >
          <img
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${category.mainImage.url}`}
            alt={category.categoryNames}
            className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
          <div
            className="
              absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20
              bg-white/10 text-white px-5 py-2 rounded-lg
              text-xl font-garamond italic tracking-wide shadow-md
              backdrop-blur-sm transition-all duration-500
              group-hover:text-2xl
            "
          >
            {category.categoryNames}
          </div>
        </div>
      );
    })}
</div>

    </div>
  );
};

export default CategoryHome;

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ProductPagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Paginación de productos">
      {/* Botón anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-[#8B4513] hover:bg-[#FFD966] hover:text-[#5A3E1B]"
        )}
      >
        <ChevronLeft size={18} />
        Anterior
      </button>

      {/* Números de página */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' ? onPageChange(page) : undefined}
            disabled={typeof page !== 'number'}
            className={cn(
              "w-10 h-10 rounded-xl font-medium transition-all",
              typeof page !== 'number'
                ? "cursor-default text-gray-400"
                : page === currentPage
                ? "bg-[#8B4513] text-white"
                : "text-[#8B4513] hover:bg-[#FFD966]"
            )}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Botón siguiente */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-[#8B4513] hover:bg-[#FFD966] hover:text-[#5A3E1B]"
        )}
      >
        Siguiente
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
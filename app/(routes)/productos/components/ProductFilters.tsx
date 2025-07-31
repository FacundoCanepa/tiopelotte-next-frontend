"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductFilters as FilterType } from "@/lib/api/products";
import { Search, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  filters: FilterType;
  onFiltersChange: (filters: Partial<FilterType>) => void;
  onClearFilters: () => void;
}

// Hook para obtener categorías
function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories?populate=*`);
      if (!response.ok) throw new Error('Error al cargar categorías');
      const data = await response.json();
      return data.data || [];
    },
    staleTime: 15 * 60 * 1000, // 15 minutos
  });
}

export default function ProductFilters({ filters, onFiltersChange, onClearFilters }: Props) {
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFiltersChange({ search: searchInput || undefined });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, filters.search, onFiltersChange]);

  const hasActiveFilters = !!(
    filters.search ||
    filters.category ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.isOffer
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E6D2B5] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#8B4513] flex items-center gap-2">
          <Filter size={20} />
          Filtros
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <X size={16} />
            Limpiar
          </button>
        )}
      </div>

      {/* Búsqueda */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#8B4513]">Buscar productos</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Nombre del producto..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-[#E6D2B5] rounded-xl focus:ring-2 focus:ring-[#FFD966] focus:border-transparent"
          />
        </div>
      </div>

      {/* Categorías */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#8B4513]">Categoría</label>
        <select
          value={filters.category || ""}
          onChange={(e) => onFiltersChange({ category: e.target.value || undefined })}
          className="w-full p-3 border border-[#E6D2B5] rounded-xl focus:ring-2 focus:ring-[#FFD966] focus:border-transparent"
          disabled={categoriesLoading}
        >
          <option value="">Todas las categorías</option>
          {categories.map((category: any) => (
            <option key={category.id} value={category.slug}>
              {category.categoryNames}
            </option>
          ))}
        </select>
      </div>

      {/* Rango de precios */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#8B4513]">Rango de precio</label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Mínimo"
            value={filters.minPrice || ""}
            onChange={(e) => onFiltersChange({ 
              minPrice: e.target.value ? Number(e.target.value) : undefined 
            })}
            className="p-3 border border-[#E6D2B5] rounded-xl focus:ring-2 focus:ring-[#FFD966] focus:border-transparent"
          />
          <input
            type="number"
            placeholder="Máximo"
            value={filters.maxPrice || ""}
            onChange={(e) => onFiltersChange({ 
              maxPrice: e.target.value ? Number(e.target.value) : undefined 
            })}
            className="p-3 border border-[#E6D2B5] rounded-xl focus:ring-2 focus:ring-[#FFD966] focus:border-transparent"
          />
        </div>
      </div>

      {/* Ordenamiento */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#8B4513]">Ordenar por</label>
        <select
          value={filters.sort || ""}
          onChange={(e) => onFiltersChange({ sort: e.target.value || undefined })}
          className="w-full p-3 border border-[#E6D2B5] rounded-xl focus:ring-2 focus:ring-[#FFD966] focus:border-transparent"
        >
          <option value="">Relevancia</option>
          <option value="priceAsc">Precio: menor a mayor</option>
          <option value="priceDesc">Precio: mayor a menor</option>
          <option value="nameAsc">Nombre: A-Z</option>
          <option value="nameDesc">Nombre: Z-A</option>
          <option value="newest">Más recientes</option>
        </select>
      </div>

      {/* Solo ofertas */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="only-offers"
          checked={filters.isOffer || false}
          onChange={(e) => onFiltersChange({ isOffer: e.target.checked || undefined })}
          className="w-4 h-4 text-[#8B4513] border-[#E6D2B5] rounded focus:ring-[#FFD966]"
        />
        <label htmlFor="only-offers" className="text-sm font-medium text-[#8B4513]">
          Solo productos en oferta
        </label>
      </div>
    </div>
  );
}
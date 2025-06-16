"use client"

import { useGetCategory } from "@/components/hooks/useGetCategory"
import { Search, DollarSign, Flame, Scale, ArrowUpDown } from "lucide-react"

interface Props {
  selected: string
  setSelected: (value: string) => void
  search: string
  setSearch: (value: string) => void
  minPrice: string
  setMinPrice: (value: string) => void
  maxPrice: string
  setMaxPrice: (value: string) => void
  onlyOffers: boolean
  setOnlyOffers: (value: boolean) => void
  sortOrder: string
  setSortOrder: (value: string) => void
  unidad?: string
  setUnidad?: (value: string) => void
}

const ProductosFilters = ({
  selected,
  setSelected,
  search,
  setSearch,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onlyOffers,
  setOnlyOffers,
  sortOrder,
  setSortOrder,
  unidad = "",
  setUnidad = () => {},
}: Props) => {
  const { loading, result } = useGetCategory()

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Categoría */}
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="px-4 py-2 bg-[#FFF4E3] text-[#8B4513] border border-[#E6D2B5] rounded-xl shadow-sm text-sm cursor-pointer transition-all"
      >
        <option value="" className="cursor-pointer">Todas las categorías</option>
        {!loading &&
          Array.isArray(result) &&
          result.map((cat: any) => (
            <option key={cat.id} value={cat.slug} className="cursor-pointer">
              {cat.categoryNames}
            </option>
          ))}
      </select>

      {/* Búsqueda por nombre */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-3 text-[#8B4513]" />
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2 bg-[#FFF4E3] text-[#8B4513] border border-[#E6D2B5] rounded-xl shadow-sm text-sm w-full transition-all"
        />
      </div>

      {/* Rango de precios */}
      <div className="flex gap-4">
        <div className="relative w-full">
          <DollarSign size={16} className="absolute left-3 top-3 text-[#8B4513]" />
          <input
            type="number"
            placeholder="Mínimo"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="pl-9 pr-2 py-2 bg-[#FFF4E3] text-[#8B4513] border border-[#E6D2B5] rounded-xl shadow-sm text-sm w-full transition-all"
          />
        </div>
        <div className="relative w-full">
          <DollarSign size={16} className="absolute left-3 top-3 text-[#8B4513]" />
          <input
            type="number"
            placeholder="Máximo"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="pl-9 pr-2 py-2 bg-[#FFF4E3] text-[#8B4513] border border-[#E6D2B5] rounded-xl shadow-sm text-sm w-full transition-all"
          />
        </div>
      </div>

      {/* Checkbox solo ofertas */}
      <label className="flex items-center gap-3 px-4 py-2 bg-[#FFF4E3] border border-[#E6D2B5] rounded-xl shadow-sm text-[#8B4513] text-sm cursor-pointer select-none transition-all">
        <Flame size={16} className="text-[#8B4513]" />
        <input
          type="checkbox"
          checked={onlyOffers}
          onChange={(e) => setOnlyOffers(e.target.checked)}
          className="accent-[#6B8E23] w-4 h-4 rounded focus:ring-0"
        />
        Solo ofertas
      </label>

      {/* Unidad de medida */}
      <div className="relative">
        <Scale size={16} className="absolute left-3 top-3 text-[#8B4513]" />
        <select
          value={unidad}
          onChange={(e) => setUnidad(e.target.value)}
          className="pl-9 pr-2 py-2 bg-[#FFF4E3] text-[#8B4513] border border-[#E6D2B5] rounded-xl shadow-sm text-sm w-full cursor-pointer transition-all"
        >
          <option value="">Todas las unidades</option>
          <option value="kg">Por kilo</option>
          <option value="unidad">Por unidad</option>
          <option value="planchas">Por planchas</option>
        </select>
      </div>

      {/* Ordenar por precio */}
      <div className="relative">
        <ArrowUpDown size={16} className="absolute left-3 top-3 text-[#8B4513]" />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="pl-9 pr-2 py-2 bg-[#FFF4E3] text-[#8B4513] border border-[#E6D2B5] rounded-xl shadow-sm text-sm w-full cursor-pointer transition-all"
        >
          <option value="">Ordenar por precio</option>
          <option value="asc">Menor a mayor</option>
          <option value="desc">Mayor a menor</option>
        </select>
      </div>
    </div>
  )
}

export default ProductosFilters

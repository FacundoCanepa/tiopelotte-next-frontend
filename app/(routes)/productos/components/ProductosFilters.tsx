"use client"

import { useGetCategory } from "@/components/hook/useGetCategory"

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
  setSortOrder
}: Props) => {
  const { loading, result } = useGetCategory()

  return (
    <div className="flex flex-col gap-4">
      {/* Categoría */}
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="px-4 py-2 bg-[#FFF4E3] text-[#8B4513] border border-[#E6D2B5] rounded-xl shadow-sm text-sm cursor-pointer"
      >
        <option value="">Todas las categorías</option>
        {!loading &&
          Array.isArray(result) &&
          result.map((cat: any) => (
            <option key={cat.id} value={cat.slug}>
              {cat.categoryNames}
            </option>
          ))}
      </select>

      {/* Búsqueda por nombre */}
      <input
        type="text"
        placeholder="Buscar producto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-4 py-2 bg-[#FFF4E3] text-[#8B4513] border border-[#E6D2B5] rounded-xl shadow-sm text-sm"
      />

      {/* Rango de precios */}
      <div className="flex gap-4">
        <input
          type="number"
          placeholder="Precio mínimo"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-full px-4 py-2 bg-[#FFF4E3] text-[#8B4513] border border-[#E6D2B5] rounded-xl shadow-sm text-sm"
        />
        <input
          type="number"
          placeholder="Precio máximo"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full px-4 py-2 bg-[#FFF4E3] text-[#8B4513] border border-[#E6D2B5] rounded-xl shadow-sm text-sm"
        />
      </div>

      {/* Checkbox solo ofertas */}
<label className="flex items-center gap-3 px-4 py-2 bg-[#FFF4E3] border border-[#E6D2B5] rounded-xl shadow-sm text-[#8B4513] text-sm cursor-pointer select-none">
  <input
    type="checkbox"
    checked={onlyOffers}
    onChange={(e) => setOnlyOffers(e.target.checked)}
    className="accent-[#6B8E23] w-4 h-4 rounded focus:ring-0"
  />
  Solo ofertas
</label>


      {/* Ordenar por precio (solo en desktop) */}
      <div className="hidden md:block">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-4 py-2 bg-[#FFF4E3] text-[#8B4513] border border-[#E6D2B5] rounded-xl shadow-sm text-sm"
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

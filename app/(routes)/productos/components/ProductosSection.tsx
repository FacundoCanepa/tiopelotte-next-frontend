"use client"

import { useState } from "react"
import { useGetProductsBy } from "@/components/hook/useGetProductsBy"
import { ProductType } from "@/types/product"
import AnimatedSection from "@/components/ui/AnimatedWrapper"
import ProductGridCard from "./ProductGridCard"
import ProductosFilters from "./ProductosFilters"
import { SlidersHorizontal, ArrowUpDown } from "lucide-react"

const PRODUCTS_PER_PAGE = 12

const ProductosSection = () => {
  const [category, setCategory] = useState("")
  const [search, setSearch] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [onlyOffers, setOnlyOffers] = useState(false)
  const [sortOrder, setSortOrder] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const start = (currentPage - 1) * PRODUCTS_PER_PAGE

  const filters: Record<string, any> = {
    "filters[active][$eq]": true,
    "pagination[start]": start,
    "pagination[limit]": PRODUCTS_PER_PAGE,
    populate: "*",
    ...(category ? { "filters[category][slug][$eq]": category } : {}),
    ...(search ? { "filters[productName][$containsi]": search } : {}),
    ...(minPrice ? { "filters[price][$gte]": minPrice } : {}),
    ...(maxPrice ? { "filters[price][$lte]": maxPrice } : {}),
    ...(onlyOffers ? { "filters[isOffer][$eq]": true } : {}),
    ...(sortOrder ? { sort: `price:${sortOrder}` } : {}),
  }

  const { products, total, loading } = useGetProductsBy(filters)
  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE)

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
  }

  const handleClearFilters = () => {
    setCategory("")
    setSearch("")
    setMinPrice("")
    setMaxPrice("")
    setOnlyOffers(false)
    setSortOrder("")
    setCurrentPage(1)
  }

  return (
    <AnimatedSection className="bg-[#FBE6D4] px-2 sm:px-6 md:px-10 py-20 max-w-screen-2xl mx-auto">
      {/* TÍTULO */}
      <div className="text-center mb-12 md:col-span-2">
        <h2 className="text-[#8B4513] text-3xl sm:text-4xl font-garamond italic">
          Nuestra selección de productos
        </h2>
        <p className="text-stone-500 italic font-garamond text-base sm:text-lg">
          Filtrá y descubrí las pastas que más se ajustan a vos
        </p>
      </div>

      {/* BOTONES MOBILE */}
      <div className="flex justify-between gap-2 mb-4 md:hidden">
        <button
          onClick={toggleSortOrder}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFF4E3] text-[#8B4513] shadow-sm border border-[#E6D2B5] active:scale-95 transition-all"
        >
          <ArrowUpDown size={18} />
          {sortOrder === "desc" ? "Mayor precio" : "Menor precio"}
        </button>

        <button
          onClick={() => setShowMobileFilters((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFF4E3] text-[#8B4513] shadow-sm border border-[#E6D2B5] active:scale-95 transition-all"
        >
          <SlidersHorizontal size={18} /> Filtrar
        </button>
      </div>

      {/* FILTROS MOBILE */}
      {showMobileFilters && (
        <div className="block md:hidden mb-8">
          <ProductosFilters
            selected={category}
            setSelected={setCategory}
            search={search}
            setSearch={setSearch}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onlyOffers={onlyOffers}
            setOnlyOffers={setOnlyOffers}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
          <button
            onClick={handleClearFilters}
            className="mt-4 w-full px-4 py-2 rounded-xl bg-[#FFD966] text-[#8B4513] hover:bg-[#F5C741] transition-all shadow-sm font-semibold text-sm cursor-pointer "
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* LAYOUT GENERAL */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* ASIDE FILTROS EN DESKTOP */}
        <aside className="hidden md:block w-full md:max-w-xs">
          <ProductosFilters
            selected={category}
            setSelected={setCategory}
            search={search}
            setSearch={setSearch}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onlyOffers={onlyOffers}
            setOnlyOffers={setOnlyOffers}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
          <button
            onClick={handleClearFilters}
            className="mt-4 w-full px-4 py-2 rounded-xl bg-[#FFD966] text-[#8B4513] hover:bg-[#F5C741] transition-all shadow-sm font-semibold text-sm"
          >
            Limpiar filtros
          </button>
        </aside>

        {/* SECCIÓN DE PRODUCTOS */}
        <section className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-[#8B4513] text-center animate-pulse">
              <span className="text-2xl font-garamond italic">Cargando productos...</span>
              <p className="text-sm mt-2 text-stone-500">Un momento, el Tío Pelotte los está preparando 🍝</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center bg-[#FFF4E3] border border-[#EAD9C1] text-[#8B4513] rounded-xl p-6 shadow-sm mt-6 animate-fade-in min-h-[40vh]">
              <div className="text-5xl mb-3">🍝</div>
              <h3 className="text-2xl font-garamond italic mb-2">No encontramos productos</h3>
              <p className="text-sm text-stone-600 max-w-md">
                Probá cambiar los filtros o buscar otro tipo de pasta. ¡Seguro tenemos algo que te va a encantar!
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-6 px-5 py-2 rounded-full bg-[#FFD966] text-[#8B4513] hover:bg-[#F5C741] transition-all shadow-sm font-semibold text-sm"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product: ProductType) => (
                  <ProductGridCard key={product.id} product={product} />
                ))}
              </div>

              {/* PAGINACIÓN */}
              <div className="flex justify-center mt-12 gap-2 text-sm font-medium text-[#8B4513] flex-wrap">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded disabled:text-stone-300 cursor-pointer"
                >
                  « Anterior
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`px-3 py-1 rounded transition-all duration-200 cursor-pointer ${
                      currentPage === num
                        ? "bg-[#FFD966] text-[#8B4513] font-bold shadow-sm"
                        : "hover:underline"
                    }`}
                  >
                    {num}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded disabled:text-stone-300 cursor-pointer"
                >
                  Siguiente »
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </AnimatedSection>
  )
}

export default ProductosSection

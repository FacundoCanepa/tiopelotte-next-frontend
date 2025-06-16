"use client";

import { useFilteredProducts } from "@/components/hooks/useFilteredProducts";
import AnimatedSection from "@/components/ui/AnimatedWrapper";
import ProductGridCard from "./ProductGridCard";
import ProductosFilters from "../filters/ProductosFilters";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

const ProductosSection = () => {
  const {
    products,
    totalFiltered,
    filters,
    setFilters,
    currentPage,
    setPage,
    totalPages,
    loading,
  } = useFilteredProducts();

  const { category, search, priceRange, onlyOffers, sort, unidad } = filters;
  const [minPrice, maxPrice] = priceRange;
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setFilters((prev) => ({ ...prev, category: categoryFromUrl }));
    }
  }, [searchParams, setFilters]);

  const toggleSortOrder = () => {
    setFilters((f) => ({
      ...f,
      sort: f.sort === "priceDesc" ? "priceAsc" : "priceDesc",
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      category: "",
      sort: "",
      onlyOffers: false,
      unidad: "",
      priceRange: ["", ""],
    });
    setPage(1);
  };

  return (
    <AnimatedSection className="bg-[#FBE6D4] px-2 sm:px-6 md:px-10 py-20 max-w-screen-2xl mx-auto">
      <div className="text-center mb-12 md:col-span-2">
        <h2 className="text-[#8B4513] text-3xl sm:text-4xl font-garamond italic">
          Nuestra selección de productos
        </h2>
        <p className="text-stone-500 italic font-garamond text-base sm:text-lg">
          Filtrá y descubrí las pastas que más se ajustan a vos
        </p>
        <p className="text-[#8B4513]/70 text-sm mt-2">
          {totalFiltered} productos encontrados
        </p>
      </div>

      <div className="flex justify-between gap-2 mb-4 md:hidden">
        <button
          onClick={toggleSortOrder}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFF4E3] text-[#8B4513] shadow-sm border border-[#E6D2B5] active:scale-95 transition-all"
        >
          <ArrowUpDown size={18} />
          {sort === "priceDesc" ? "Mayor precio" : "Menor precio"}
        </button>
        <button
          onClick={() => setShowMobileFilters((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFF4E3] text-[#8B4513] shadow-sm border border-[#E6D2B5] active:scale-95 transition-all"
        >
          <SlidersHorizontal size={18} /> Filtrar
        </button>
      </div>

      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="block md:hidden mb-8"
          >
            <ProductosFilters
              selected={category}
              setSelected={(val) => setFilters((f) => ({ ...f, category: val }))}
              search={search}
              setSearch={(val) => setFilters((f) => ({ ...f, search: val }))}
              minPrice={minPrice ? minPrice.toString() : ""}
              setMinPrice={(val) =>
                setFilters((f) => ({ ...f, priceRange: [val, f.priceRange[1]] }))
              }
              maxPrice={maxPrice ? maxPrice.toString() : ""}
              setMaxPrice={(val) =>
                setFilters((f) => ({ ...f, priceRange: [f.priceRange[0], val] }))
              }
              onlyOffers={onlyOffers}
              setOnlyOffers={(val) => setFilters((f) => ({ ...f, onlyOffers: val }))}
              sortOrder={
                sort === "priceAsc" ? "asc" : sort === "priceDesc" ? "desc" : ""
              }
              setSortOrder={(val) =>
                setFilters((f) => ({
                  ...f,
                  sort: val === "asc" ? "priceAsc" : val === "desc" ? "priceDesc" : "",
                }))
              }
              unidad={unidad}
              setUnidad={(val) => setFilters((f) => ({ ...f, unidad: val }))}
            />
            <button
              onClick={handleClearFilters}
              className="mt-4 w-full px-4 py-2 rounded-xl bg-[#FFD966] text-[#8B4513] hover:bg-[#F5C741] transition-all shadow-sm font-semibold text-sm"
            >
              Limpiar filtros
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="hidden md:block w-full md:max-w-xs">
          <ProductosFilters
            selected={category}
            setSelected={(val) => setFilters((f) => ({ ...f, category: val }))}
            search={search}
            setSearch={(val) => setFilters((f) => ({ ...f, search: val }))}
            minPrice={minPrice ? minPrice.toString() : ""}
            setMinPrice={(val) =>
              setFilters((f) => ({ ...f, priceRange: [val, f.priceRange[1]] }))
            }
            maxPrice={maxPrice ? maxPrice.toString() : ""}
            setMaxPrice={(val) =>
              setFilters((f) => ({ ...f, priceRange: [f.priceRange[0], val] }))
            }
            onlyOffers={onlyOffers}
            setOnlyOffers={(val) => setFilters((f) => ({ ...f, onlyOffers: val }))}
            sortOrder={
              sort === "priceAsc" ? "asc" : sort === "priceDesc" ? "desc" : ""
            }
            setSortOrder={(val) =>
              setFilters((f) => ({
                ...f,
                sort: val === "asc" ? "priceAsc" : val === "desc" ? "priceDesc" : "",
              }))
            }
            unidad={unidad}
            setUnidad={(val) => setFilters((f) => ({ ...f, unidad: val }))}
          />
          <button
            onClick={handleClearFilters}
            className="mt-4 w-full px-4 py-2 rounded-xl bg-[#FFD966] text-[#8B4513] hover:bg-[#F5C741] transition-all shadow-sm font-semibold text-sm"
          >
            Limpiar filtros
          </button>
        </aside>

        <section className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-[#8B4513] text-center animate-pulse">
              <span className="text-2xl font-garamond italic">
                Cargando productos...
              </span>
              <p className="text-sm mt-2 text-stone-500">
                Un momento, el Tío Pelotte los está preparando 🍝
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center bg-[#FFF4E3] border border-[#EAD9C1] text-[#8B4513] rounded-xl p-6 shadow-sm mt-6 animate-fade-in min-h-[40vh]">
              <div className="text-5xl mb-3">🍝</div>
              <h3 className="text-2xl font-garamond italic mb-2">
                No encontramos productos
              </h3>
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
                {products.map((product) => (
                  <ProductGridCard key={product.id} product={product} />
                ))}
              </div>

              <div className="flex justify-center mt-12 gap-2 text-sm font-medium text-[#8B4513] flex-wrap">
                <button
                  onClick={() => setPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded disabled:text-stone-300 cursor-pointer"
                >
                  « Anterior
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
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
                  onClick={() => setPage(Math.min(currentPage + 1, totalPages))}
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
  );
};

export default ProductosSection;

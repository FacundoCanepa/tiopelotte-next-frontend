/**
 * Sección principal de productos optimizada para performance y UX
 */

"use client";

import { useFilteredProducts } from "@/components/hooks/useFilteredProducts";
import { SlidersHorizontal, ArrowUpDown, Grid3X3, List } from "lucide-react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ProductGridCard from "./ProductGridCard";
import ProductosFilters from "../filters/ProductosFilters";
import { ProductLoadingSpinner } from "@/components/ui/LoadingSpinner";

// Helper function para debounce
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Componente de layout toggle para vista grid/lista
function ViewToggle({ view, setView }: { view: 'grid' | 'list', setView: (v: 'grid' | 'list') => void }) {
  return (
    <div className="flex items-center gap-2 bg-white/50 rounded-lg p-1 border border-[#E6D2B5]">
      <button
        onClick={() => setView('grid')}
        className={`p-2 rounded-md transition-all ${
          view === 'grid' 
            ? 'bg-[#FFD966] text-[#5A3E1B] shadow-sm' 
            : 'text-[#8B4513] hover:bg-white/50'
        }`}
        aria-label="Vista en grilla"
        title="Vista en grilla"
      >
        <Grid3X3 size={18} />
      </button>
      <button
        onClick={() => setView('list')}
        className={`p-2 rounded-md transition-all ${
          view === 'list' 
            ? 'bg-[#FFD966] text-[#5A3E1B] shadow-sm' 
            : 'text-[#8B4513] hover:bg-white/50'
        }`}
        aria-label="Vista en lista"
        title="Vista en lista"
      >
        <List size={18} />
      </button>
    </div>
  );
}

// Componente de información de resultados
function ResultsInfo({ total, currentPage, totalPages, loading }: {
  total: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="text-sm text-[#8B4513]/70 italic">
        Buscando productos deliciosos...
      </div>
    );
  }

  const start = (currentPage - 1) * 12 + 1;
  const end = Math.min(currentPage * 12, total);

  return (
    <div className="text-sm text-[#8B4513]/70">
      Mostrando <span className="font-semibold">{start}-{end}</span> de{" "}
      <span className="font-semibold">{total}</span> productos
      {totalPages > 1 && (
        <span className="ml-2">
          (Página {currentPage} de {totalPages})
        </span>
      )}
    </div>
  );
}

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
    error,
    categories,
    clearFilters,
    refetch
  } = useFilteredProducts();

  const { category, search, priceRange, onlyOffers, sort, unidad } = filters;
  const [minPrice, maxPrice] = priceRange;
  
  // Estados locales para UX
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  // Hooks de Next.js para URL sync
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Sync inicial de filtros con URL params para SEO
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const urlFilters: any = {};
    
    // Extraer filtros de la URL
    if (params.get('category')) urlFilters.category = params.get('category');
    if (params.get('search')) urlFilters.search = params.get('search');
    if (params.get('ofertas') === 'true') urlFilters.onlyOffers = true;
    if (params.get('sort')) urlFilters.sort = params.get('sort');
    if (params.get('unidad')) urlFilters.unidad = params.get('unidad');
    if (params.get('min')) urlFilters.priceRange = [params.get('min'), priceRange[1]];
    if (params.get('max')) urlFilters.priceRange = [priceRange[0], params.get('max')];
    
    // Aplicar filtros si hay cambios
    if (Object.keys(urlFilters).length > 0) {
      setFilters((prev: any) => ({ ...prev, ...urlFilters }));
    }
  }, [searchParams, setFilters, priceRange]);

  // Debounced URL update para SEO
  const updateURL = useMemo(
    () => debounce((newFilters: any) => {
      const params = new URLSearchParams();
      
      // Solo agregar parámetros con valores
      if (newFilters.category) params.set('category', newFilters.category);
      if (newFilters.search) params.set('search', newFilters.search);
      if (newFilters.onlyOffers) params.set('ofertas', 'true');
      if (newFilters.sort) params.set('sort', newFilters.sort);
      if (newFilters.unidad) params.set('unidad', newFilters.unidad);
      if (newFilters.priceRange[0]) params.set('min', newFilters.priceRange[0]);
      if (newFilters.priceRange[1]) params.set('max', newFilters.priceRange[1]);
      
      const queryString = params.toString();
      const newURL = queryString ? `${pathname}?${queryString}` : pathname;
      
      // Actualizar URL sin recargar página
      router.replace(newURL, { scroll: false });
    }, 500),
    [pathname, router]
  );

  // Actualizar URL cuando cambien los filtros
  useEffect(() => {
    updateURL(filters);
  }, [filters, updateURL]);

  // Handler optimizado para sort rápido en mobile
  const toggleSortOrder = useCallback(() => {
    setFilters((f: any) => ({
      ...f,
      sort: f.sort === "priceDesc" ? "priceAsc" : "priceDesc",
    }));
  }, [setFilters]);

  // Handler para limpiar filtros
  const handleClearFilters = useCallback(() => {
    clearFilters();
    router.replace(pathname, { scroll: false });
  }, [clearFilters, router, pathname]);

  // Mostrar error si hay problemas con la API
  if (error && !loading) {
    return (
      <section className="bg-[#FBE6D4] px-2 sm:px-6 md:px-10 py-20 max-w-screen-2xl mx-auto">
        <div className="text-center space-y-6">
          <h1 className="text-[#8B4513] text-3xl sm:text-4xl lg:text-5xl font-garamond italic">
            Error al cargar productos
          </h1>
          <p className="text-stone-600 text-lg">{error}</p>
          <button
            onClick={refetch}
            className="px-6 py-3 bg-[#FFD966] text-[#8B4513] rounded-xl hover:bg-[#F5C741] transition-all shadow-sm font-semibold"
          >
            Intentar nuevamente
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#FBE6D4] px-2 sm:px-6 md:px-10 py-20 max-w-screen-2xl mx-auto">
      {/* Header de la sección con SEO optimizado */}
      <header className="text-center mb-12 space-y-4">
        <h1 className="text-[#8B4513] text-3xl sm:text-4xl lg:text-5xl font-garamond italic">
          Nuestra selección de productos artesanales
        </h1>
        <p className="text-stone-500 italic font-garamond text-base sm:text-lg max-w-2xl mx-auto">
          Descubrí pastas frescas hechas con amor y tradición familiar desde 2008. 
          Filtrá y encontrá los sabores que más te gustan.
        </p>
        
        {/* Indicador de resultados mejorado */}
        <ResultsInfo
          total={totalFiltered}
          currentPage={currentPage}
          totalPages={totalPages}
          loading={loading}
        />
      </header>

      {/* Controles móviles optimizados */}
      <div className="flex justify-between items-center gap-2 mb-6 md:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSortOrder}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFF4E3] text-[#8B4513] shadow-sm border border-[#E6D2B5] active:scale-95 transition-all"
            aria-label={sort === "priceDesc" ? "Ordenado por mayor precio" : "Ordenado por menor precio"}
          >
            <ArrowUpDown size={18} />
            <span className="text-sm">
              {sort === "priceDesc" ? "Mayor precio" : "Menor precio"}
            </span>
          </button>
          
          <ViewToggle view={view} setView={setView} />
        </div>
        
        <button
          onClick={() => setShowMobileFilters((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFF4E3] text-[#8B4513] shadow-sm border border-[#E6D2B5] active:scale-95 transition-all"
          aria-expanded={showMobileFilters}
          aria-controls="mobile-filters"
        >
          <SlidersHorizontal size={18} />
          <span className="text-sm">Filtros</span>
        </button>
      </div>

      {/* Panel de filtros móvil con animación mejorada */}
      {showMobileFilters && (
        <div 
          id="mobile-filters"
          className="block md:hidden mb-8 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-[#E6D2B5] shadow-lg animate-in slide-in-from-top-2 duration-300"
        >
          <ProductosFilters
            selected={category}
            setSelected={(val) => setFilters((f: any) => ({ ...f, category: val }))}
            search={search}
            setSearch={(val) => setFilters((f: any) => ({ ...f, search: val }))}
            minPrice={minPrice ? minPrice.toString() : ""}
            setMinPrice={(val) =>
              setFilters((f: any) => ({ ...f, priceRange: [val, f.priceRange[1]] }))
            }
            maxPrice={maxPrice ? maxPrice.toString() : ""}
            setMaxPrice={(val) =>
              setFilters((f: any) => ({ ...f, priceRange: [f.priceRange[0], val] }))
            }
            onlyOffers={onlyOffers}
            setOnlyOffers={(val) => setFilters((f: any) => ({ ...f, onlyOffers: val }))}
            sortOrder={
              sort === "priceAsc" ? "asc" : sort === "priceDesc" ? "desc" : ""
            }
            setSortOrder={(val) =>
              setFilters((f: any) => ({
                ...f,
                sort: val === "asc" ? "priceAsc" : val === "desc" ? "priceDesc" : "",
              }))
            }
            unidad={unidad}
            setUnidad={(val) => setFilters((f: any) => ({ ...f, unidad: val }))}
          />
          
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleClearFilters}
              className="flex-1 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all shadow-sm font-semibold text-sm"
            >
              Limpiar filtros
            </button>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="flex-1 px-4 py-2 rounded-xl bg-[#FFD966] text-[#8B4513] hover:bg-[#F5C741] transition-all shadow-sm font-semibold text-sm"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      )}

      {/* Layout principal con sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar de filtros desktop */}
        <aside className="hidden md:block w-full lg:max-w-xs">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-[#E6D2B5] shadow-sm">
              <h2 className="text-lg font-semibold text-[#8B4513] mb-4 flex items-center gap-2">
                <SlidersHorizontal size={20} />
                Filtros de búsqueda
              </h2>
              
              <ProductosFilters
                selected={category}
                setSelected={(val) => setFilters((f: any) => ({ ...f, category: val }))}
                search={search}
                setSearch={(val) => setFilters((f: any) => ({ ...f, search: val }))}
                minPrice={minPrice ? minPrice.toString() : ""}
                setMinPrice={(val) =>
                  setFilters((f: any) => ({ ...f, priceRange: [val, f.priceRange[1]] }))
                }
                maxPrice={maxPrice ? maxPrice.toString() : ""}
                setMaxPrice={(val) =>
                  setFilters((f: any) => ({ ...f, priceRange: [f.priceRange[0], val] }))
                }
                onlyOffers={onlyOffers}
                setOnlyOffers={(val) => setFilters((f: any) => ({ ...f, onlyOffers: val }))}
                sortOrder={
                  sort === "priceAsc" ? "asc" : sort === "priceDesc" ? "desc" : ""
                }
                setSortOrder={(val) =>
                  setFilters((f: any) => ({
                    ...f,
                    sort: val === "asc" ? "priceAsc" : val === "desc" ? "priceDesc" : "",
                  }))
                }
                unidad={unidad}
                setUnidad={(val) => setFilters((f: any) => ({ ...f, unidad: val }))}
              />
            </div>
            
            <button
              onClick={handleClearFilters}
              className="w-full px-4 py-3 rounded-xl bg-[#FFD966] text-[#8B4513] hover:bg-[#F5C741] transition-all shadow-sm font-semibold text-sm border border-[#E6D2B5]"
            >
              🔄 Limpiar todos los filtros
            </button>
          </div>
        </aside>

        {/* Área principal de productos */}
        <main className="flex-1 min-w-0">
          {/* Controles de vista desktop */}
          <div className="hidden md:flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <ViewToggle view={view} setView={setView} />
              <div className="text-sm text-[#8B4513] bg-white/40 px-3 py-1 rounded-lg">
                Vista: {view === 'grid' ? 'Grilla' : 'Lista'}
              </div>
            </div>
          </div>

          {/* Grid de productos con estados optimizados */}
          {loading ? (
            <ProductLoadingSpinner message="Buscando las mejores pastas para vos..." />
          ) : products.length === 0 ? (
            // Estado vacío mejorado
            <div className="flex flex-col items-center justify-center text-center bg-[#FFF4E3] border border-[#EAD9C1] text-[#8B4513] rounded-xl p-8 shadow-sm mt-6 min-h-[50vh] space-y-6">
              <div className="text-6xl mb-4">🍝</div>
              <div className="space-y-3">
                <h3 className="text-2xl font-garamond italic">
                  No encontramos productos con esos filtros
                </h3>
                <p className="text-base text-stone-600 max-w-md">
                  Probá cambiando los filtros o buscando otro tipo de pasta. 
                  ¡Tenemos muchas delicias esperándote!
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 rounded-full bg-[#FFD966] text-[#8B4513] hover:bg-[#F5C741] transition-all shadow-sm font-semibold text-sm"
                >
                  🔄 Limpiar filtros
                </button>
                <a
                  href="/productos"
                  className="px-6 py-3 rounded-full border border-[#8B4513] text-[#8B4513] hover:bg-[#FFD966] transition-all shadow-sm font-semibold text-sm"
                >
                  Ver todos los productos
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Grid de productos responsivo */}
              <div 
                className={
                  view === 'grid' 
                    ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                    : "space-y-4"
                }
                role="main"
                aria-label={`${products.length} productos encontrados`}
              >
                {products.map((product) => (
                  <ProductGridCard 
                    key={product.id} 
                    product={product} 
                    layout={view}
                  />
                ))}
              </div>

              {/* Paginación mejorada */}
              {totalPages > 1 && (
                <nav 
                  className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12"
                  aria-label="Navegación de páginas de productos"
                >
                  {/* Info de página actual */}
                  <div className="text-sm text-[#8B4513] bg-white/40 px-3 py-1 rounded-lg">
                    Página {currentPage} de {totalPages}
                  </div>
                  
                  {/* Controles de paginación */}
                  <div className="flex gap-2 text-sm font-medium text-[#8B4513] flex-wrap justify-center">
                    <button
                      onClick={() => setPage(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg disabled:text-stone-300 disabled:cursor-not-allowed hover:bg-[#FFD966]/50 transition-colors"
                      aria-label="Página anterior"
                    >
                      ← Anterior
                    </button>

                    {/* Páginas numeradas (mostrar máximo 5) */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, currentPage - 2) + i;
                      if (pageNum > totalPages) return null;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                            currentPage === pageNum
                              ? "bg-[#FFD966] text-[#8B4513] font-bold shadow-sm scale-105"
                              : "hover:bg-[#FFD966]/30 hover:scale-105"
                          }`}
                          aria-label={`Ir a página ${pageNum}`}
                          aria-current={currentPage === pageNum ? "page" : undefined}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setPage(Math.min(currentPage + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg disabled:text-stone-300 disabled:cursor-not-allowed hover:bg-[#FFD966]/50 transition-colors"
                      aria-label="Página siguiente"
                    >
                      Siguiente →
                    </button>
                  </div>
                </nav>
              )}
            </div>
          )}
        </main>
      </div>

      {/* CTA adicional para conversión */}
      {!loading && products.length > 0 && (
        <div className="mt-16 text-center bg-gradient-to-r from-[#FFF4E3] to-[#FBE6D4] rounded-2xl p-8 border border-[#E6D2B5]">
          <h3 className="text-xl font-garamond italic text-[#8B4513] mb-3">
            ¿No encontrás lo que buscás?
          </h3>
          <p className="text-stone-600 mb-4 max-w-md mx-auto">
            Contactanos por WhatsApp y te ayudamos a elegir la pasta perfecta para tu ocasión especial.
          </p>
          <a
            href={`https://wa.me/5492213086600?text=${encodeURIComponent('Hola! Estoy buscando pastas artesanales...')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all hover:scale-105"
          >
            💬 Consultar por WhatsApp
          </a>
        </div>
      )}
    </section>
  );
};

export default ProductosSection;
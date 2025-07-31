"use client";

import { useState, useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductFilters } from "@/lib/api/products";
import { ProductsLoading } from "@/components/ui/LoadingStates";
import { ProductErrorBoundary } from "@/components/ui/ErrorBoundary";
import ProductGrid from "./ProductGrid";
import ProductFilters from "./ProductFilters";
import ProductPagination from "./ProductPagination";
import { Search, SlidersHorizontal } from "lucide-react";

const PRODUCTS_PER_PAGE = 12;

export default function ProductsSection() {
  // Estados de filtros
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    pageSize: PRODUCTS_PER_PAGE,
    active: true,
  });
  
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Query de productos con React Query
  const { 
    data: productsResponse, 
    isLoading, 
    error, 
    refetch 
  } = useProducts(filters);

  const products = productsResponse?.data || [];
  const pagination = productsResponse?.meta?.pagination;

  // Handlers para filtros
  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1, // Reset página al cambiar filtros
    }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      pageSize: PRODUCTS_PER_PAGE,
      active: true,
    });
  };

  // Información de resultados
  const resultsInfo = useMemo(() => {
    if (!pagination) return null;
    
    const { page, pageSize, total } = pagination;
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);
    
    return { start, end, total, page };
  }, [pagination]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#FBE6D4] flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-[#8B4513]">Error al cargar productos</h2>
          <p className="text-stone-600">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="bg-[#FFD966] hover:bg-[#F5C741] text-[#8B4513] px-6 py-3 rounded-xl font-semibold"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProductErrorBoundary>
      <section className="bg-[#FBE6D4] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-garamond italic text-[#8B4513] mb-4">
              Nuestros Productos Artesanales
            </h1>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Descubrí pastas frescas hechas con amor y tradición familiar desde 2008
            </p>
            
            {resultsInfo && (
              <div className="mt-4 text-sm text-[#8B4513]">
                Mostrando {resultsInfo.start}-{resultsInfo.end} de {resultsInfo.total} productos
              </div>
            )}
          </div>

          {/* Controles móviles */}
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-[#E6D2B5]"
            >
              <SlidersHorizontal size={18} />
              Filtros
            </button>
            
            <div className="text-sm text-[#8B4513] bg-white px-3 py-1 rounded-lg">
              {products.length} productos
            </div>
          </div>

          {/* Layout principal */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar de filtros */}
            <aside className={cn(
              "lg:w-80 lg:block",
              showMobileFilters ? "block" : "hidden"
            )}>
              <div className="sticky top-24">
                <ProductFilters
                  filters={filters}
                  onFiltersChange={updateFilters}
                  onClearFilters={clearFilters}
                />
              </div>
            </aside>

            {/* Grid de productos */}
            <main className="flex-1">
              {isLoading ? (
                <ProductsLoading />
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[#8B4513] mb-2">
                    No se encontraron productos
                  </h3>
                  <p className="text-stone-600 mb-6">
                    Probá ajustando los filtros o buscando otros términos
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-[#FFD966] hover:bg-[#F5C741] text-[#8B4513] px-6 py-3 rounded-xl font-semibold"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <>
                  <ProductGrid products={products} />
                  
                  {pagination && pagination.pageCount > 1 && (
                    <ProductPagination
                      currentPage={pagination.page}
                      totalPages={pagination.pageCount}
                      onPageChange={(page) => updateFilters({ page })}
                    />
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </section>
    </ProductErrorBoundary>
  );
}
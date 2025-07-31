/**
 * Hook optimizado para filtrado de productos con performance mejorada
 */

import { useEffect, useState, useMemo, useCallback } from "react";
import { ProductType } from "@/types/product";
import { useGetAllProducts } from "./useGetAllProducts";
import { useGetCategory } from "./useGetCategory";

// Tipo para los filtros
interface Filters {
  search: string;
  category: string;
  sort: string;
  onlyOffers: boolean;
  unidad: string;
  priceRange: [string, string];
}

// Configuración de paginación
const ITEMS_PER_PAGE = 12;

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

/**
 * Hook principal para filtrado de productos optimizado
 */
export function useFilteredProducts() {
  // Datos desde la API
  const { result: allProducts = [], loading: loadingProducts, error: productsError, refetch: refetchProducts } = useGetAllProducts();
  const { result: categories = [], loading: loadingCategories, error: categoriesError, refetch: refetchCategories } = useGetCategory();

  // Estados de filtros
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "",
    sort: "",
    onlyOffers: false,
    unidad: "",
    priceRange: ["", ""],
  });

  // Estados de UI
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  // Función de filtrado optimizada con memoización
  const filterProducts = useMemo(() => {
    if (!Array.isArray(allProducts) || allProducts.length === 0) {
      return [];
    }

    let result = [...allProducts];

    // Filtro por búsqueda de texto
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      result = result.filter((product) => {
        return (
          product.productName?.toLowerCase().includes(searchTerm) ||
          product.description?.toLowerCase().includes(searchTerm) ||
          product.descriptionCorta?.toLowerCase().includes(searchTerm) ||
          product.taste?.toLowerCase().includes(searchTerm) ||
          product.category?.categoryNames?.toLowerCase().includes(searchTerm)
        );
      });
    }

    // Filtro por categoría
    if (filters.category) {
      result = result.filter((product) => 
        product.category?.slug === filters.category
      );
    }

    // Filtro por ofertas
    if (filters.onlyOffers) {
      result = result.filter((product) => product.isOffer === true);
    }

    // Filtro por unidad de medida
    if (filters.unidad) {
      result = result.filter((product) => 
        product.unidadMedida?.trim().toLowerCase() === filters.unidad.toLowerCase()
      );
    }

    // Filtro por rango de precios
    const min = filters.priceRange[0] ? Number(filters.priceRange[0]) : null;
    const max = filters.priceRange[1] ? Number(filters.priceRange[1]) : null;

    if (min !== null) {
      result = result.filter((product) => product.price >= min);
    }
    if (max !== null) {
      result = result.filter((product) => product.price <= max);
    }

    // Ordenamiento
    if (filters.sort) {
      result.sort((a, b) => {
        switch (filters.sort) {
          case "priceAsc":
            return a.price - b.price;
          case "priceDesc":
            return b.price - a.price;
          case "nameAsc":
            return a.productName.localeCompare(b.productName, 'es-AR');
          case "nameDesc":
            return b.productName.localeCompare(a.productName, 'es-AR');
          default:
            return 0;
        }
      });
    }

    return result;
  }, [allProducts, filters]);

  // Debounced filter update
  const debouncedSetFilters = useMemo(
    () => debounce(() => {
      setFilteredProducts(filterProducts);
      setCurrentPage(1);
      setIsFiltering(false);
    }, 300),
    [filterProducts]
  );

  // Aplicar filtros con debounce
  useEffect(() => {
    setIsFiltering(true);
    debouncedSetFilters();
  }, [filters, debouncedSetFilters]);

  // Productos paginados
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  // Información de paginación
  const paginationInfo = useMemo(() => ({
    totalFiltered: filteredProducts.length,
    totalPages: Math.ceil(filteredProducts.length / ITEMS_PER_PAGE),
    currentPage,
    hasNextPage: currentPage < Math.ceil(filteredProducts.length / ITEMS_PER_PAGE),
    hasPrevPage: currentPage > 1,
  }), [filteredProducts.length, currentPage]);

  // Función para cambiar página
  const setPage = useCallback((page: number) => {
    const maxPage = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const validPage = Math.max(1, Math.min(page, maxPage));
    setCurrentPage(validPage);
    
    // Scroll al top
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [filteredProducts.length]);

  // Función para actualizar filtros
  const updateFilters = useCallback((updater: (prev: Filters) => Filters) => {
    setFilters(updater);
  }, []);

  // Función para limpiar filtros
  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      category: "",
      sort: "",
      onlyOffers: false,
      unidad: "",
      priceRange: ["", ""],
    });
    setCurrentPage(1);
  }, []);

  // Loading state general
  const loading = loadingProducts || loadingCategories || isFiltering;
  const error = productsError || categoriesError;

  // Función de refetch para toda la data
  const refetch = useCallback(() => {
    refetchProducts();
    refetchCategories();
  }, [refetchProducts, refetchCategories]);

  return {
    // Productos y datos
    products: paginatedProducts,
    allProducts: filteredProducts,
    totalFiltered: paginationInfo.totalFiltered,
    
    // Filtros
    filters,
    setFilters: updateFilters,
    clearFilters,
    
    // Categorías
    categories,
    
    // Paginación
    currentPage: paginationInfo.currentPage,
    totalPages: paginationInfo.totalPages,
    setPage,
    hasNextPage: paginationInfo.hasNextPage,
    hasPrevPage: paginationInfo.hasPrevPage,
    
    // Estados de loading
    loading,
    loadingProducts,
    loadingCategories,
    isFiltering,
    error,
    
    // Utilidades
    pagination: paginationInfo,
    refetch,
  };
}
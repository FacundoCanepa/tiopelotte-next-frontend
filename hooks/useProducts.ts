/**
 * Hooks optimizados para productos usando React Query
 * Manejo centralizado de estado y cache para mejor performance
 */

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { productsApi, productKeys, ProductFilters } from "@/lib/api/products";
import { ProductType } from "@/types/product";

// Hook para obtener productos con filtros y paginación
export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productsApi.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook para paginación infinita de productos
export function useInfiniteProducts(filters: ProductFilters = {}) {
  return useInfiniteQuery({
    queryKey: [...productKeys.list(filters), 'infinite'],
    queryFn: ({ pageParam = 1 }) => 
      productsApi.getProducts({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, pageCount } = lastPage.meta.pagination;
      return page < pageCount ? page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para producto individual por slug
export function useProduct(slug: string) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: async () => {
      const response = await productsApi.getProductBySlug(slug);
      return response.data[0] || null;
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutos para productos individuales
  });
}

// Hook para productos destacados
export function useFeaturedProducts() {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: async () => {
      const response = await productsApi.getFeaturedProducts();
      return response.data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutos para destacados
  });
}

// Hook para productos en oferta
export function useOfferProducts() {
  return useQuery({
    queryKey: productKeys.offers(),
    queryFn: async () => {
      const response = await productsApi.getOfferProducts();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos para ofertas
  });
}

// Hook para productos por categoría
export function useProductsByCategory(categorySlug: string) {
  return useQuery({
    queryKey: productKeys.category(categorySlug),
    queryFn: async () => {
      const response = await productsApi.getProductsByCategory(categorySlug);
      return response.data;
    },
    enabled: !!categorySlug,
    staleTime: 10 * 60 * 1000,
  });
}

// Hook para búsqueda de productos con debounce
export function useProductSearch(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: async () => {
      const response = await productsApi.searchProducts(query);
      return response.data;
    },
    enabled: enabled && query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutos para búsquedas
  });
}

// Hook para productos similares
export function useSimilarProducts(categorySlug: string, excludeId: number) {
  return useQuery({
    queryKey: [...productKeys.category(categorySlug), 'similar', excludeId],
    queryFn: async () => {
      const response = await productsApi.getProductsByCategory(categorySlug);
      return response.data.filter(product => product.id !== excludeId).slice(0, 8);
    },
    enabled: !!categorySlug && !!excludeId,
    staleTime: 15 * 60 * 1000,
  });
}
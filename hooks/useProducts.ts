/**
 * Hooks optimizados para productos usando React Query
 * Manejo centralizado de estado y cache para mejor performance
 */

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { ProductType } from "@/types/product";

// Función base para requests con manejo de errores
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL no está configurado");
  }

  const url = `${baseUrl}/api${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error en API request a ${endpoint}:`, error);
    throw error;
  }
}

// Tipos para filtros de productos
export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isOffer?: boolean;
  isFeatured?: boolean;
  active?: boolean;
  page?: number;
  pageSize?: number;
  sort?: string;
}

// Construir query string para filtros
function buildQueryString(filters: ProductFilters): string {
  const params = new URLSearchParams();
  
  // Populate siempre necesario para Strapi
  params.append('populate', '*');
  
  // Filtros básicos
  if (filters.category) {
    params.append('filters[category][slug][$eq]', filters.category);
  }
  
  if (filters.search) {
    params.append('filters[$or][0][productName][$containsi]', filters.search);
    params.append('filters[$or][1][description][$containsi]', filters.search);
    params.append('filters[$or][2][descriptionCorta][$containsi]', filters.search);
  }
  
  if (filters.minPrice !== undefined) {
    params.append('filters[price][$gte]', filters.minPrice.toString());
  }
  
  if (filters.maxPrice !== undefined) {
    params.append('filters[price][$lte]', filters.maxPrice.toString());
  }
  
  if (filters.isOffer !== undefined) {
    params.append('filters[isOffer][$eq]', filters.isOffer.toString());
  }
  
  if (filters.isFeatured !== undefined) {
    params.append('filters[isFeatured][$eq]', filters.isFeatured.toString());
  }
  
  if (filters.active !== undefined) {
    params.append('filters[active][$eq]', filters.active.toString());
  }
  
  // Paginación
  if (filters.page) {
    params.append('pagination[page]', filters.page.toString());
  }
  
  if (filters.pageSize) {
    params.append('pagination[pageSize]', filters.pageSize.toString());
  }
  
  // Ordenamiento
  if (filters.sort) {
    switch (filters.sort) {
      case 'priceAsc':
        params.append('sort[0]', 'price:asc');
        break;
      case 'priceDesc':
        params.append('sort[0]', 'price:desc');
        break;
      case 'nameAsc':
        params.append('sort[0]', 'productName:asc');
        break;
      case 'nameDesc':
        params.append('sort[0]', 'productName:desc');
        break;
      case 'newest':
        params.append('sort[0]', 'createdAt:desc');
        break;
      default:
        params.append('sort[0]', 'productName:asc');
    }
  }
  
  return params.toString();
}

// API functions para productos
export const productsApi = {
  // Obtener todos los productos con filtros
  getProducts: async (filters: ProductFilters = {}): Promise<{
    data: ProductType[];
    meta: {
      pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
      };
    };
  }> => {
    const queryString = buildQueryString(filters);
    return apiRequest(`/products?${queryString}`);
  },

  // Obtener producto por slug
  getProductBySlug: async (slug: string): Promise<{ data: ProductType[] }> => {
    return apiRequest(`/products?filters[slug][$eq]=${slug}&populate=*`);
  },

  // Obtener productos destacados
  getFeaturedProducts: async (): Promise<{ data: ProductType[] }> => {
    return apiRequest('/products?filters[isFeatured][$eq]=true&filters[active][$eq]=true&populate=*');
  },

  // Obtener productos en oferta
  getOfferProducts: async (): Promise<{ data: ProductType[] }> => {
    return apiRequest('/products?filters[isOffer][$eq]=true&filters[active][$eq]=true&populate=*');
  },

  // Obtener productos por categoría
  getProductsByCategory: async (categorySlug: string): Promise<{ data: ProductType[] }> => {
    return apiRequest(`/products?filters[category][slug][$eq]=${categorySlug}&filters[active][$eq]=true&populate=*`);
  },

  // Buscar productos
  searchProducts: async (query: string): Promise<{ data: ProductType[] }> => {
    const searchFilters: ProductFilters = {
      search: query,
      active: true,
    };
    return productsApi.getProducts(searchFilters);
  },
};

// Hook keys para React Query
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
  featured: () => [...productKeys.all, 'featured'] as const,
  offers: () => [...productKeys.all, 'offers'] as const,
  category: (slug: string) => [...productKeys.all, 'category', slug] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
};

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
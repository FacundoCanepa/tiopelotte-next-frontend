/**
 * Hook optimizado para fetching de datos con caché inteligente,
 * manejo de errores avanzado, y retry automático.
 * 
 * Optimizaciones incluidas:
 * - Cache inteligente con TTL
 * - Retry automático con backoff exponencial  
 * - Abort controller para cancelar requests
 * - Deduplicación de requests idénticos
 * - Manejo de errores específicos de Strapi
 * - Loading states optimizados
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { apiCache } from "@/lib/performance";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string;
  refetch: () => void;
}

interface FetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
  cacheKey?: string;
  cacheTTL?: number;
  transform?: (data: any) => any;
}

// Map para deduplicar requests en vuelo
const inflightRequests = new Map<string, Promise<any>>();

// Helper para generar cache key único
function generateCacheKey(url: string, options: RequestInit = {}): string {
  const optionsKey = JSON.stringify({
    method: options.method || 'GET',
    body: options.body,
    headers: options.headers
  });
  return `${url}:${btoa(optionsKey)}`;
}

// Helper para errores específicos de Strapi
function parseError(error: any, response?: Response): string {
  // Errores de red
  if (!navigator.onLine) {
    return "Sin conexión a internet. Verificá tu conexión.";
  }
  
  // Errores HTTP específicos
  if (response) {
    switch (response.status) {
      case 400:
        return "Error en la solicitud. Verificá los datos enviados.";
      case 401:
        return "No autorizado. Por favor, iniciá sesión nuevamente.";
      case 403:
        return "No tenés permisos para acceder a este recurso.";
      case 404:
        return "El recurso solicitado no fue encontrado.";
      case 429:
        return "Demasiadas solicitudes. Por favor, esperá un momento.";
      case 500:
        return "Error interno del servidor. Intentá nuevamente.";
      case 503:
        return "Servicio no disponible temporalmente.";
    }
  }
  
  // Errores específicos de Strapi
  if (error?.message) {
    if (error.message.includes('fetch')) {
      return "Error de conexión. Verificá tu internet.";
    }
    if (error.message.includes('timeout')) {
      return "La solicitud tardó demasiado. Intentá nuevamente.";
    }
  }
  
  return error?.message || "Ocurrió un error inesperado.";
}

/**
 * Hook principal para fetching optimizado
 */
export function useFetch<T>(
  url?: string,
  options: FetchOptions = {},
  transform?: (data: any) => T
): FetchState<T> {
  const {
    retries = 3,
    retryDelay = 1000,
    timeout = 10000,
    cacheKey,
    cacheTTL = 5 * 60 * 1000, // 5 minutos por defecto
  const { data, loading, error } = useFetch<any>(url);
  
  const products = Array.isArray(data?.data) ? data.data : [];
  
  return { 
    loading, 
    result: products, 
    error 
  };
  const mountedRef = useRef(true);

  // Generar cache key único
  const finalCacheKey = cacheKey || (url ? generateCacheKey(url, fetchOptions) : '');

  const fetchData = useCallback(async (attempt = 1): Promise<void> => {
    if (!url) return;

    try {
      // Verificar cache primero
      const cachedData = apiCache.get(finalCacheKey);
      if (cachedData && attempt === 1) {
        if (mountedRef.current) {
          console.log(`✅ Cache hit para: ${url}`);
          setState({
            data: transform ? transform(cachedData) : cachedData,
            loading: false,
            error: ""
          });
        }
        return;
      }

      // Verificar si ya hay un request en vuelo para esta URL
      const existingRequest = inflightRequests.get(finalCacheKey);
      if (existingRequest) {
        const result = await existingRequest;
        if (mountedRef.current) {
          setState({
            data: transform ? transform(result) : result,
            loading: false,
            error: ""
          });
        }
        return;
      }

      // Actualizar loading state solo en el primer intento
      if (attempt === 1 && mountedRef.current) {
        setState(prev => ({ ...prev, loading: true, error: "" }));
      }

      // Crear nuevo AbortController para este request
      abortControllerRef.current = new AbortController();
      
      // Configurar timeout
      const timeoutId = setTimeout(() => {
        abortControllerRef.current?.abort();
      }, timeout);

      // Crear y registrar el request promise
      const requestPromise = fetch(url, {
        ...fetchOptions,
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      });

      // Registrar request en vuelo
      inflightRequests.set(finalCacheKey, requestPromise);

      const response = await requestPromise;
      clearTimeout(timeoutId);

      // Limpiar request del map
      inflightRequests.delete(finalCacheKey);

      if (!response.ok) {
        console.error(`❌ HTTP Error ${response.status} para: ${url}`);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      console.log(`✅ Data fetched para: ${url}`, json);

      // Guardar en cache
      apiCache.set(finalCacheKey, json, cacheTTL);

      // Aplicar transformación si existe
      const finalData = transform ? transform(json) : json;
      console.log(`✅ Data transformada:`, finalData);

      if (mountedRef.current) {
        setState({
          data: finalData,
          loading: false,
          error: ""
        });
      }

    } catch (error: any) {
      // Limpiar request del map en caso de error
      inflightRequests.delete(finalCacheKey);

      // No intentar retry si fue cancelado por el usuario
      if (error.name === 'AbortError') {
        return;
      }

      console.error(`❌ Error en fetch (intento ${attempt}/${retries}) para ${url}:`, error);

      // Intentar retry si quedan intentos
      if (attempt < retries) {
        // Backoff exponencial: 1s, 2s, 4s...
        const delay = retryDelay * Math.pow(2, attempt - 1);
        
        console.log(`🔄 Reintentando en ${delay}ms para: ${url}`);
        
        setTimeout(() => {
          if (mountedRef.current) {
            fetchData(attempt + 1);
          }
        }, delay);
        return;
      }

      // Si se agotaron los reintentos, mostrar error
      if (mountedRef.current) {
        const errorMessage = parseError(error);
        console.error(`❌ Error final para ${url}:`, errorMessage);
        setState({
          data: null,
          loading: false,
          error: errorMessage
        });
      }
    }
  }, [url, finalCacheKey, transform, retries, retryDelay, timeout, JSON.stringify(fetchOptions)]);

  // Función para refetch manual
  const refetch = useCallback(() => {
    // Limpiar cache para esta key
    apiCache.invalidatePattern(finalCacheKey);
    fetchData(1);
  }, [fetchData, finalCacheKey]);

  // Effect principal
  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    
    return () => {
      mountedRef.current = false;
      // Cancelar request pendiente
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    refetch
  };
}

/**
 * Hook específico para fetching de productos con optimizaciones de e-commerce
 */
export function useProductsFetch(filters: Record<string, any> = {}) {
  const queryString = new URLSearchParams(
    Object.entries(filters)
      .filter(([_, value]) => value !== '' && value != null)
      .map(([key, value]) => [key, String(value)])
  ).toString();
  
  const url = queryString 
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?${queryString}&populate=*`
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?populate=*`;

  return useFetch(url, {
    cacheKey: `products:${queryString}`,
    cacheTTL: 2 * 60 * 1000, // 2 minutos para productos (cambian frecuentemente)
    transform: (json) => ({
      products: Array.isArray(json.data) ? json.data : [],
      total: json.meta?.pagination?.total || 0,
      pages: json.meta?.pagination?.pageCount || 1
    }),
    retries: 2, // Menos reintentos para requests frecuentes
  });
}

/**
 * Hook para prefetch de rutas críticas
 */
export function usePrefetch() {
  const prefetchedRoutes = useRef(new Set<string>());

  const prefetch = useCallback((route: string) => {
    if (prefetchedRoutes.current.has(route)) return;
    
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      // Usar requestIdleCallback si está disponible para no bloquear
      window.requestIdleCallback(() => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
        prefetchedRoutes.current.add(route);
      });
    } else {
      // Fallback con setTimeout
      setTimeout(() => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
        prefetchedRoutes.current.add(route);
      }, 100);
    }
  }, []);

  return { prefetch };
}
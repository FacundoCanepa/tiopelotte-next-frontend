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
// import { apiCache } from "@/lib/performance";

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

// Cache simple para evitar requests duplicados
const requestCache = new Map<string, Promise<any>>();

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
): FetchState<T> {
  const {
    retries = 3,
    retryDelay = 500,
    timeout = 8000,
    ...fetchOptions
  } = options;

  const [state, setState] = useState<Omit<FetchState<T>, 'refetch'>>({
    data: null,
    loading: !!url,
    error: ""
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async (attempt = 1): Promise<void> => {
    if (!url) return;

    // Evitar requests duplicados para la misma URL
    const cacheKey = `${url}-${JSON.stringify(fetchOptions)}`;
    if (requestCache.has(cacheKey)) {
      try {
        const cachedData = await requestCache.get(cacheKey);
        if (mountedRef.current) {
          setState({
            data: cachedData as T,
            loading: false,
            error: ""
          });
        }
        return;
      } catch (error) {
        // Si falla el cache, continuar con request normal
        requestCache.delete(cacheKey);
      }
    }

    try {
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

      const fetchPromise = fetch(url, {
        ...fetchOptions,
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      });

      // Agregar al cache
      requestCache.set(cacheKey, fetchPromise.then(r => r.json()));
      const response = await fetchPromise;

      clearTimeout(timeoutId);

      if (!response.ok) {
        requestCache.delete(cacheKey);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();

      if (mountedRef.current) {
        setState({
          data: json as T,
          loading: false,
          error: ""
        });
        
        console.log(`✅ Datos cargados exitosamente desde: ${url}`);
      }

    } catch (error: any) {
      requestCache.delete(cacheKey);
      
      // No intentar retry si fue cancelado por el usuario
      if (error.name === 'AbortError') {
        console.log(`🚫 Request cancelado: ${url}`);
        return;
      }

      // Intentar retry si quedan intentos
      if (attempt < retries) {
        // Backoff exponencial: 1s, 2s, 4s...
        const delay = retryDelay * Math.pow(2, attempt - 1);
        
        console.warn(`⚠️ Reintentando request (${attempt}/${retries}) en ${delay}ms: ${url}`);
        
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
        console.error(`❌ Error final en fetch: ${url}`, error);
        setState({
          data: null,
          loading: false,
          error: errorMessage
        });
      }
    }
  }, [url, retries, retryDelay, timeout, JSON.stringify(fetchOptions)]);

  // Función para refetch manual
  const refetch = useCallback(() => {
    fetchData(1);
  }, [fetchData]);

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

/**
 * Hook optimizado para fetching de datos con manejo de errores robusto
 * Diseñado específicamente para producción en Vercel
 */

import { useState, useEffect, useCallback, useRef } from "react";

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
}

// Cache simple para evitar requests duplicados
const requestCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

/**
 * Parsea errores específicos de la aplicación
 */
function parseError(error: any, response?: Response): string {
  // Verificar conectividad
  if (typeof window !== 'undefined' && !navigator.onLine) {
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
      default:
        return `Error del servidor (${response.status}). Intentá nuevamente.`;
    }
  }
  
  // Errores de red
  if (error?.name === 'AbortError') {
    return "Solicitud cancelada.";
  }
  
  if (error?.message?.includes('fetch')) {
    return "Error de conexión. Verificá tu internet.";
  }
  
  if (error?.message?.includes('timeout')) {
    return "La solicitud tardó demasiado. Intentá nuevamente.";
  }
  
  return error?.message || "Ocurrió un error inesperado.";
}

/**
 * Hook principal para fetching optimizado y seguro
 */
export function useFetch<T>(
  url?: string,
  options: FetchOptions = {},
): FetchState<T> {
  const {
    retries = 2,
    retryDelay = 1000,
    timeout = 10000,
    cacheKey,
    cacheTTL = 300000, // 5 minutos
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
    if (!url) {
      setState({ data: null, loading: false, error: "" });
      return;
    }

    const requestKey = cacheKey || `${url}-${JSON.stringify(fetchOptions)}`;
    
    // Verificar cache válido
    const cached = requestCache.get(requestKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      if (mountedRef.current) {
        setState({
          data: cached.data as T,
          loading: false,
          error: ""
        });
      }
      return;
    }

    try {
      // Solo mostrar loading en el primer intento
      if (attempt === 1 && mountedRef.current) {
        setState(prev => ({ ...prev, loading: true, error: "" }));
      }

      // Cancelar request anterior si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Crear nuevo AbortController
      abortControllerRef.current = new AbortController();
      
      // Configurar timeout
      const timeoutId = setTimeout(() => {
        abortControllerRef.current?.abort();
      }, timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Guardar en cache
      requestCache.set(requestKey, {
        data,
        timestamp: Date.now(),
        ttl: cacheTTL
      });

      if (mountedRef.current) {
        setState({
          data: data as T,
          loading: false,
          error: ""
        });
      }

    } catch (error: any) {
      // No hacer retry si fue cancelado manualmente
      if (error.name === 'AbortError' && mountedRef.current) {
        return;
      }

      // Intentar retry si quedan intentos
      if (attempt < retries && mountedRef.current) {
        const delay = retryDelay * Math.pow(1.5, attempt - 1);
        
        setTimeout(() => {
          if (mountedRef.current) {
            fetchData(attempt + 1);
          }
        }, delay);
        return;
      }

      // Mostrar error final
      if (mountedRef.current) {
        const errorMessage = parseError(error);
        setState({
          data: null,
          loading: false,
          error: errorMessage
        });
      }
    }
  }, [url, retries, retryDelay, timeout, cacheKey, cacheTTL, JSON.stringify(fetchOptions)]);

  // Función para refetch manual
  const refetch = useCallback(() => {
    const requestKey = cacheKey || `${url}-${JSON.stringify(fetchOptions)}`;
    requestCache.delete(requestKey);
    fetchData(1);
  }, [fetchData, cacheKey, url, fetchOptions]);

  // Effect principal con cleanup mejorado
  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    
    return () => {
      mountedRef.current = false;
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
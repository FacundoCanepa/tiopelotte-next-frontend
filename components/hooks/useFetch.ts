import { useState, useEffect, useCallback, useRef } from "react";
import { apiCall } from "@/lib/api";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string;
}

// Cache simple para requests
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export function useFetch<T>(
  url?: string,
  options?: RequestInit,
  transform?: (json: any) => T,
  cacheKey?: string
) : FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(!!url);
  const [error, setError] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) return;

    // Verificar cache
    const key = cacheKey || url;
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      const value = transform ? transform(cached.data) : cached.data.data ?? cached.data;
      setData(value);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const result = await apiCall(url, options);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      const json = result.data;
      
      // Guardar en cache
      cache.set(key, { data: json, timestamp: Date.now() });
      
      const value = transform ? transform(json) : json.data ?? json;
      setData(value);
    } catch (err: any) {
      setError(err.message || "Error al cargar datos");
      console.error("useFetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(options), transform, cacheKey]);

  useEffect(() => {
    fetchData();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  return { data, loading, error };
}
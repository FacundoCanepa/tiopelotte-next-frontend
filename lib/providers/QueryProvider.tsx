"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

/**
 * Provider de React Query optimizado para e-commerce
 * Configuración específica para manejo de datos de productos y pedidos
 */
export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache por 5 minutos para datos de productos
            staleTime: 5 * 60 * 1000,
            // Mantener en cache por 10 minutos
            gcTime: 10 * 60 * 1000,
            // Retry automático para requests fallidos
            retry: (failureCount, error: any) => {
              // No retry para errores 4xx
              if (error?.status >= 400 && error?.status < 500) {
                return false;
              }
              // Máximo 2 reintentos para otros errores
              return failureCount < 2;
            },
            // Refetch en focus para datos críticos
            refetchOnWindowFocus: false,
            // Refetch en reconexión
            refetchOnReconnect: true,
          },
          mutations: {
            // Retry para mutaciones críticas (checkout, etc.)
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
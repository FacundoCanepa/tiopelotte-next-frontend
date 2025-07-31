/**
 * Estados de carga profesionales para toda la aplicación
 * Componentes reutilizables con animaciones suaves
 */

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
}

export function LoadingSpinner({ 
  size = "md", 
  className, 
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 className={cn("animate-spin text-[#8B4513]", sizeClasses[size])} />
      {text && (
        <p className="text-sm text-[#8B4513] font-medium">{text}</p>
      )}
    </div>
  );
}

// Loading para productos
export function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-8 bg-gray-200 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Loading para carrusel
export function CarouselLoading() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="min-w-[280px] bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-8 bg-gray-200 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Loading para página completa
export function PageLoading({ message = "Cargando..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-[#FBE6D4] flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="xl" />
        <div className="space-y-2">
          <h2 className="text-xl font-garamond italic text-[#8B4513]">
            {message}
          </h2>
          <p className="text-sm text-stone-600">
            Preparando todo con amor artesanal 🍝
          </p>
        </div>
      </div>
    </div>
  );
}

// Loading para formularios
export function FormLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

// Loading para tabla
export function TableLoading({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="p-4 border-b">
        <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex gap-4">
            {Array.from({ length: cols }).map((_, j) => (
              <div key={j} className="h-4 bg-gray-200 rounded flex-1 animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
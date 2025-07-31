/**
 * Componente LoadingSpinner optimizado para accesibilidad y UX
 * 
 * Mejoras implementadas:
 * - ARIA labels descriptivos para screen readers
 * - Múltiples variantes visuales según contexto
 * - Reducción de animación para usuarios con preferencias de movimiento
 * - Colores consistentes con la paleta de TÍO PELOTTE
 * - Indicadores de progreso opcionales
 */

"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "accent" | "muted";
  className?: string;
  label?: string;
  showLabel?: boolean;
  progress?: number; // 0-100 para mostrar progreso opcional
  inline?: boolean; // Para uso inline vs block
}

export default function LoadingSpinner({ 
  size = "md", 
  variant = "primary",
  className,
  label = "Cargando contenido",
  showLabel = false,
  progress,
  inline = false
}: LoadingSpinnerProps) {
  
  // Mapeo de tamaños optimizado para diferentes contextos
  const sizeClasses = {
    xs: "w-3 h-3 border",
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-2",
    xl: "w-16 h-16 border-4"
  };

  // Variantes de color consistentes con el tema de TÍO PELOTTE
  const variantClasses = {
    primary: "border-[#8B4513] border-t-transparent",
    secondary: "border-[#FFD966] border-t-transparent", 
    accent: "border-[#D16A45] border-t-transparent",
    muted: "border-gray-300 border-t-transparent"
  };

  // Clases para el contenedor según el contexto
  const containerClasses = cn(
    inline ? "inline-flex items-center gap-2" : "flex flex-col items-center justify-center gap-3",
    className
  );

  return (
    <div 
      className={containerClasses}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      {/* Spinner principal */}
      <div 
        className={cn(
          // Clases base del spinner
          "animate-spin rounded-full border-solid",
          sizeClasses[size],
          variantClasses[variant],
          // Respetar preferencias de movimiento reducido
          "motion-reduce:animate-pulse motion-reduce:animate-none"
        )}
        aria-hidden="true"
      >
        {/* Indicador de progreso circular opcional */}
        {progress !== undefined && (
          <div 
            className="absolute inset-0 rounded-full border-transparent"
            style={{
              background: `conic-gradient(from 0deg, transparent ${360 - (progress * 3.6)}deg, currentColor ${360 - (progress * 3.6)}deg)`
            }}
          />
        )}
      </div>

      {/* Texto de loading opcional */}
      {showLabel && (
        <span 
          className={cn(
            "text-sm font-medium",
            variant === "primary" && "text-[#8B4513]",
            variant === "secondary" && "text-[#5A3E1B]", 
            variant === "accent" && "text-[#D16A45]",
            variant === "muted" && "text-gray-600",
            inline && "sr-only" // Ocultar visualmente en modo inline pero mantener para screen readers
          )}
        >
          {label}
          {progress !== undefined && ` (${Math.round(progress)}%)`}
        </span>
      )}

      {/* Texto para screen readers (siempre presente) */}
      <span className="sr-only">
        {label}
        {progress !== undefined && `. Progreso: ${Math.round(progress)} por ciento`}
      </span>
    </div>
  );
}

/**
 * Variante específica para carga de productos
 * Incluye mensaje contextual y animación suave
 */
export function ProductLoadingSpinner({ message = "Cargando deliciosas pastas..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
      <LoadingSpinner size="lg" variant="primary" />
      <div className="space-y-2">
        <p className="text-lg font-garamond italic text-[#8B4513]">
          {message}
        </p>
        <p className="text-sm text-stone-600 max-w-md">
          El Tío Pelotte está preparando todo con amor artesanal 🍝
        </p>
      </div>
    </div>
  );
}

/**
 * Variante para carrusel de productos
 * Optimizada para espacios reducidos
 */
export function CarouselLoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-[400px] w-full">
      <div className="text-center space-y-3">
        <LoadingSpinner size="md" variant="secondary" />
        <p className="text-sm font-garamond italic text-[#8B4513]">
          Preparando recomendaciones especiales...
        </p>
      </div>
    </div>
  );
}

/**
 * Variante para botones con loading state
 * Mantiene las dimensiones del botón original
 */
interface ButtonLoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function ButtonLoadingSpinner({ 
  size = "sm", 
  label = "Procesando" 
}: ButtonLoadingSpinnerProps) {
  return (
    <div className="inline-flex items-center gap-2">
      <LoadingSpinner 
        size={size} 
        variant="secondary" 
        inline 
        label={label}
      />
      <span className="font-medium">{label}...</span>
    </div>
  );
}

/**
 * Skeleton loader para mantener layout durante carga
 * Previene Cumulative Layout Shift (CLS)
 */
interface SkeletonLoaderProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: boolean;
}

export function SkeletonLoader({ 
  width = "100%", 
  height = "20px",
  className,
  rounded = false 
}: SkeletonLoaderProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]",
        rounded ? "rounded-full" : "rounded-md",
        "motion-reduce:animate-none motion-reduce:bg-gray-200",
        className
      )}
      style={{ width, height }}
      role="presentation"
      aria-label="Cargando contenido"
    />
  );
}

/**
 * Loading overlay para modales y formularios
 * Bloquea la interacción durante procesos críticos
 */
interface LoadingOverlayProps {
  show: boolean;
  message?: string;
  backdrop?: boolean;
}

export function LoadingOverlay({ 
  show, 
  message = "Procesando tu solicitud",
  backdrop = true 
}: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        backdrop && "bg-black/20 backdrop-blur-sm"
      )}
      role="dialog"
      aria-modal="true"
      aria-label={message}
    >
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm mx-4">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" variant="primary" />
          <div>
            <p className="font-semibold text-[#8B4513] mb-1">{message}</p>
            <p className="text-sm text-stone-600">
              Por favor, no cierres esta ventana...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
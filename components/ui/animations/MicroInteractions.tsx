/**
 * Componentes de micro-interactions sutiles para mejorar UX
 * 
 * Implementaciones:
 * - Animaciones CSS puras para mejor performance
 * - Respeto por prefers-reduced-motion
 * - Efectos hover sutiles que mejoran feedback
 * - Transiciones suaves y profesionales
 * - Diseño coherente con marca Tío Pelotte
 */

"use client";

import { cn } from "@/lib/utils";
import { useState, useCallback, useEffect } from "react";

/**
 * Botón con micro-interactions optimizadas
 */
interface InteractiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

export function InteractiveButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className,
  disabled = false,
  loading = false,
  ...props
}: InteractiveButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = useCallback(() => {
    if (!disabled && !loading) {
      setIsPressed(true);
    }
  }, [disabled, loading]);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPressed(false);
  }, []);

  const variants = {
    primary: "bg-[#8B4513] text-white hover:bg-[#6B3410] active:bg-[#5A2D0E]",
    secondary: "bg-[#FFD966] text-[#8B4513] hover:bg-[#F5C741] active:bg-[#E6B432]",
    outline: "border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white",
    ghost: "text-[#8B4513] hover:bg-[#FBE6D4] active:bg-[#F5DCC4]"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      className={cn(
        // Estilos base
        "relative overflow-hidden font-semibold rounded-xl transition-all duration-200 ease-out",
        "focus:outline-none focus:ring-4 focus:ring-[#FFD966]/30",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        
        // Transform suave en hover/active
        "transform hover:scale-[1.02] active:scale-[0.98]",
        "motion-reduce:transform-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100",
        
        // Sombra dinámica
        !disabled && !loading && "shadow-sm hover:shadow-md",
        isPressed && "shadow-inner",
        
        // Variantes y tamaños
        variants[variant],
        sizes[size],
        
        // Estados especiales
        loading && "cursor-wait",
        disabled && "transform-none shadow-none",
        
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {/* Efecto ripple sutil */}
      <span className="absolute inset-0 bg-white/10 rounded-xl opacity-0 transition-opacity duration-200 hover:opacity-100" />
      
      {/* Contenido */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </span>
    </button>
  );
}

/**
 * Card con hover effects sutiles
 */
interface InteractiveCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  hoverable?: boolean;
  elevated?: boolean;
}

export function InteractiveCard({
  children,
  onClick,
  className,
  hoverable = true,
  elevated = false
}: InteractiveCardProps) {
  return (
    <div
      className={cn(
        // Estilos base
        "bg-white rounded-2xl border border-[#E6D2B5] transition-all duration-300 ease-out",
        
        // Estados interactivos
        hoverable && [
          "cursor-pointer",
          "hover:shadow-lg hover:-translate-y-1",
          "hover:border-[#FFD966]",
          "active:translate-y-0 active:shadow-md"
        ],
        
        // Elevación inicial
        elevated ? "shadow-lg" : "shadow-sm",
        
        // Respeto por reduced motion
        "motion-reduce:transform-none motion-reduce:hover:translate-y-0",
        
        onClick && "select-none",
        
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

/**
 * Input con micro-feedback visual
 */
interface InteractiveInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
}

export function InteractiveInput({
  error = false,
  success = false,
  className,
  ...props
}: InteractiveInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <input
      className={cn(
        // Estilos base
        "w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ease-out",
        "bg-white text-[#5A3E1B] placeholder:text-gray-400",
        "focus:outline-none focus:ring-0",
        
        // Estados de validación
        error && "border-red-300 bg-red-50/30 focus:border-red-500",
        success && "border-green-300 bg-green-50/30 focus:border-green-500",
        !error && !success && "border-[#E6D2B5] focus:border-[#FFD966] hover:border-[#F5D3A9]",
        
        // Efecto de focus
        isFocused && !error && !success && "shadow-lg shadow-[#FFD966]/20 scale-[1.01]",
        "motion-reduce:scale-100",
        
        className
      )}
      onFocus={(e) => {
        setIsFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        props.onBlur?.(e);
      }}
      {...props}
    />
  );
}

/**
 * Link con animación de underline
 */
interface AnimatedLinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  external?: boolean;
}

export function AnimatedLink({
  children,
  href,
  className,
  external = false
}: AnimatedLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "relative inline-block text-[#8B4513] font-medium transition-colors duration-200",
        "hover:text-[#5A3E1B]",
        "after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-0",
        "after:bg-[#FFD966] after:transition-all after:duration-300 after:ease-out",
        "hover:after:w-full",
        "focus:outline-none focus:ring-2 focus:ring-[#FFD966]/50 focus:rounded-sm",
        className
      )}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

/**
 * Badge con pulse effect sutil
 */
interface PulseBadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error";
  pulse?: boolean;
  className?: string;
}

export function PulseBadge({
  children,
  variant = "default",
  pulse = false,
  className
}: PulseBadgeProps) {
  const variants = {
    default: "bg-[#FBE6D4] text-[#8B4513] border-[#E6D2B5]",
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    error: "bg-red-50 text-red-700 border-red-200"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border",
        "transition-all duration-200",
        variants[variant],
        pulse && "animate-pulse",
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * Loading dots animados
 */
export function LoadingDots({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "w-1 h-1",
    md: "w-2 h-2", 
    lg: "w-3 h-3"
  };

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "bg-current rounded-full animate-pulse",
            sizes[size]
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: "1s"
          }}
        />
      ))}
    </div>
  );
}

/**
 * Contador animado para números
 */
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 1000,
  className
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(value * easeOut));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return (
    <span className={cn("font-bold tabular-nums", className)}>
      {displayValue.toLocaleString('es-AR')}
    </span>
  );
}
/**
 * Componente FormField optimizado para UX y accesibilidad
 * 
 * Características implementadas:
 * - Validación en tiempo real
 * - Estados de error claros
 * - Iconos contextuales
 * - Animaciones suaves
 * - Accesibilidad completa (ARIA labels, roles)
 * - Soporte para diferentes tipos de campo
 */

"use client";

import { useState, useCallback, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: string;
  icon?: React.ReactNode;
  helperText?: string;
  variant?: "default" | "floating";
  showPasswordToggle?: boolean;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({
    label,
    error,
    success,
    icon,
    helperText,
    variant = "default",
    showPasswordToggle = false,
    type = "text",
    className,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

    const handleFocus = useCallback(() => {
      setIsFocused(true);
    }, []);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      props.onBlur?.(e);
    }, [props]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    }, [props]);

    const inputType = showPasswordToggle && type === "password" 
      ? (showPassword ? "text" : "password") 
      : type;

    const fieldId = props.id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="w-full">
        {/* Label */}
        <div className="relative">
          {variant === "floating" ? (
            <label
              htmlFor={fieldId}
              className={cn(
                "absolute left-3 transition-all duration-200 pointer-events-none z-10 font-medium",
                (isFocused || hasValue) 
                  ? "top-2 text-xs text-[#8B4513] bg-white px-1 -translate-y-1/2" 
                  : "top-1/2 text-sm text-gray-500 -translate-y-1/2"
              )}
            >
              {label}
            </label>
          ) : (
            <label
              htmlFor={fieldId}
              className="block text-sm font-medium text-[#8B4513] mb-2"
            >
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}

          {/* Input Container */}
          <div className="relative">
            {/* Icon izquierdo */}
            {icon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B4513] z-10">
                {icon}
              </div>
            )}

            {/* Input */}
            <input
              ref={ref}
              id={fieldId}
              type={inputType}
              className={cn(
                // Estilos base
                "w-full px-4 py-3 rounded-xl border-2 transition-all duration-200",
                "bg-white text-[#5A3E1B] placeholder:text-gray-400",
                "focus:outline-none focus:ring-0",
                
                // Padding condicional por icon
                icon && "pl-11",
                showPasswordToggle && "pr-11",
                
                // Estados de validación
                error 
                  ? "border-red-300 focus:border-red-500 bg-red-50/30" 
                  : success
                  ? "border-green-300 focus:border-green-500 bg-green-50/30"
                  : "border-[#E6D2B5] focus:border-[#FFD966] hover:border-[#F5D3A9]",
                
                // Estado de focus
                isFocused && !error && !success && "shadow-lg shadow-[#FFD966]/20",
                
                // Variante floating
                variant === "floating" && "pt-6 pb-2",
                
                className
              )}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              aria-invalid={!!error}
              aria-describedby={
                error ? `${fieldId}-error` : 
                success ? `${fieldId}-success` : 
                helperText ? `${fieldId}-helper` : undefined
              }
              {...props}
            />

            {/* Password Toggle */}
            {showPasswordToggle && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B4513] hover:text-[#5A3E1B] transition-colors"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            )}

            {/* Success/Error Icons */}
            {(success || error) && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {success && <CheckCircle size={20} className="text-green-500" />}
                {error && <AlertCircle size={20} className="text-red-500" />}
              </div>
            )}
          </div>
        </div>

        {/* Helper Text / Error / Success */}
        <div className="mt-2 min-h-[20px]">
          {error && (
            <p 
              id={`${fieldId}-error`}
              className="text-sm text-red-600 flex items-start gap-1 animate-in slide-in-from-top-1 duration-200"
              role="alert"
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {error}
            </p>
          )}
          
          {success && !error && (
            <p 
              id={`${fieldId}-success`}
              className="text-sm text-green-600 flex items-start gap-1 animate-in slide-in-from-top-1 duration-200"
            >
              <CheckCircle size={16} className="mt-0.5 shrink-0" />
              {success}
            </p>
          )}
          
          {helperText && !error && !success && (
            <p 
              id={`${fieldId}-helper`}
              className="text-sm text-gray-500"
            >
              {helperText}
            </p>
          )}
        </div>
      </div>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;
"use client";

import { ReactNode } from "react";

/**
 * Tarjeta de resumen mejorada para el dashboard administrativo
 * 
 * Características:
 * - Diseño visual atractivo con gradientes sutiles
 * - Iconos con colores temáticos
 * - Subtítulos informativos opcionales
 * - Animaciones hover suaves
 * - Responsive design optimizado
 */

interface Props {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  color?: string;
  trend?: "up" | "down" | "neutral";
}

export default function ResumenCard({ 
  title, 
  value, 
  icon, 
  subtitle, 
  color = "bg-[#8B4513]",
  trend = "neutral" 
}: Props) {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600", 
    neutral: "text-gray-600"
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-[#E6D2B5] p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group">
      {/* Gradiente decorativo sutil */}
      <div className={`absolute top-0 right-0 w-20 h-20 ${color} opacity-10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-300`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-[#8B4513]/70 uppercase tracking-wide mb-2">
              {title}
            </p>
            <p className="text-3xl font-bold text-[#5A3E1B] mb-1 font-garamond">
              {value}
            </p>
            {subtitle && (
              <p className={`text-sm ${trendColors[trend]} font-medium`}>
                {subtitle}
              </p>
            )}
          </div>
          
          <div className={`p-3 rounded-xl ${color} text-white shadow-lg group-hover:scale-110 transition-transform duration-200`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}
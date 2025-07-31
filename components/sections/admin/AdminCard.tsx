"use client";

import Link from "next/link";
import { ReactNode } from "react";

/**
 * Tarjeta administrativa mejorada para navegación del panel
 * 
 * Características:
 * - Diseño moderno con gradientes y sombras
 * - Animaciones hover suaves
 * - Badges opcionales para roles
 * - Descripciones informativas
 * - Colores temáticos personalizables
 */
interface Props {
  href: string;
  title: string;
  icon: ReactNode;
  description?: string;
  color?: string;
  badge?: string;
}

export default function AdminCard({ 
  href, 
  title, 
  icon, 
  description, 
  color = "bg-gradient-to-br from-[#8B4513] to-[#6B3410]",
  badge 
}: Props) {
  return (
    <Link
      href={href}
      className="group relative bg-white rounded-2xl shadow-lg border border-[#E6D2B5] p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
    >
      {/* Gradiente decorativo */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-300`} />
      
      {/* Badge opcional */}
      {badge && (
        <div className="absolute top-4 right-4 bg-[#FFD966] text-[#5A3E1B] text-xs font-bold px-2 py-1 rounded-full">
          {badge}
        </div>
      )}
      
      <div className="relative z-10 text-center space-y-4">
        {/* Icono */}
        <div className={`inline-flex p-4 rounded-2xl ${color} text-white shadow-lg group-hover:scale-110 transition-transform duration-200`}>
          {icon}
        </div>
        
        {/* Título */}
        <div>
          <h3 className="font-bold text-[#5A3E1B] text-lg font-garamond mb-2">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-[#8B4513]/70 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        
        {/* Indicador de acción */}
        <div className="flex items-center justify-center text-[#D16A45] group-hover:text-[#B8472E] transition-colors">
          <span className="text-sm font-medium">Acceder →</span>
        </div>
      </div>
    </Link>
  );
}
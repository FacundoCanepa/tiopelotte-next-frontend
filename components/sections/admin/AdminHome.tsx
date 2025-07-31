"use client";
import { useUserStore } from "@/store/user-store";
import { BarChart2, Boxes, UtensilsCrossed, Wheat, Users, TrendingUp, Calendar, Settings } from "lucide-react";
import AdminCard from "./AdminCard";

export default function AdminHome() {
  const user = useUserStore((s) => s.user);
  const isAdmin = user?.role === "Administrador" || user?.role === "administrador";

  return (
    <div className="space-y-8 bg-[#FBE6D4] min-h-screen p-6">
      {/* Header mejorado */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E6D2B5]">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-4 bg-[#FFD966] rounded-2xl">
            <Settings className="w-8 h-8 text-[#5A3E1B]" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#8B4513] font-garamond">
              Panel de Administración
            </h1>
            <p className="text-[#5A3E1B] text-lg">
              Bienvenido, {user?.username} - Gestiona tu negocio desde aquí
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 p-4 bg-[#FFF8EC] rounded-xl">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#D16A45] font-garamond">
              {new Date().toLocaleDateString("es-AR", { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <p className="text-sm text-[#5A3E1B]">Fecha actual</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#6B8E23] font-garamond">
              🍝 Tío Pelotte
            </div>
            <p className="text-sm text-[#5A3E1B]">Sistema administrativo</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#8B4513] font-garamond">
              v2.0
            </div>
            <p className="text-sm text-[#5A3E1B]">Versión optimizada</p>
          </div>
        </div>
      </div>

      {/* Sección principal de navegación */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[#8B4513] font-garamond flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Módulos del Sistema
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isAdmin && (
            <AdminCard 
              href="/admin/dashboard" 
              title="Dashboard Económico" 
              icon={<BarChart2 className="h-10 w-10" />}
              description="Análisis de ventas, métricas y reportes financieros"
              color="bg-gradient-to-br from-blue-500 to-blue-600"
              badge="Admin"
            />
          )}
          
          <AdminCard 
            href="/admin/pedidos" 
            title="Gestión de Pedidos" 
            icon={<Boxes className="h-10 w-10" />}
            description="Administra pedidos, estados y seguimiento de entregas"
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          
          <AdminCard 
            href="/admin/productos" 
            title="Catálogo de Productos" 
            icon={<UtensilsCrossed className="h-10 w-10" />}
            description="Crea, edita y gestiona pastas y productos del menú"
            color="bg-gradient-to-br from-orange-500 to-orange-600"
          />
          
          <AdminCard 
            href="/admin/ingredientes" 
            title="Control de Ingredientes" 
            icon={<Wheat className="h-10 w-10" />}
            description="Gestiona stock, precios y disponibilidad de ingredientes"
            color="bg-gradient-to-br from-yellow-500 to-yellow-600"
          />
          
          {isAdmin && (
            <AdminCard 
              href="/admin/usuarios" 
              title="Administrar Usuarios" 
              icon={<Users className="h-10 w-10" />}
              description="Gestiona empleados, roles y permisos del sistema"
              color="bg-gradient-to-br from-purple-500 to-purple-600"
              badge="Admin"
            />
          )}
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E6D2B5]">
        <h3 className="text-xl font-bold text-[#8B4513] font-garamond mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Accesos Rápidos
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/admin/pedidos?estado=Pendiente"
            className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl hover:bg-yellow-100 transition-all text-center group"
          >
            <div className="text-2xl font-bold text-yellow-600 group-hover:scale-110 transition-transform">
              ⏳
            </div>
            <p className="text-sm font-medium text-yellow-800 mt-2">
              Pedidos Pendientes
            </p>
          </a>
          
          <a
            href="/admin/productos?stock=bajo"
            className="p-4 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-all text-center group"
          >
            <div className="text-2xl font-bold text-red-600 group-hover:scale-110 transition-transform">
              📦
            </div>
            <p className="text-sm font-medium text-red-800 mt-2">
              Stock Bajo
            </p>
          </a>
          
          <a
            href="/admin/dashboard"
            className="p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-all text-center group"
          >
            <div className="text-2xl font-bold text-green-600 group-hover:scale-110 transition-transform">
              📊
            </div>
            <p className="text-sm font-medium text-green-800 mt-2">
              Reportes del Día
            </p>
          </a>
          
          <a
            href="/productos"
            className="p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-all text-center group"
          >
            <div className="text-2xl font-bold text-blue-600 group-hover:scale-110 transition-transform">
              🍝
            </div>
            <p className="text-sm font-medium text-blue-800 mt-2">
              Ver Tienda
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
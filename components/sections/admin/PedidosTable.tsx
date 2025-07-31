"use client";

import { useState } from "react";
import { Copy, Loader2, Eye, Phone, MapPin, CreditCard, Package } from "lucide-react";
import { toast } from "sonner";

/*
 * Tabla de pedidos optimizada para el dashboard administrativo
 * 
 * Mejoras implementadas:
 * - Diseño visual más profesional
 * - Estados con badges coloridos
 * - Acciones rápidas mejoradas
 * - Responsive design optimizado
 * - Hover effects sutiles
 * - Iconografía descriptiva
 */

interface Pedido {
  id: number;
  documentId: string;
  estado: string;
  total: number;
  tipoPago: string;
  tipoEntrega: string;
  createdAt: string;
  telefono: string;
  nombre: string;
}

interface Props {
  pedidos: Pedido[];
}

export default function PedidosTable({ pedidos }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const copiar = (texto: string) => {
    navigator.clipboard.writeText(texto);
    toast.success("Teléfono copiado");
  };

  const actualizarEstado = async (documentId: string, nuevoEstado: string) => {
    setLoadingId(documentId);
    try {
      const res = await fetch(`/api/pedidos/${documentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Error al actualizar");

      toast.success("Estado actualizado con éxito");
    } catch (err: any) {
      toast.error("No se pudo actualizar el estado");
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const badges = {
      "Pendiente": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "En camino": "bg-blue-100 text-blue-800 border-blue-200", 
      "Entregado": "bg-green-100 text-green-800 border-green-200",
      "Cancelado": "bg-red-100 text-red-800 border-red-200"
    };
    
    return badges[estado as keyof typeof badges] || "bg-gray-100 text-gray-800 border-gray-200";
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-[#E6D2B5] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E6D2B5] bg-gradient-to-r from-[#FBE6D4] to-[#F5DCC4]">
        <h2 className="text-2xl font-bold text-[#8B4513] font-garamond flex items-center gap-2">
          📦 Gestión de Pedidos
        </h2>
        <p className="text-sm text-[#5A3E1B] mt-1">
          {pedidos.length} pedidos encontrados
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#FBE6D4] text-[#5A3E1B]">
            <tr>
              <th className="p-4 text-left font-semibold">📅 Fecha</th>
              <th className="p-4 text-left font-semibold">👤 Cliente</th>
              <th className="p-4 text-left font-semibold">💰 Total</th>
              <th className="p-4 text-left font-semibold">💳 Pago</th>
              <th className="p-4 text-left font-semibold">🚚 Entrega</th>
              <th className="p-4 text-left font-semibold">📋 Estado</th>
              <th className="p-4 text-left font-semibold">📞 Contacto</th>
              <th className="p-4 text-center font-semibold">⚡ Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6D2B5]">
            {pedidos.map((p) => {
              const fecha = new Date(p.createdAt).toLocaleDateString("es-AR", {
                day: '2-digit',
                month: 'short',
                year: '2-digit'
              });
              const total = `$${p.total.toLocaleString("es-AR")}`;
              const linkWhatsApp = `https://wa.me/54${p.telefono}`;
              const isExpanded = expandedId === p.documentId;

              return (
                <tr 
                  key={p.id} 
                  className="hover:bg-[#FFF8EC] transition-colors duration-150 border-b border-[#E6D2B5]/50"
                >
                  <td className="p-4 whitespace-nowrap font-medium text-[#5A3E1B]">
                    {fecha}
                  </td>
                  
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#FFD966] rounded-full flex items-center justify-center text-[#5A3E1B] font-bold text-xs">
                        {p.nombre?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <span className="font-medium text-[#5A3E1B] capitalize">
                        {p.nombre}
                      </span>
                    </div>
                  </td>
                  
                  <td className="p-4 whitespace-nowrap">
                    <span className="font-bold text-[#D16A45] text-base">
                      {total}
                    </span>
                  </td>
                  
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <CreditCard className="w-4 h-4 text-[#8B4513]" />
                      <span className="capitalize text-[#5A3E1B]">
                        {p.tipoPago}
                      </span>
                    </div>
                  </td>
                  
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-[#8B4513]" />
                      <span className="capitalize text-[#5A3E1B]">
                        {p.tipoEntrega}
                      </span>
                    </div>
                  </td>
                  
                  <td className="p-4 whitespace-nowrap">
                    <select
                      className={`border-2 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${getEstadoBadge(p.estado)} focus:ring-2 focus:ring-[#FFD966] focus:border-transparent`}
                      value={p.estado}
                      onChange={(e) => actualizarEstado(p.documentId, e.target.value)}
                      disabled={loadingId === p.documentId}
                    >
                      <option value="Pendiente">⏳ Pendiente</option>
                      <option value="En camino">🚚 En camino</option>
                      <option value="Entregado">✅ Entregado</option>
                      <option value="Cancelado">❌ Cancelado</option>
                    </select>
                    {loadingId === p.documentId && (
                      <Loader2 className="inline ml-2 w-4 h-4 animate-spin text-[#8B4513]" />
                    )}
                  </td>
                  
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <a
                        href={linkWhatsApp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium hover:underline transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        {p.telefono}
                      </a>
                      <button
                        onClick={() => copiar(p.telefono)}
                        className="p-1 text-[#8B4513] hover:text-[#5A3E1B] hover:bg-[#FFD966]/20 rounded transition-all"
                        title="Copiar teléfono"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : p.documentId)}
                      className="p-2 text-[#8B4513] hover:text-[#5A3E1B] hover:bg-[#FFD966]/20 rounded-lg transition-all"
                      title={isExpanded ? "Ocultar detalles" : "Ver detalles"}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {pedidos.length === 0 && (
        <div className="text-center py-12 text-[#8B4513]">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-garamond">No hay pedidos que mostrar</p>
          <p className="text-sm text-[#5A3E1B] mt-1">Ajustá los filtros para ver más resultados</p>
        </div>
      )}
    </div>
  );
}
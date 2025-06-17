"use client";

import { usePedidoContext } from "./PedidoProvider";
import Image from "next/image";
import { useGetProductByName } from "@/components/hooks/useGetProductByName";
import SkeletonConsultarPedido from "@/components/ui/SkeletonConsultarPedido";

function EstadoBadge({ estado }: { estado: string }) {
  const color =
    estado === "Pendiente"
      ? "bg-[#FFD966] text-[#5A3E1B]"
      : estado === "En camino"
      ? "bg-[#6B8E23] text-white"
      : estado === "Entregado"
      ? "bg-green-600 text-white"
      : estado === "Cancelado"
      ? "bg-red-600 text-white"
      : "bg-gray-400 text-white";

  return (
    <span className={`inline-block text-sm font-semibold px-3 py-1 rounded-full ${color}`}>
      {estado}
    </span>
  );
}

function PedidoInfoCard({ pedido }: { pedido: any }) {
  return (
    <div className="text-sm text-[#5A3E1B] bg-white rounded-lg p-4 shadow space-y-1">
      <p><strong>Nombre:</strong> {pedido.nombre}</p>
      <p><strong>Total:</strong> ${pedido.total.toLocaleString("es-AR")}</p>
      <p><strong>Entrega:</strong> {pedido.tipoEntrega}</p>
      <p><strong>Pago:</strong> {pedido.tipoPago}</p>
      <p><strong>Zona:</strong> {pedido.zona}</p>
      <p><strong>Dirección:</strong> {pedido.direccion}</p>
      <p><strong>Referencias:</strong> {pedido.referencias}</p>
    </div>
  );
}

function ProductoItemCard({ item }: { item: any }) {
  const productName = item.product_name || item.productName;
  const { product, loading, error } = useGetProductByName(productName);

  if (loading) return <SkeletonConsultarPedido />;

  if (error) {
    console.error("❌ Error al buscar producto:", error);
    return (
      <div className="text-sm text-red-600 bg-white px-4 py-3 rounded-md shadow">
        Error al cargar <strong>{productName}</strong>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="flex items-center gap-4 bg-white rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition">
      <div className="w-20 h-20 relative rounded overflow-hidden">
        <Image
          src={product.img?.[0]?.url || "/placeholder.jpg"}
          alt={product.productName}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 text-sm">
        <p className="font-semibold text-[#8B4513] text-base mb-1">{product.productName}</p>
        <p className="text-xs text-[#5A3E1B]">{product.descriptionCorta}</p>
        <p className="text-xs text-[#5A3E1B] mt-1">
          {item.title} — ${item.unit_price.toLocaleString("es-AR")}
        </p>
      </div>
    </div>
  );
}

export default function PedidoResultado() {
  const { pedido, error } = usePedidoContext();

  if (error)
    return <p className="text-red-600 text-sm text-center mt-4">{error}</p>;

  if (!pedido) return null;

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#5A3E1B]">Estado del pedido:</h2>
        <EstadoBadge estado={pedido.estado} />
      </div>

      <PedidoInfoCard pedido={pedido} />

      <div>
        <h3 className="font-semibold text-[#5A3E1B] mb-3">Productos:</h3>
        <div className="space-y-3">
          {pedido.items
            .filter((item: any) => item.product_name || item.productName)
            .map((item: any, index: number) => (
              <ProductoItemCard key={index} item={item} />
            ))}
        </div>
      </div>
    </div>
  );
}

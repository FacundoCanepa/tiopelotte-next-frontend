"use client";
import { usePedidoContext } from "./PedidoProvider";

import Image from "next/image";

export default function PedidoResultado() {

  const { pedido, error } = usePedidoContext();

  if (error)
    return <p className="text-red-600 text-sm text-center mt-4">{error}</p>;

  if (!pedido) return null;

  const p = pedido;

  return (
    <div className="mt-6 space-y-4 border-t pt-4">
      <h2 className="text-lg font-semibold text-[#5A3E1B]">Estado del pedido:</h2>
      <p className="text-base text-[#5A3E1B]">{p.estado}</p>

      <div className="text-sm text-[#5A3E1B]">
        <p><strong>Nombre:</strong> {p.nombre}</p>
        <p><strong>Total:</strong> ${p.total.toLocaleString("es-AR")}</p>
        <p><strong>Entrega:</strong> {p.tipoEntrega}</p>
        <p><strong>Pago:</strong> {p.tipoPago}</p>
        <p><strong>Zona:</strong> {p.zona}</p>
        <p><strong>Dirección:</strong> {p.direccion}</p>
        <p><strong>Referencias:</strong> {p.referencias}</p>
        <p><strong>Fecha:</strong> {new Date(p.createdAt).toLocaleString("es-AR")}</p>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-[#5A3E1B] mb-2">Productos:</h3>
        <div className="space-y-2">
          {p.items.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-4 bg-white rounded-md px-3 py-2 shadow">
              <div className="w-14 h-14 relative">
                <Image src={item.img} alt={item.productName} fill className="object-cover rounded" />
              </div>
              <div className="flex-1 text-sm">
                <p className="font-medium text-[#8B4513]">{item.productName}</p>
                <p className="text-xs text-[#5A3E1B]">
                  {item.quantity} {item.unidadMedida} — ${item.subtotal.toLocaleString("es-AR")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

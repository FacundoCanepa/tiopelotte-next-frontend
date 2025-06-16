"use client";

import { usePedidoContext } from "./PedidoProvider";


export default function ConsultarPedidoForm() {
  const { telefono, setTelefono, buscarPedido, loading } = usePedidoContext();


  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Ingresá tu número de teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        className="w-full border border-[#E0E0E0] rounded-md px-4 py-2 text-sm"
      />
      <button
        onClick={buscarPedido}
        disabled={loading || telefono.trim() === ""}
        className="bg-[#FFD966] hover:bg-[#f5c741] text-[#5A3E1B] px-4 py-2 rounded-md w-full font-medium"
      >
        {loading ? "Buscando..." : "Consultar pedido"}
      </button>
    </div>
  );
}

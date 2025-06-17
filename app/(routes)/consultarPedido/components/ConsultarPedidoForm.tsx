"use client";

import { usePedidoContext } from "./PedidoProvider";
import { Phone } from "lucide-react";

export default function ConsultarPedidoForm() {
  const { telefono, setTelefono, buscarPedido, loading } = usePedidoContext();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");
    setTelefono(onlyNumbers);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A3E1B] w-4 h-4" />
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Ingresá tu número de teléfono"
          value={telefono}
          onChange={handleInput}
          className="w-full pl-10 border border-[#E0E0E0] rounded-md px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD966]"
        />
      </div>
      <button
        onClick={buscarPedido}
        disabled={loading || telefono.trim() === ""}
        className="bg-[#FFD966] hover:bg-[#f5c741] text-[#5A3E1B] px-4 py-2 rounded-md w-full font-semibold shadow-sm transition-colors"
      >
        {loading ? "Buscando..." : "Consultar pedido"}
      </button>
    </div>
  );
}

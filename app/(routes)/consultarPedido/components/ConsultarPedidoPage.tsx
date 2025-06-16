"use client";

import { PedidoProvider } from "./PedidoProvider";
import ConsultarPedidoForm from "./ConsultarPedidoForm";
import PedidoResultado from "./PedidoResultado";

export default function ConsultarPedidoPage() {
  return (
    <PedidoProvider>
      <div className="min-h-screen bg-[#FBE6D4] py-16 px-4 max-w-2xl mx-auto">
        <h1 className="text-3xl font-garamond text-[#5A3E1B] text-center mb-8">
          Consultar estado de tu pedido 📦
        </h1>
        <div className="bg-[#FFF8EB] p-6 rounded-xl shadow space-y-4">
          <ConsultarPedidoForm />
          <PedidoResultado />
        </div>
      </div>
    </PedidoProvider>
  );
}

"use client";

import { PedidoProvider } from "./PedidoProvider";
import ConsultarPedidoForm from "./ConsultarPedidoForm";
import PedidoResultado from "./PedidoResultado";
import { Search } from "lucide-react";

export default function ConsultarPedidoPage() {
  return (
    <PedidoProvider>
      <div className="min-h-screen bg-[#FBE6D4] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-center font-garamond italic text-5xl md:text-5xl tracking-wide text-[#5A3E1B] border-b-2 border-[#5a3e1b88] pb-6">
            Seguimiento de tu pedido
          </h1>

          <div className="bg-[#FFF8EB] p-6 rounded-xl shadow-lg space-y-6">
            <div className="flex items-center gap-2">
              <Search className="text-[#5A3E1B]" />
              <h2 className="text-lg font-semibold text-[#5A3E1B]">
                Consultá ingresando tu número de teléfono
              </h2>
            </div>
            <ConsultarPedidoForm />
          </div>

          <PedidoResultado />
        </div>
      </div>
    </PedidoProvider>
  );
}

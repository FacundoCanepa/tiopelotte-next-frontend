"use client";

import { createContext, useContext, useState } from "react";

type PedidoContextType = {
  telefono: string;
  setTelefono: (t: string) => void;
  pedido: any | null;
  loading: boolean;
  error: string;
  buscarPedido: () => Promise<void>;
};

const PedidoContext = createContext<PedidoContextType | undefined>(undefined);

export function PedidoProvider({ children }: { children: React.ReactNode }) {
  const [telefono, setTelefono] = useState("");
  const [pedido, setPedido] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const buscarPedido = async () => {
    if (!telefono.trim()) return;
    setLoading(true);
    setError("");
    setPedido(null);

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos?filters[telefono][$eq]=${telefono}&sort=createdAt:desc&pagination[limit]=1`;
      const res = await fetch(url);
      const data = await res.json();
      if (data?.data?.length > 0) {
        setPedido(data.data[0]);
      } else {
        setError("No encontramos ningún pedido con ese número.");
      }
    } catch (err) {
      setError("Ocurrió un error al consultar el pedido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PedidoContext.Provider value={{ telefono, setTelefono, pedido, loading, error, buscarPedido }}>
      {children}
    </PedidoContext.Provider>
  );
}

export function usePedidoContext() {
  const context = useContext(PedidoContext);
  if (!context) throw new Error("usePedidoContext debe usarse dentro de PedidoProvider");
  return context;
}

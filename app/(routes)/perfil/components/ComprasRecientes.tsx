"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/user-store";
import { Loader2 } from "lucide-react";
import { repeatOrder, RepeatItem } from "@/lib/orders";

type PedidoItem = RepeatItem & {
  productName: string;
};

type Pedido = {
  id: number;
  total: number;
  estado: string;
  items: PedidoItem[];
  createdAt: string;
};

export default function ComprasRecientes() {
  const jwt = useUserStore((state) => state.jwt);
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUltimoPedido = async () => {
      if (!jwt) {
        console.warn("⛔ No hay JWT. Usuario no logueado.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me?populate=pedido.items`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );

        if (!res.ok) throw new Error(`Error ${res.status} al cargar el pedido`);

        const json = await res.json();
        console.log("🧾 Usuario con pedido:", json);

        const userPedido = json?.pedido;

        if (!userPedido || !userPedido.items?.length) {
          console.log("⚠️ No hay items en el pedido.");
          setPedido(null);
        } else {
          setPedido(userPedido);
        }
      } catch (err: any) {
        console.error("💥 Error al traer el pedido:", err);
        setError("No se pudo cargar tu último pedido.");
      } finally {
        setLoading(false);
      }
    };

    fetchUltimoPedido();
  }, [jwt]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Loader2 className="animate-spin" size={20} />
        Cargando último pedido...
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <p className="text-sm text-gray-500">
        No se encontró ningún pedido reciente.
      </p>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-4">
      <h3 className="text-lg font-semibold text-[#8B4513] mb-2">
        Última compra
      </h3>

      <ul className="mb-4 space-y-1">
        {pedido.items.map((item, idx) => (
          <li key={idx} className="text-sm text-gray-800">
            {item.productName} x{item.quantity}
          </li>
        ))}
      </ul>

      <p className="text-sm text-gray-500">
        Estado: <span className="font-medium">{pedido.estado}</span> — Total: $
        {pedido.total}
      </p>

      <button
        onClick={() => repeatOrder(pedido.items)}
        className="mt-3 w-full bg-[#FFD966] text-[#5A3E1B] py-2 rounded hover:bg-[#f5c741]"
      >
        Volver a pedir
      </button>
    </div>
  );
}

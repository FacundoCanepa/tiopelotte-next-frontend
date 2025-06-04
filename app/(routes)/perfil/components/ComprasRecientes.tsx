"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/user-store";
import { Loader2 } from "lucide-react";

type Compra = {
  id: number;
  productos: string[];
  total: number;
  fecha: string;
};

export default function ComprasRecientes() {
  const { user } = useUserStore();
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // 🔁 Acá iría fetch real a Strapi (endpoint futuro)
    const fakeCompras: Compra[] = [
      {
        id: 1,
        productos: ["Ravioles de ricota", "Ñoquis de papa"],
        total: 3400,
        fecha: "2025-05-28",
      },
      {
        id: 2,
        productos: ["Tirabuzones", "Sorrentinos de jamón"],
        total: 2900,
        fecha: "2025-05-15",
      },
    ];

    setTimeout(() => {
      setCompras(fakeCompras);
      setLoading(false);
    }, 800);
  }, [user]);

  if (loading) {
    return (
      <div className="text-center">
        <Loader2 className="animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Compras recientes</h2>
      {compras.length === 0 ? (
        <p className="text-gray-600">No realizaste compras aún.</p>
      ) : (
        <div className="space-y-4">
          {compras.map((compra) => (
            <div
              key={compra.id}
              className="border border-gray-300 rounded p-4 bg-white shadow-sm"
            >
              <p className="font-medium">🛒 {compra.productos.join(", ")}</p>
              <p className="text-sm text-gray-600 mt-1">Fecha: {compra.fecha}</p>
              <p className="text-sm mt-1">Total: ${compra.total}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

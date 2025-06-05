"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/user-store";
import { useCartStore } from "@/store/cart-store";
import { PedidoType } from "@/types/pedido";
import { Button } from "@/components/ui/Button"; // ¡asegúrate que el casing sea correcto!

export default function ComprasRecientes() {
  const user = useUserStore((state) => state.user);
  const jwt = useUserStore((state) => state.jwt);
  const addToCart = useCartStore((state) => state.addToCart);
  const [pedidos, setPedidos] = useState<PedidoType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      if (!user || !jwt) {
        console.warn("⛔ Usuario no logueado o sin JWT.");
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos?populate[user]=true&populate[items]=true`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );

        const json = await res.json();
        console.log("📦 Respuesta pedidos:", json);

        const userPedidos = json.data.filter((pedido: any) => {
          console.log("🧾 Pedido individual:", pedido);
          return pedido.user?.id === user.id;
        });

        setPedidos(userPedidos);
      } catch (error) {
        console.error("💥 Error al traer pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [user, jwt]);

  const handleReorder = async (items: any[]) => {
    try {
      for (const item of items) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${item.productId}?populate=*`
        );
        const json = await res.json();
        const product = json.data;

        if (!product) {
          console.warn(`❌ Producto no encontrado con ID ${item.productId}`);
          continue;
        }

        addToCart({
          id: product.id,
          img: product.img?.url || "",
          slug: product.slug,
          productName: product.productName,
          price: item.unitPrice,
          unidadMedida: item.unidadMedida,
          quantity: item.quantity,
        });

        console.log(`✅ Agregado al carrito: ${product.productName}`);
      }
    } catch (err) {
      console.error("💥 Error en reorder:", err);
    }
  };

  if (loading) return <p className="text-sm mt-2">Cargando tus pedidos...</p>;
  if (!pedidos.length) return <p className="text-sm mt-2">No hay compras previas.</p>;

  return (
    <section className="mt-4 space-y-6">
      <h2 className="text-lg font-semibold">Compras recientes</h2>

      {pedidos.map((pedido) => (
        <div key={pedido.id} className="border rounded-xl p-4 bg-white shadow-md">
          <p className="text-sm font-medium">Pedido #{pedido.id}</p>
          <p className="text-xs text-gray-500">Zona: {pedido.zona} – Total: ${pedido.total}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
            {pedido.items.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center border rounded p-2 text-center bg-[#fdf7f2]"
              >
                <img
                  src={item.img}
                  alt={item.productName}
                  className="w-16 h-16 object-cover rounded"
                />
                <p className="text-xs mt-1">{item.productName}</p>
                <p className="text-xs text-gray-600">
                  {item.quantity} {item.unidadMedida}
                </p>
              </div>
            ))}
          </div>

          <Button
            className="mt-3 w-full"
            onClick={() => handleReorder(pedido.items)}
          >
            Volver a pedir
          </Button>
        </div>
      ))}
    </section>
  );
}

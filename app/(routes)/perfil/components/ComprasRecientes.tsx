"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/user-store";
import { useCartStore } from "@/store/cart-store";
import { Loader2 } from "lucide-react";
import { PedidoType } from "@/types/pedido";

export default function ComprasRecientes() {
  const { user, jwt } = useUserStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const [pedidos, setPedidos] = useState<PedidoType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      if (!jwt || !user) {
        console.warn("⛔ Usuario no logueado o sin JWT.");
        return;
      }

      console.log("🔐 JWT detectado:", jwt);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos?populate=*`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        const json = await res.json();
        console.log("📦 Respuesta completa:", json);

        const allPedidos = json.data as PedidoType[];
        const pedidosDelUsuario = allPedidos.filter((pedido) =>
          pedido.attributes.user?.some((u) => u.id === user.id)
        );

        setPedidos(pedidosDelUsuario);
        if (pedidosDelUsuario.length === 0) {
          console.warn("⚠️ Usuario sin pedidos registrados.");
        }
      } catch (err) {
        console.error("💥 Error al traer pedidos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [user, jwt]);

  const volverAgregarAlCarrito = async (pedido: PedidoType) => {
    for (const item of pedido.attributes.items) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${item.productId}?populate=*`
        );
        const json = await res.json();
        const product = json.data;
        if (!product) {
          console.warn("⚠️ Producto no encontrado:", item.productId);
          continue;
        }

        addToCart(product, item.quantity);
        console.log(`✅ Agregado al carrito: ${product.attributes.productName}`);
      } catch (err) {
        console.error("❌ Error agregando al carrito:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10">
        <Loader2 className="animate-spin mx-auto text-[#8B4513]" />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Compras recientes</h2>

      {pedidos.length === 0 ? (
        <p className="text-gray-600">Todavía no realizaste compras 🍝</p>
      ) : (
        pedidos.map((pedido) => (
          <div key={pedido.id} className="p-4 rounded-xl bg-white shadow-sm border">
            <h3 className="font-bold text-[#8B4513] mb-2">Compra del {new Date(pedido.attributes.createdAt).toLocaleDateString()}</h3>
            <ul className="text-sm text-gray-700 mb-2 space-y-1">
              {pedido.attributes.items.map((item, i) => (
                <li key={i}>
                  {item.quantity} × {item.productName} – ${item.unitPrice}
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-600">
              Total: <strong>${pedido.attributes.total}</strong>
            </p>
            <button
              onClick={() => volverAgregarAlCarrito(pedido)}
              className="mt-3 px-4 py-2 bg-[#D16A45] text-white rounded hover:bg-[#b24f33] transition"
            >
              Volver a agregar al carrito
            </button>
          </div>
        ))
      )}
    </section>
  );
}

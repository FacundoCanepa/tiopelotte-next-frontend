"use client";

interface Pedido {
  id: number;
  estado: string;
  total: number;
  tipoPago: string;
  tipoEntrega: string;
  createdAt: string;
}

interface Props {
  pedidos: Pedido[];
}

export default function PedidosTable({ pedidos }: Props) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-[#FBE6D4] text-[#5A3E1B]">
          <tr>
            <th className="p-2 text-left">Fecha</th>
            <th className="p-2 text-left">Total</th>
            <th className="p-2 text-left">Pago</th>
            <th className="p-2 text-left">Entrega</th>
            <th className="p-2 text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => {
            const fecha = new Date(p.createdAt).toLocaleDateString("es-AR");
            const total = `$${p.total.toLocaleString("es-AR")}`;
            return (
              <tr key={p.id} className="border-b last:border-none">
                <td className="p-2 whitespace-nowrap">{fecha}</td>
                <td className="p-2 whitespace-nowrap">{total}</td>
                <td className="p-2 whitespace-nowrap capitalize">{p.tipoPago}</td>
                <td className="p-2 whitespace-nowrap capitalize">{p.tipoEntrega}</td>
                <td className="p-2 whitespace-nowrap">{p.estado}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

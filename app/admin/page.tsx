"use client";

import { useRouter } from "next/navigation";
import  Button  from "@/components/ui/Button";
import { Package, Users, ClipboardList } from "lucide-react";

export default function AdminHomePage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-[#8B4513]">
        Panel de administración
      </h1>
      <p className="text-stone-700">Bienvenido. Elegí una sección para gestionar:</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div
          onClick={() => router.push("/admin/pedidos")}
          className="cursor-pointer bg-white rounded-xl shadow p-6 hover:bg-[#FFF0D0] transition"
        >
          <ClipboardList className="w-6 h-6 mb-2 text-[#8B4513]" />
          <h3 className="text-lg font-semibold">Pedidos</h3>
          <p className="text-sm text-stone-600">Ver y administrar pedidos.</p>
        </div>

        <div
          onClick={() => router.push("/admin/productos")}
          className="cursor-pointer bg-white rounded-xl shadow p-6 hover:bg-[#FFF0D0] transition"
        >
          <Package className="w-6 h-6 mb-2 text-[#8B4513]" />
          <h3 className="text-lg font-semibold">Productos</h3>
          <p className="text-sm text-stone-600">Consultar y editar productos.</p>
        </div>

        <div
          onClick={() => router.push("/admin/usuarios")}
          className="cursor-pointer bg-white rounded-xl shadow p-6 hover:bg-[#FFF0D0] transition"
        >
          <Users className="w-6 h-6 mb-2 text-[#8B4513]" />
          <h3 className="text-lg font-semibold">Usuarios</h3>
          <p className="text-sm text-stone-600">Ver usuarios registrados.</p>
        </div>
      </div>
    </div>
  );
}

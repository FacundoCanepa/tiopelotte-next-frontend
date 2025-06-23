"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

const rolesDisponibles = ["Authenticated", "Administrador", "Empleado"];
const zonasDisponibles = [
  "Etcheverry 2",
  "Etcheverry 1",
  "Olmos",
  "ruta 36 y 197",
  "los hornos 1",
  "los hornos 2",
  "los hornos 3",
  "62 y 248",
  "Barrio Los Cachorros",
  "El rodeo",
  "Area 60",
  "Miralagos",
  "Campos de Roca I y II",
  "Haras del SUR I",
  "Haras del SUR III",
  "Posada de los Lagos",
  "Haras del SUR II",
  "Abasto",
  "Abasto 2",
  "Club de campo La Torre",
  "Romero",
  "Romero II",
];

interface Usuario {
  id: number;
  username: string;
  email: string;
  role: { name: string };
  telefono?: string;
  direccion?: string;
  zona?: string;
}

export default function UsuariosSection() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      setUsuarios(Array.isArray(json?.data) ? json.data : []);
    } catch {
      toast.error("No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    id: number,
    field: keyof Usuario,
    value: string
  ) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, [field]: value } : u))
    );
  };

  const guardarUsuario = async (usuario: Usuario) => {
    setSavingId(usuario.id);
    try {
      const res = await fetch(`/api/admin/users/${usuario.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
      });

      if (!res.ok) throw new Error();
      toast.success("Usuario actualizado");
    } catch {
      toast.error("No se pudo guardar el usuario");
    } finally {
      setSavingId(null);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-[#8B4513]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold text-[#8B4513] font-garamond">Usuarios</h1>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-[#FBE6D4] text-[#5A3E1B]">
            <tr>
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Rol</th>
              <th className="p-2 text-left">Teléfono</th>
              <th className="p-2 text-left">Dirección</th>
              <th className="p-2 text-left">Zona</th>
              <th className="p-2 text-left">Guardar</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-b last:border-none hover:bg-[#FFF8EC]">
                <td className="p-2">
                  <input
                    value={u.username}
                    onChange={(e) => handleInputChange(u.id, "username", e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
                <td className="p-2">
                  <input
                    value={u.email}
                    onChange={(e) => handleInputChange(u.id, "email", e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
                <td className="p-2">
                  <select
                    value={u.role?.name || ""}
                    onChange={(e) =>
                      setUsuarios((prev) =>
                        prev.map((user) =>
                          user.id === u.id ? { ...user, role: { name: e.target.value } } : user
                        )
                      )
                    }
                    className="border rounded px-2 py-1 w-full"
                  >
                    {rolesDisponibles.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </td>
                <td className="p-2 whitespace-nowrap flex items-center gap-2">
                  <a
                    href={`https://wa.me/54${u.telefono}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 underline"
                  >
                    {u.telefono || "-"}
                  </a>
                  <input
                    type="number"
                    value={u.telefono || ""}
                    onChange={(e) => handleInputChange(u.id, "telefono", e.target.value)}
                    className="border rounded px-2 py-1 w-24"
                  />
                </td>
                <td className="p-2">
                  <input
                    value={u.direccion || ""}
                    onChange={(e) => handleInputChange(u.id, "direccion", e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
                <td className="p-2">
                  <select
                    value={u.zona || ""}
                    onChange={(e) => handleInputChange(u.id, "zona", e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  >
                    <option value="">Seleccionar zona</option>
                    {zonasDisponibles.map((zona) => (
                      <option key={zona} value={zona}>{zona}</option>
                    ))}
                  </select>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => guardarUsuario(u)}
                    className="bg-[#8B4513] text-white px-3 py-1 rounded hover:bg-[#5A3E1B] flex items-center gap-1"
                    disabled={savingId === u.id}
                  >
                    {savingId === u.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Guardar
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

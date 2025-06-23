"use client";
import { useEffect, useState } from "react";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import SearchInput from "@/components/ui/productos-filters/SearchInput";
import { toast } from "sonner";

interface Ingrediente {
  id: number;
  nombre: string;
  stock: number;
}

export default function IngredientesSection() {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ nombre: "", stock: 0 });

  const fetchIngredientes = async () => {
    try {
      const res = await fetch("/api/admin/ingredients");
      const json = await res.json();
      setIngredientes(Array.isArray(json?.data) ? json.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredientes();
  }, []);

  const saveIngrediente = async () => {
    try {
      const url = editingId ? `/api/admin/ingredients/${editingId}` : "/api/admin/ingredients";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Guardado correctamente");
      setShowForm(false);
      setForm({ nombre: "", stock: 0 });
      setEditingId(null);
      fetchIngredientes();
    } catch (err) {
      toast.error("Error al guardar");
    }
  };

  const editIngrediente = (ing: Ingrediente) => {
    setForm({ nombre: ing.nombre, stock: ing.stock });
    setEditingId(ing.id);
    setShowForm(true);
  };

  const deleteIngrediente = async (id: number) => {
    if (!confirm("¿Eliminar ingrediente?")) return;
    try {
      const res = await fetch(`/api/admin/ingredients/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Ingrediente eliminado");
      fetchIngredientes();
    } catch (err) {
      toast.error("Error al eliminar");
    }
  };

  const filtered = ingredientes.filter((i) =>
    i.nombre.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-full flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-[#8B4513]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold text-[#8B4513] font-garamond">Gestión de ingredientes</h1>
      <div className="flex flex-col sm:flex-row gap-2 items-start">
        <SearchInput value={search} setValue={setSearch} />
        <button
          onClick={() => {
            setShowForm((p) => !p);
            setForm({ nombre: "", stock: 0 });
            setEditingId(null);
          }}
          className="flex items-center gap-2 bg-[#FFF4E3] text-[#8B4513] px-3 py-2 rounded-md shadow"
        >
          <Plus className="h-4 w-4" /> Nuevo
        </button>
      </div>

      {showForm && (
        <div className="space-y-2 bg-white p-4 rounded-xl shadow max-w-md">
          <input
            type="text"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={saveIngrediente}
            className="bg-[#8B4513] text-white px-4 py-2 rounded w-full"
          >
            Guardar
          </button>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-[#FBE6D4] text-[#5A3E1B]">
            <tr>
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((i) => (
              <tr key={i.id} className="border-b last:border-none hover:bg-[#FFF8EC]">
                <td className="p-2 whitespace-nowrap capitalize">{i.nombre}</td>
                <td className="p-2 whitespace-nowrap">{i.stock}</td>
                <td className="p-2 whitespace-nowrap flex gap-2">
                  <button onClick={() => editIngrediente(i)} className="text-[#8B4513]">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => deleteIngrediente(i.id)} className="text-red-600">
                    <Trash2 className="h-4 w-4" />
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
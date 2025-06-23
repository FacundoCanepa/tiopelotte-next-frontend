"use client";
import { useEffect, useState } from "react";
import SearchInput from "@/components/ui/productos-filters/SearchInput";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import { ProductType } from "@/types/product";
import { toast } from "sonner";

export default function ProductosSection() {
  const [productos, setProductos] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ productName: "", price: 0, stock: 0 });

  const fetchProductos = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const json = await res.json();
      setProductos(Array.isArray(json?.data) ? json.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const saveProducto = async () => {
    try {
      const url = editingId ? `/api/admin/products/${editingId}` : "/api/admin/products";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Guardado correctamente");
      setShowForm(false);
      setForm({ productName: "", price: 0, stock: 0 });
      setEditingId(null);
      fetchProductos();
    } catch (err) {
      toast.error("Error al guardar");
    }
  };

  const editProducto = (p: ProductType) => {
    setForm({ productName: p.productName, price: p.price, stock: p.stock || 0 });
    setEditingId(p.id);
    setShowForm(true);
  };

  const deleteProducto = async (id: number) => {
    if (!confirm("¿Eliminar producto?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Producto eliminado");
      fetchProductos();
    } catch (err) {
      toast.error("Error al eliminar");
    }
  };

  const filtered = productos.filter((p) =>
    p.productName.toLowerCase().includes(search.toLowerCase())
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
      <h1 className="text-3xl font-semibold text-[#8B4513] font-garamond">Gestión de productos</h1>
      <div className="flex flex-col sm:flex-row gap-2 items-start">
        <SearchInput value={search} setValue={setSearch} />
        <button
          onClick={() => {
            setShowForm((p) => !p);
            setForm({ productName: "", price: 0, stock: 0 });
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
            value={form.productName}
            onChange={(e) => setForm({ ...form, productName: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Precio"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
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
            onClick={saveProducto}
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
              <th className="p-2 text-left">Precio</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b last:border-none hover:bg-[#FFF8EC]">
                <td className="p-2 whitespace-nowrap capitalize">{p.productName}</td>
                <td className="p-2 whitespace-nowrap">${p.price}</td>
                <td className="p-2 whitespace-nowrap">{p.stock || 0}</td>
                <td className="p-2 whitespace-nowrap flex gap-2">
                  <button onClick={() => editProducto(p)} className="text-[#8B4513]">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => deleteProducto(p.id)} className="text-red-600">
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
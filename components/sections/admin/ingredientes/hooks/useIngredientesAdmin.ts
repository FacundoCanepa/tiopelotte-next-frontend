"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IngredientType } from "@/types/ingredient";

function defaultForm() {
  return {
    nombre: "",
    stock: 0,
    unidadMedida: "",
    precio: 0,
    documentId: "",
  };
}

export function useIngredientesAdmin() {
  const [ingredientes, setIngredientes] = useState<IngredientType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterUnidad, setFilterUnidad] = useState("all");
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [orderBy, setOrderBy] = useState<{ field: string; direction: "asc" | "desc" }>({ field: "nombre", direction: "asc" });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(defaultForm());

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
      const url = editingId ? `/api/admin/ingredients/${form.documentId}` : "/api/admin/ingredients";
      const method = editingId ? "PUT" : "POST";
      const payload: any = { ...form };
      if (!editingId) delete payload.documentId;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success("Guardado correctamente");
      setShowForm(false);
      setEditingId(null);
      setForm(defaultForm());
      fetchIngredientes();
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar");
    }
  };

  const editIngrediente = (i: IngredientType) => {
    setForm({
      nombre: i.nombre,
      stock: i.stock,
      unidadMedida: i.unidadMedida,
      precio: i.precio,
      documentId: i.documentId,
    });
    setEditingId(i.id);
    setShowForm(true);
  };

  const deleteIngrediente = async (documentId: string) => {
    if (!confirm("¿Eliminar ingrediente?")) return;
    try {
      const res = await fetch(`/api/admin/ingredients/${documentId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Ingrediente eliminado");
      fetchIngredientes();
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar");
    }
  };

  const startNew = () => {
    setForm(defaultForm());
    setEditingId(null);
    setShowForm(true);
  };

  const unidades = Array.from(new Set(ingredientes.map((i) => i.unidadMedida)));

  const filtered = ingredientes
    .filter((i) => i.nombre?.toLowerCase().includes(search.toLowerCase()))
    .filter((i) => (filterUnidad === "all" ? true : i.unidadMedida === filterUnidad))
    .filter((i) => (filterLowStock ? i.stock <= 5 : true));

  const sorted = [...filtered].sort((a, b) => {
    const dir = orderBy.direction === "asc" ? 1 : -1;
    if (orderBy.field === "precio" || orderBy.field === "stock") {
      return (a as any)[orderBy.field] > (b as any)[orderBy.field] ? dir : -dir;
    }
    return (a as any)[orderBy.field].localeCompare((b as any)[orderBy.field]) * dir;
  });

  return {
    ingredientes: sorted,
    loading,
    search,
    setSearch,
    filterUnidad,
    setFilterUnidad,
    filterLowStock,
    setFilterLowStock,
    orderBy,
    setOrderBy,
    showForm,
    setShowForm,
    form,
    setForm,
    saveIngrediente,
    editIngrediente,
    deleteIngrediente,
    startNew,
    unidades,
  };
}
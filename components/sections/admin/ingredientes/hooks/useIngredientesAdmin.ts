"use client";

import { useEffect, useState } from "react";
import { IngredientType } from "@/types/ingredient";
import { toast } from "sonner";
import { generateSlug } from "@/lib/utils";

export function useIngredientesAdmin() {
  const [ingredientes, setIngredientes] = useState<IngredientType[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterUnidad, setFilterUnidad] = useState("all");
  const [filterLowStock, setFilterLowStock] = useState(false);

  const [orderBy, setOrderBy] = useState({
    field: "nombre",
    direction: "asc" as "asc" | "desc",
  });

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({
    nombre: "",
    stock: 0,
    unidadMedida: "kg",
    precio: 0,
  });

  const unidades = ["kg", "planchas", "unidad"];

 const fetchIngredientes = async () => {
  try {
    const res = await fetch("/api/admin/ingredientes");
    const json = await res.json();

    const data = Array.isArray(json.data) ? json.data : [];

    const ingredientes = data.map((i: any) => ({
      id: i.id,
      documentId: i.documentId,
      nombre: i.ingredienteName,
      stock: i.Stock,
      unidadMedida: i.unidadMedida,
      precio: i.precio,
      stockUpdatedAt: i.stockUpdatedAt,
    }));

    setIngredientes(ingredientes);
  } catch (error) {
    console.error("❌ Error cargando ingredientes:", error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchIngredientes();
  }, []);

  const saveIngrediente = async () => {
    try {
      const isNew = !form.id;

      const payload = {
        ingredienteName: form.nombre,
        Stock: form.stock,
        unidadMedida: form.unidadMedida,
        precio: form.precio,
        documentId: isNew ? generateSlug(form.nombre) : form.documentId,
      };

      console.log("📝 Guardando ingrediente:", payload);

      const url = isNew
        ? "/api/admin/ingredients"
        : `/api/admin/ingredients/${form.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al guardar");

      toast.success(isNew ? "Ingrediente creado" : "Ingrediente editado");
      setShowForm(false);
      fetchIngredientes();
    } catch (error) {
      console.error("❌ Error al guardar ingrediente:", error);
      toast.error("Error al guardar ingrediente");
    }
  };

  const deleteIngrediente = async (documentId: string) => {
    try {
      const ingrediente = ingredientes.find((i) => i.documentId === documentId);
      if (!ingrediente) throw new Error("Ingrediente no encontrado");

      console.log("🗑️ Eliminando ingrediente con id:", ingrediente.id);

      const res = await fetch(`/api/admin/ingredients/${ingrediente.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar");

      toast.success("Ingrediente eliminado");
      fetchIngredientes();
    } catch (error) {
      console.error("❌ Error al eliminar:", error);
      toast.error("Error al eliminar");
    }
  };

  const editIngrediente = (i: IngredientType) => {
    console.log("✏️ Editando ingrediente:", i);
    setForm({
      id: i.id,
      nombre: i.nombre,
      stock: i.stock,
      unidadMedida: i.unidadMedida,
      precio: i.precio,
      documentId: i.documentId,
    });
    setShowForm(true);
  };

  const startNew = () => {
    console.log("➕ Nuevo ingrediente");
    setForm({
      nombre: "",
      stock: 0,
      unidadMedida: "kg",
      precio: 0,
    });
    setShowForm(true);
  };

  return {
    ingredientes: ingredientes
      .filter((i) =>
        i.nombre.toLowerCase().includes(search.toLowerCase())
      )
      .filter((i) => (filterUnidad === "all" ? true : i.unidadMedida === filterUnidad))
      .filter((i) => (filterLowStock ? i.stock <= 5 : true))
      .sort((a, b) => {
        const aValue = a[orderBy.field as keyof IngredientType];
        const bValue = b[orderBy.field as keyof IngredientType];
        if (aValue < bValue) return orderBy.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return orderBy.direction === "asc" ? 1 : -1;
        return 0;
      }),

    loading,
    search,
    setSearch,
    filterUnidad,
    setFilterUnidad,
    filterLowStock,
    setFilterLowStock,
    orderBy,
    setOrderBy,
    unidades,
    showForm,
    setShowForm,
    form,
    setForm,
    saveIngrediente,
    editIngrediente,
    deleteIngrediente,
    startNew,
  };
}

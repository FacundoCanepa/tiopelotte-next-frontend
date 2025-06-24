"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { ProductType } from "@/types/product";
import { toast } from "sonner";
import ProductFilters from "./ProductFilters";
import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";
import ProductPreview from "./ProductPreview";

const generateSlug = (text: string) =>
  text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export default function ProductosSection() {
  const [productos, setProductos] = useState<ProductType[]>([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterOffer, setFilterOffer] = useState("all");
  const [filterActive, setFilterActive] = useState("all");
  const [filterUnidad, setFilterUnidad] = useState("all");
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [orderBy, setOrderBy] = useState<{ field: string; direction: "asc" | "desc" }>({
    field: "productName",
    direction: "asc",
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<any>(defaultForm());

  function defaultForm() {
    return {
      productName: "",
      description: "",
      descriptionCorta: "",
      price: 0,
      stock: 0,
      unidadMedida: "kg",
      slug: "",
      tiempoEstimado: "",
      porciones: "",
      taste: "",
      isOffer: false,
      isFeatured: false,
      active: true,
      ingredientes: [],
      img: null,
      img_carousel: [],
      imgPreview: null,
        img_carousel_preview: [],
      documentId: "",
    };
  }

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

  const fetchIngredientes = async () => {
    try {
      const res = await fetch("/api/admin/ingredients");
      const json = await res.json();
      setIngredientes(Array.isArray(json?.data) ? json.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProductos();
    fetchIngredientes();
  }, []);

  useEffect(() => {
    setForm((prev: any) => ({ ...prev, slug: generateSlug(prev.productName) }));
  }, [form.productName]);

  const handleFileUpload = async (files: FileList, isCarousel = false) => {
    if (!files || files.length === 0) return;
    if (isCarousel) {
      const previews = Array.from(files).map((file) => URL.createObjectURL(file));
      setForm((prev: any) => ({ ...prev, img_carousel_preview: previews }));
    } else {
    const localUrl = URL.createObjectURL(files[0]);
          setForm((prev: any) => ({ ...prev, imgPreview: localUrl }));
        }

        const data = new FormData();
        Array.from(files).forEach((file) => data.append("files", file));

        try {
          const res = await fetch("/api/upload", { method: "POST", body: data });
          const json = await res.json();
          if (!res.ok) throw new Error();
          if (isCarousel) {
            setForm((prev: any) => ({
              ...prev,
              img_carousel: json.map((img: any) => img.id),
              img_carousel_preview: json.map((img: any) => img.url),
            }));
          } else {
            setForm((prev: any) => ({ ...prev, img: json[0].id, imgPreview: json[0].url }));
          }
        } catch (error) {
          toast.error("Error al subir la imagen");
        }
  };

  const saveProducto = async () => {
    try {
      const url = editingId
        ? `/api/admin/products/${form.documentId}` // usar documentId para PUT
        : "/api/admin/products";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Guardado correctamente");
      setShowForm(false);
      setEditingId(null);
      setForm(defaultForm());
      fetchProductos();
    } catch (err) {
      toast.error("Error al guardar el producto");
    }
  };

  const editProducto = (p: ProductType) => {
    setForm({
      ...p,
      ingredientes: p.ingredientes?.map((i: any) => i.id) || [],
      imgPreview: p.img?.url,
img_carousel_preview: p.img_carousel?.map((i: any) => i.url) || [],
      documentId: p.documentId,
    });
    setEditingId(p.id);
    setShowForm(true);
  };

    const deleteProducto = async (documentId: string) => {
    if (!confirm("¿Eliminar producto?")) return;
    try {
    const res = await fetch(`/api/admin/products/${documentId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Producto eliminado");
      fetchProductos();
    } catch (err) {
      toast.error("Error al eliminar");
    }
  };

  const unidades = Array.from(new Set(productos.map((p) => p.unidadMedida)));

  const filtered = productos
    .filter((p) => p.productName.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => (filterOffer === "all" ? true : filterOffer === "offer" ? p.isOffer : !p.isOffer))
    .filter((p) => (filterActive === "all" ? true : filterActive === "active" ? p.active : !p.active))
    .filter((p) => (filterUnidad === "all" ? true : p.unidadMedida === filterUnidad))
    .filter((p) => (filterLowStock ? p.stock <= 5 : true));

  const sorted = [...filtered].sort((a, b) => {
    const dir = orderBy.direction === "asc" ? 1 : -1;
    if (orderBy.field === "price" || orderBy.field === "stock") {
      return (a[orderBy.field] as number) > (b[orderBy.field] as number) ? dir : -dir;
    }
    return a[orderBy.field].localeCompare(b[orderBy.field]) * dir;
  });

  if (loading) {
    return (
      <div className="w-full flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-[#8B4513]" />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#8B4513] font-garamond">Gestión de productos</h1>
          <p className="text-sm text-gray-600">Crear, editar y eliminar productos del catálogo</p>
        </div>
        <ProductFilters
          search={search}
          setSearch={setSearch}
          filterOffer={filterOffer}
          setFilterOffer={setFilterOffer}
          filterActive={filterActive}
          setFilterActive={setFilterActive}
          filterUnidad={filterUnidad}
          setFilterUnidad={setFilterUnidad}
          unidades={unidades}
          filterLowStock={filterLowStock}
          setFilterLowStock={setFilterLowStock}
          onNew={() => {
            setShowForm(true);
            setForm(defaultForm());
            setEditingId(null);
          }}
        />
      </header>

      {showForm && (
        <>
          <ProductForm
            form={form}
            setForm={setForm}
            ingredientes={ingredientes}
            handleFileUpload={handleFileUpload}
            onSave={saveProducto}
          />
          <ProductPreview product={form} />
        </>
      )}

      <ProductTable
        productos={sorted}
        onEdit={editProducto}
        onDelete={deleteProducto}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
      />
    </section>
  );
}

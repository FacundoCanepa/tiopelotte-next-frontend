"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Pencil, Trash2, Plus, UploadCloud, ImagePlus } from "lucide-react";
import { ProductType } from "@/types/product";
import { toast } from "sonner";
import SearchInput from "@/components/ui/productos-filters/SearchInput";
import Image from "next/image";

export default function ProductosSection() {
  const [productos, setProductos] = useState<ProductType[]>([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<any>(defaultForm());
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const carouselInputRef = useRef<HTMLInputElement | null>(null);

  function defaultForm() {
    return {
      productName: "",
      description: "",
      descriptionCorta: "",
      price: 0,
      stock: 0,
      unidadMedida: "kg",
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

  const handleFileUpload = async (files: FileList, isCarousel = false) => {
    const data = new FormData();
    Array.from(files).forEach((file) => data.append("files", file));

    const res = await fetch("/api/upload", { method: "POST", body: data });
    const json = await res.json();
    if (isCarousel) {
      setForm((prev: any) => ({ ...prev, img_carousel: json.map((img: any) => img.id) }));
    } else {
      setForm((prev: any) => ({ ...prev, img: json[0].id, imgPreview: json[0].url }));
    }
  };

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
      setForm(defaultForm());
      setEditingId(null);
      fetchProductos();
    } catch (err) {
      toast.error("Error al guardar");
    }
  };

  const editProducto = (p: ProductType) => {
    setForm({
      ...p,
      ingredientes: p.ingredientes?.map((i: any) => i.id) || [],
      imgPreview: p.img?.url,
    });
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
    <section className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#8B4513] font-garamond">Gestión de productos</h1>
          <p className="text-sm text-gray-600">Crear, editar y eliminar productos del catálogo</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <SearchInput value={search} setValue={setSearch} />
          <button
            onClick={() => {
              setShowForm((p) => !p);
              setForm(defaultForm());
              setEditingId(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#FFF4E3] text-[#8B4513] border border-[#8B4513] rounded-lg hover:bg-[#f5e5cc] transition"
          >
            <Plus className="w-4 h-4" /> Nuevo producto
          </button>
        </div>
      </header>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 gap-6">
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="Nombre" value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} className="input" />
            <input type="text" placeholder="Descripción corta" value={form.descriptionCorta} onChange={(e) => setForm({ ...form, descriptionCorta: e.target.value })} className="input" />
            <input type="text" placeholder="Sabor" value={form.taste} onChange={(e) => setForm({ ...form, taste: e.target.value })} className="input" />
            <input type="text" placeholder="Unidad de medida" value={form.unidadMedida} onChange={(e) => setForm({ ...form, unidadMedida: e.target.value })} className="input" />
          </div>

          <textarea placeholder="Descripción completa" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input h-24" />

          <div className="grid md:grid-cols-4 gap-4">
            <input type="number" placeholder="Precio" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="input" />
            <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="input" />
            <input type="text" placeholder="Porciones" value={form.porciones} onChange={(e) => setForm({ ...form, porciones: e.target.value })} className="input" />
            <input type="text" placeholder="Tiempo estimado" value={form.tiempoEstimado} onChange={(e) => setForm({ ...form, tiempoEstimado: e.target.value })} className="input" />
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isOffer} onChange={(e) => setForm({ ...form, isOffer: e.target.checked })} /> Oferta</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Destacado</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Activo</label>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Ingredientes relacionados</label>
            <select multiple value={form.ingredientes} onChange={(e) => { const values = Array.from(e.target.selectedOptions, (option) => Number(option.value)); setForm({ ...form, ingredientes: values }); }} className="input h-32">
              {ingredientes.map((ing: any) => (<option key={ing.id} value={ing.id}>{ing.nombre}</option>))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Imagen principal</label>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-[#fbe6d4] hover:bg-[#efd6bf] text-[#8B4513] px-4 py-2 rounded-md flex items-center gap-2 justify-center">
                <UploadCloud className="w-4 h-4" /> Subir imagen
              </button>
              <input type="file" className="hidden" ref={fileInputRef} onChange={(e) => e.target.files && handleFileUpload(e.target.files)} />
              {form.imgPreview && <Image src={form.imgPreview} alt="preview" width={300} height={300} className="rounded-md object-cover h-40 w-full" />}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Carrusel de imágenes</label>
              <button type="button" onClick={() => carouselInputRef.current?.click()} className="bg-[#fbe6d4] hover:bg-[#efd6bf] text-[#8B4513] px-4 py-2 rounded-md flex items-center gap-2 justify-center">
                <ImagePlus className="w-4 h-4" /> Subir múltiples
              </button>
              <input type="file" className="hidden" multiple ref={carouselInputRef} onChange={(e) => e.target.files && handleFileUpload(e.target.files, true)} />
            </div>
          </div>

          <button onClick={saveProducto} className="mt-4 bg-[#8B4513] text-white px-6 py-3 rounded-md hover:bg-[#6e3a1c] transition w-full font-semibold">Guardar producto</button>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-xl shadow border">
        <table className="min-w-full text-sm">
          <thead className="bg-[#FBE6D4] text-[#5A3E1B]">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Precio</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Unidad</th>
              <th className="p-3 text-left">Sabor</th>
              <th className="p-3 text-left">Oferta</th>
              <th className="p-3 text-left">Activo</th>
              <th className="p-3 text-left">Últ. stock</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b hover:bg-[#FFF8EC]">
                <td className="p-3 capitalize font-medium text-[#5A3E1B]">{p.productName}</td>
                <td className="p-3">${p.price}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">{p.unidadMedida}</td>
                <td className="p-3">{p.taste}</td>
                <td className="p-3">{p.isOffer ? "Sí" : "No"}</td>
                <td className="p-3">{p.active ? "Sí" : "No"}</td>
                <td className="p-3 text-xs text-gray-500">{p.stockUpdatedAt ? new Date(p.stockUpdatedAt).toLocaleString("es-AR") : "-"}</td>
                <td className="p-3 whitespace-nowrap flex gap-3">
                  <button onClick={() => editProducto(p)} className="text-[#8B4513] hover:text-[#5A3E1B]">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => deleteProducto(p.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
"use client";

import { UploadCloud, ImagePlus } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useRef } from "react";

interface Props {
  form: any;
  setForm: Dispatch<SetStateAction<any>>;
  ingredientes: any[];
  handleFileUpload: (files: FileList, isCarousel?: boolean) => Promise<void>;
  onSave: () => void;
}

export default function ProductForm({ form, setForm, ingredientes, handleFileUpload, onSave }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const carouselInputRef = useRef<HTMLInputElement | null>(null);

  const sabores = [
    "fideos",
    "sorrentinos",
    "ravioles",
    "especiales",
    "ñoquis",
    "canelones",
    "filetto",
    "queso",
    "flan",
    "chocotorta",
    "pastafrola",
  ];

  const unidades = ["kg", "planchas", "unidad"];

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#5A3E1B]">Nombre</label>
          <input
            type="text"
            value={form.productName}
            onChange={(e) => setForm({ ...form, productName: e.target.value })}
            className="w-full rounded-md border border-[#e6cdb0] bg-[#fff7ee] px-3 py-2 text-sm text-[#5A3E1B]"
            placeholder="Ej: Canelones de Pollo"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#5A3E1B]">Descripción corta</label>
          <input
            type="text"
            value={form.descriptionCorta}
            onChange={(e) => setForm({ ...form, descriptionCorta: e.target.value })}
            className="w-full rounded-md border border-[#e6cdb0] bg-[#fff7ee] px-3 py-2 text-sm text-[#5A3E1B]"
            placeholder="Ej: Casero, fresco, relleno..."
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#5A3E1B]">Sabor</label>
          <select
            value={form.taste || ""}
            onChange={(e) => setForm({ ...form, taste: e.target.value })}
            className="w-full rounded-md border border-[#e6cdb0] bg-[#fff7ee] px-3 py-2 text-sm text-[#5A3E1B]"
          >
            <option value="" disabled>Seleccionar sabor</option>
            {sabores.map((sabor) => (
              <option key={sabor} value={sabor}>{sabor}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#5A3E1B]">Unidad de medida</label>
          <select
            value={form.unidadMedida || ""}
            onChange={(e) => setForm({ ...form, unidadMedida: e.target.value })}
            className="w-full rounded-md border border-[#e6cdb0] bg-[#fff7ee] px-3 py-2 text-sm text-[#5A3E1B]"
          >
            <option value="" disabled>Seleccionar unidad</option>
            {unidades.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#5A3E1B]">Categoría</label>
          <select
            value={form.category || ""}
            onChange={(e) => setForm({ ...form, category: Number(e.target.value) })}
            className="w-full rounded-md border border-[#e6cdb0] bg-[#fff7ee] px-3 py-2 text-sm text-[#5A3E1B]"
          >
            <option value="" disabled>Seleccionar categoría</option>
            <option value={2}>Pastas</option>
            <option value={3}>Postres</option>
            <option value={1}>Quesos</option>
            <option value={4}>Salsas</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-[#5A3E1B]">Slug (automático)</label>
        <input
          type="text"
          value={form.slug}
          readOnly
          className="w-full rounded-md border border-[#e6cdb0] bg-gray-100 px-3 py-2 text-sm text-[#5A3E1B]"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-[#5A3E1B]">Descripción completa</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full rounded-md border border-[#e6cdb0] bg-[#fff7ee] px-3 py-2 text-sm text-[#5A3E1B] h-24"
          placeholder="Detalle del producto, elaboración, etc."
        />
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#5A3E1B]">Precio</label>
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="w-full rounded-md border border-[#e6cdb0] bg-[#fff7ee] px-3 py-2 text-sm text-[#5A3E1B]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#5A3E1B]">Stock</label>
          <input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            className="w-full rounded-md border border-[#e6cdb0] bg-[#fff7ee] px-3 py-2 text-sm text-[#5A3E1B]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#5A3E1B]">Porciones</label>
          <input
            type="text"
            value={form.porciones}
            onChange={(e) => setForm({ ...form, porciones: e.target.value })}
            className="w-full rounded-md border border-[#e6cdb0] bg-[#fff7ee] px-3 py-2 text-sm text-[#5A3E1B]"
            placeholder="Ej: 2 personas"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#5A3E1B]">Tiempo estimado</label>
          <input
            type="text"
            value={form.tiempoEstimado}
            onChange={(e) => setForm({ ...form, tiempoEstimado: e.target.value })}
            className="w-full rounded-md border border-[#e6cdb0] bg-[#fff7ee] px-3 py-2 text-sm text-[#5A3E1B]"
            placeholder="Ej: 6 minutos"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6 pt-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isOffer} onChange={(e) => setForm({ ...form, isOffer: e.target.checked })} /> Oferta
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Destacado
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Activo
        </label>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#5A3E1B] mb-2">Ingredientes relacionados</label>
        <div className="border rounded-lg p-3 bg-[#fff7ee] max-h-44 overflow-y-auto space-y-1">
          {ingredientes.map((ing: any) => (
            <label key={ing.id} className="flex items-center gap-2 text-sm text-[#5A3E1B]">
              <input
                type="checkbox"
                checked={form.ingredientes.includes(ing.id)}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setForm((prev: any) => ({
                    ...prev,
                    ingredientes: checked
                      ? [...prev.ingredientes, ing.id]
                      : prev.ingredientes.filter((id: number) => id !== ing.id),
                  }));
                }}
              />
              {ing.nombre}
            </label>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#5A3E1B]">Imagen principal</label>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-[#fbe6d4] hover:bg-[#efd6bf] text-[#8B4513] px-4 py-2 rounded-md flex items-center gap-2 justify-center">
            <UploadCloud className="w-4 h-4" /> Subir imagen
          </button>
          <input type="file" className="hidden" ref={fileInputRef} onChange={(e) => e.target.files && handleFileUpload(e.target.files)} />
          {form.imgPreview && (
            <Image src={form.imgPreview} alt="preview" width={300} height={300} className="rounded-md object-cover h-40 w-full" />
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#5A3E1B]">Carrusel de imágenes</label>
          <button type="button" onClick={() => carouselInputRef.current?.click()} className="bg-[#fbe6d4] hover:bg-[#efd6bf] text-[#8B4513] px-4 py-2 rounded-md flex items-center gap-2 justify-center">
            <ImagePlus className="w-4 h-4" /> Subir múltiples
          </button>
          <input type="file" className="hidden" multiple ref={carouselInputRef} onChange={(e) => e.target.files && handleFileUpload(e.target.files, true)} />
            <input type="file" className="hidden" multiple ref={carouselInputRef} onChange={(e) => e.target.files && handleFileUpload(e.target.files, true)} />
              {form.img_carousel_preview?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.img_carousel_preview.map((src: string, idx: number) => (
                <Image key={idx} src={src} alt={`preview-${idx}`} width={80} height={80} className="object-cover rounded-md h-20 w-20" />
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <button onClick={onSave} className="mt-6 w-full bg-[#8B4513] text-white px-6 py-3 rounded-md hover:bg-[#6e3a1c] transition font-semibold">
          Guardar producto
        </button>
      </div>
    </div>
  );
}
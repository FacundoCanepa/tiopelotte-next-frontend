"use client";
import { Dispatch, SetStateAction } from "react";

interface Props {
  form: any;
  setForm: Dispatch<SetStateAction<any>>;
  onSave: () => void;
}

export default function IngredientForm({ form, setForm, onSave }: Props) {
  const unidades = ["kg", "planchas", "unidad"];

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-2 max-w-md">
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
      <select
        value={form.unidadMedida || ""}
        onChange={(e) => setForm({ ...form, unidadMedida: e.target.value })}
        className="border p-2 rounded w-full"
      >
        <option value="" disabled>
          Unidad de medida
        </option>
        {unidades.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Precio"
        value={form.precio}
        onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })}
        className="border p-2 rounded w-full"
      />
      <button onClick={onSave} className="bg-[#8B4513] text-white px-4 py-2 rounded w-full">
        Guardar
      </button>
    </div>
  );
}
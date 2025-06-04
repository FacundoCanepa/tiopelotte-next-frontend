"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/user-store";
import { Loader2, MapPin, Phone, Home } from "lucide-react";

type FormData = {
  telefono: string;
  direccion: string;
  localidad: string;
};

type Props = {
  userId: number;
  jwt: string;
};

export default function PerfilForm({ userId, jwt }: Props) {
  const [formData, setFormData] = useState<FormData>({
    telefono: "",
    direccion: "",
    localidad: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        const data = await res.json();
        setFormData({
          telefono: data.telefono || "",
          direccion: data.direccion || "",
          localidad: data.localidad || "",
        });
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [jwt]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al guardar");

      setMessage("✅ Datos actualizados con éxito.");
    } catch (err) {
      setMessage("❌ Hubo un error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <Loader2 className="animate-spin mx-auto text-black" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-3 border rounded px-3 py-2">
        <Phone className="w-5 h-5 text-gray-600" />
        <input
          type="text"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="Teléfono"
          className="w-full outline-none bg-transparent"
        />
      </div>

      <div className="flex items-center gap-3 border rounded px-3 py-2">
        <Home className="w-5 h-5 text-gray-600" />
        <input
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          placeholder="Dirección"
          className="w-full outline-none bg-transparent"
        />
      </div>

      <div className="flex items-center gap-3 border rounded px-3 py-2">
        <MapPin className="w-5 h-5 text-gray-600" />
        <input
          type="text"
          name="localidad"
          value={formData.localidad}
          onChange={handleChange}
          placeholder="Localidad"
          className="w-full outline-none bg-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-black text-white py-2 rounded hover:opacity-90 transition"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>

      {message && <p className="text-center text-sm mt-2">{message}</p>}
    </form>
  );
}

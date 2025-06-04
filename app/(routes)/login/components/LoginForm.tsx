"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock } from "lucide-react";
import Button from "@/components/ui/Button";
import { useUserStore } from "@/store/user-store";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/local`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Error al iniciar sesión");
      }

      // ✅ Corregido: guardar user + jwt en un solo objeto
      setUser({
        ...data.user,
        jwt: data.jwt,
      });

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-[#E0E0E0]"
    >
      <h2 className="text-2xl font-garamond text-[#8B4513] mb-6 text-center">Iniciar sesión</h2>

      {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

      <label className="block mb-4">
        <span className="text-[#5A3E1B] text-sm font-semibold flex items-center gap-2">
          <Mail size={16} /> Email
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[#ccc] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD966]"
          required
        />
      </label>

      <label className="block mb-6">
        <span className="text-[#5A3E1B] text-sm font-semibold flex items-center gap-2">
          <Lock size={16} /> Contraseña
        </span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[#ccc] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD966]"
          required
        />
      </label>

      <Button
        type="submit"
        className="w-full bg-[#FFD966] text-[#5A3E1B] hover:bg-[#f5c741]"
        disabled={loading}
      >
        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Iniciar sesión"}
      </Button>

      <p className="text-sm text-center mt-6 text-stone-600">
        ¿No tenés cuenta?{" "}
        <Link
          href="/register"
          className="underline cursor-pointer text-[#8B4513] hover:text-[#D16A45] transition-colors"
        >
          Registrate
        </Link>
      </p>
    </form>
  );
}

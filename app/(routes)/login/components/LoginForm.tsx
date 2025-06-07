"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock } from "lucide-react";
import { useUserStore } from "@/store/user-store";

export default function LoginForm() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const setJwt = useUserStore((state) => state.setJwt);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/local`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Error en login:", data);
        setError(data?.error?.message || "Error al iniciar sesión.");
        return;
      }

      setUser(data.user);
      setJwt(data.jwt);
      router.push("/perfil");
    } catch (err: any) {
      console.error("💥 Error de red:", err);
      setError("Error de red. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full p-6 bg-white rounded-2xl shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-center text-[#8B4513]">
        Iniciar sesión
      </h2>

      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-300">
          <Mail className="w-5 h-5 text-gray-500" />
          <input
            type="email"
            placeholder="Email"
            className="w-full py-2 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 border-b border-gray-300">
          <Lock className="w-5 h-5 text-gray-500" />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full py-2 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button
        onClick={handleLogin}
        className="w-full py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#6e3911] transition-colors flex justify-center items-center"
        disabled={loading}
      >
        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Ingresar"}
      </button>

      <p className="text-sm text-center">
        ¿No tenés cuenta?{" "}
        <span
          onClick={() => router.push("/register")}
          className="underline cursor-pointer text-[#8B4513]"
        >
          Registrate
        </span>
      </p>
    </div>
  );
}

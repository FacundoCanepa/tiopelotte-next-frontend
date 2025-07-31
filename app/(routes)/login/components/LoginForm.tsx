"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { useUserStore } from "@/store/user-store";
import FormField from "@/components/ui/forms/FormField";
import { InteractiveButton } from "@/components/ui/animations/MicroInteractions";

export default function LoginForm() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const setJwt = useUserStore((state) => state.setJwt);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Validaciones en tiempo real
  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("El email es requerido");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Formato de email inválido");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("La contraseña es requerida");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const traducirError = (mensaje: string) => {
    if (mensaje.includes("Invalid identifier or password")) {
      return "Email o contraseña incorrectos";
    }
    if (mensaje.includes("identifier is a required field") || mensaje.includes("Missing identifier")) {
      return "Falta ingresar el email";
    }
    if (mensaje.includes("password is a required field") || mensaje.includes("Missing password")) {
      return "Falta ingresar la contraseña";
    }
    return "Error al iniciar sesión. Intentá nuevamente.";
  };

  const handleLogin = async () => {
    // Validar antes de enviar
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data?.error || "Error desconocido";
        setError(traducirError(msg));
        return;
      }

      setUser({ ...data.user, role: data.user?.role?.name || "cliente" });
      setJwt(data.jwt);
      router.push("/perfil");
    } catch (err) {
      setError("Error de red. Verificá tu conexión.");
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
        <FormField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => validateEmail(email)}
          error={emailError}
          icon={<Mail size={20} />}
          placeholder="tu@email.com"
          required
        />

        <FormField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => validatePassword(password)}
          error={passwordError}
          icon={<Lock size={20} />}
          placeholder="Tu contraseña"
          showPasswordToggle
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <InteractiveButton
        onClick={handleLogin}
        variant="primary"
        className="w-full"
        loading={loading}
        disabled={loading}
      >
        {loading ? "Iniciando sesión..." : "Ingresar"}
      </InteractiveButton>

      <p className="text-sm text-center text-stone-700">
        ¿Olvidaste tu contraseña?{" "}
        <span
          onClick={() => router.push("/reset-password")}
          className="underline cursor-pointer text-[#8B4513]"
        >
          Recuperarla
        </span>
      </p>

      <p className="text-sm text-center text-stone-700 mt-2">
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

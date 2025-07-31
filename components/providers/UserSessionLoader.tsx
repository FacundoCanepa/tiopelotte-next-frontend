"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/user-store";

/**
 * Componente para cargar sesión de usuario de forma segura
 * Maneja la hidratación correctamente para evitar errores SSR
 */
export default function UserSessionLoader() {
  const setUser = useUserStore((s) => s.setUser);
  const setJwt = useUserStore((s) => s.setJwt);
  const setIsSessionChecked = useUserStore((s) => s.setIsSessionChecked);

  useEffect(() => {
    // Verificar que estamos en el cliente
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem("user-storage");
      if (stored) {
        const { state } = JSON.parse(stored);
        if (state?.user && state?.jwt) {
          setUser(state.user);
          setJwt(state.jwt);
        }
      }
    } catch (error) {
      console.error("Error al cargar la sesión del usuario:", error);
      // Limpiar storage corrupto
      localStorage.removeItem("user-storage");
    } finally {
      setIsSessionChecked(true);
    }
  }, [setUser, setJwt, setIsSessionChecked]);

  return null;
}
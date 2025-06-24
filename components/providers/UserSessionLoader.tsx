"use client";
import { useEffect } from "react";
import { useUserStore } from "@/store/user-store";

export default function UserSessionLoader() {
  const setUser = useUserStore((s) => s.setUser);
  const setJwt = useUserStore((s) => s.setJwt);
  const setIsSessionChecked = useUserStore((s) => s.setIsSessionChecked);

  useEffect(() => {
    const stored = localStorage.getItem("user-storage");
    if (stored) {
      try {
        const { state } = JSON.parse(stored);
        if (state) {
          setUser(state.user);
          setJwt(state.jwt);
        }
      } catch (err) {
        console.error("Error al cargar la sesión", err);
      }
    }
    setIsSessionChecked(true);
  }, [setUser, setJwt, setIsSessionChecked]);

  return null;
}
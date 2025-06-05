"use client";
import { useEffect } from "react";
import { useUserStore } from "@/store/user-store";

export default function UserSessionLoader() {
  const setJwt = useUserStore((state) => state.setJwt);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    const userStr = localStorage.getItem("user");

    if (jwt) {
      console.log("📦 Restaurando JWT:", jwt);
      setJwt(jwt);
    }

    if (userStr) {
      const user = JSON.parse(userStr);
      console.log("👤 Restaurando user:", user);
      setUser(user);
    }
  }, []);

  return null;
}

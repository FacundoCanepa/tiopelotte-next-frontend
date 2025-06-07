"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/user-store";

export default function UserSessionLoader() {
  useUserStore();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedJwt = localStorage.getItem("jwt");

    if (storedUser) {
      try {
        useUserStore.getState().setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user", error);
      }
    }

    if (storedJwt) {
      useUserStore.getState().setJwt(storedJwt);
    }
  }, []);

  return null;
}
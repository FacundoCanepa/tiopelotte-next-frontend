"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/user-store";

export default function UserSessionLoader() {
  useUserStore();

  useEffect(() => {
    const data = localStorage.getItem("user-storage");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        const state = parsed.state ?? parsed;
        if (state.user) {
          useUserStore.getState().setUser(state.user);
        }
        if (state.jwt) {
          useUserStore.getState().setJwt(state.jwt);
        }
      } catch (error) {
        console.error("Failed to parse stored user", error);
      }
    }
  }, []);

  return null;
}
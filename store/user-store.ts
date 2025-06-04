"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserType } from "@/types/user";

type UserStore = {
  user: UserType | null;
  jwt: string | null;
  setUser: (user: UserType, jwt: string) => void;
  logout: () => void;
  checkLocalUser: () => boolean;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      jwt: null,
      setUser: (user, jwt) => {
        console.log("👤 Seteando user:", user);
        console.log("🔐 Seteando jwt:", jwt);
        set({ user, jwt });
      },
      logout: () => {
        console.log("👋 Cerrando sesión");
        set({ user: null, jwt: null });
      },
      checkLocalUser: () => {
        const { user, jwt } = get();
        return !!user && !!jwt;
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user, jwt: state.jwt }),
    }
  )
);

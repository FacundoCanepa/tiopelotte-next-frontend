import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserType = {
  id: number;
  email: string;
  username: string;
  // cualquier otro campo que uses
};

interface UserState {
  user: UserType | null;
  jwt: string | null;
  setUser: (user: UserType | null) => void;
  setJwt: (jwt: string | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      jwt: null,
      setUser: (user) => set({ user }),
      setJwt: (jwt) => set({ jwt }),
      clearUser: () => set({ user: null, jwt: null }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user, jwt: state.jwt }),
    }
  )
);
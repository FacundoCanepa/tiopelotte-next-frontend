// store/user-store.ts

import { create } from "zustand";

type User = {
  id: number;
  username: string;
  email: string;
};

type UserState = {
  user: User | null;
  jwt: string | null;
  setUser: (user: User, jwt: string) => void;
  logout: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  jwt: null,
  setUser: (user, jwt) => set({ user, jwt }),
  logout: () => set({ user: null, jwt: null }),
}));

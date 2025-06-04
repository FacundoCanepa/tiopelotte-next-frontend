import { create } from "zustand";

type User = {
  email: string;
  username: string;
  jwt: string;
};

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  checkLocalUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem("user");
    set({ user: null });
  },
  checkLocalUser: () => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        const user = JSON.parse(saved);
        set({ user });
      } catch {
        localStorage.removeItem("user");
      }
    }
  },
}));

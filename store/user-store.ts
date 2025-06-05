import { create } from "zustand";

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

export const useUserStore = create<UserState>((set) => ({
  user: null,
  jwt: null,
  setUser: (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
    set({ user });
  },
  setJwt: (jwt) => {
    if (jwt) {
      localStorage.setItem("jwt", jwt);
    }
    set({ jwt });
  },
  clearUser: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
    set({ user: null, jwt: null });
  },
}));
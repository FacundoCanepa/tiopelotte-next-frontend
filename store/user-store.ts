import { create } from "zustand";

type UserType = {
  id: number;
  username: string;
  email: string;
  jwt?: string;
};

type UserState = {
  user: UserType | null;
  jwt: string | null;
  setUser: (user: UserType, token: string) => void;
  logout: () => void;
  checkLocalUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  jwt: null,

  setUser: (user, token) => {
    console.log("👤 Seteando user:", user);
    console.log("🔐 Seteando jwt:", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("jwt", token);
    set({ user, jwt: token });
  },

  logout: () => {
    console.log("🚪 Cerrando sesión");
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
    set({ user: null, jwt: null });
  },

  checkLocalUser: () => {
    const storedUser = localStorage.getItem("user");
    const storedJwt = localStorage.getItem("jwt");

    if (storedUser && storedJwt) {
      try {
        const userParsed = JSON.parse(storedUser);
        console.log("🔁 Restaurando sesión:", userParsed);
        set({ user: userParsed, jwt: storedJwt });
      } catch (err) {
        console.warn("❌ Error parseando user del localStorage");
      }
    }
  },
}));

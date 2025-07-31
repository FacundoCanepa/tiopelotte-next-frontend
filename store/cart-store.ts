import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";

export type CartItem = {
  product: {
    id: number;
    productName: string;
    price: number;
    img: any;
    unidadMedida: string;
  };
  quantity: number;
};

export type CartStore = {
  cart: CartItem[];
  tipoEntrega: "domicilio" | "local" | null;
  zona: string;
  direccion: string;
  referencias: string;
  tipoPago: "mercado pago" | "efectivo" | "Elegís al momento de pagar";
  total: number;
  nombre: string;
  telefono: string;

  addToCart: (product: CartItem["product"], quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;

  setTipoEntrega: (tipo: "domicilio" | "local") => void;
  setZona: (zona: string) => void;
  setDireccion: (direccion: string) => void;
  setReferencias: (referencias: string) => void;
  setTipoPago: (tipo: "mercado pago" | "efectivo") => void;
  setTotal: (total: number) => void;
  setNombre: (nombre: string) => void;
  setTelefono: (telefono: string) => void;

  getTotalPrice: () => number; 
  getTotalItems: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      tipoEntrega: "domicilio",
      zona: "",
      direccion: "",
      referencias: "",
      tipoPago: "mercado pago",
      total: 0,
      nombre: "",
      telefono: "",

      addToCart: (product, quantity) => {
        try {
        const existing = get().cart.find((item) => item.product.id === product.id);
        
        // Track add to cart event
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "add_to_cart", {
            currency: "ARS",
            value: product.price * quantity,
            items: [{
              item_id: product.id.toString(),
              item_name: product.productName,
              category: "Pastas",
              quantity: quantity,
              price: product.price,
            }],
          });
        }
        
        if (existing) {
          const updatedCart = get().cart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          set({ cart: updatedCart });
            toast.success(`${product.productName} actualizado en el carrito`);
        } else {
          set({ cart: [...get().cart, { product, quantity }] });
            toast.success(`${product.productName} agregado al carrito`);
        }
        } catch (error) {
          toast.error("Error al agregar producto al carrito");
        }
      },

      removeFromCart: (productId) => {
        try {
          const item = get().cart.find(item => item.product.id === productId);
          
          // Track remove from cart event
          if (item && typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "remove_from_cart", {
              currency: "ARS",
              value: item.product.price * item.quantity,
              items: [{
                item_id: item.product.id.toString(),
                item_name: item.product.productName,
                category: "Pastas",
                quantity: item.quantity,
                price: item.product.price,
              }],
            });
          }
          
        set({ cart: get().cart.filter((item) => item.product.id !== productId) });
          if (item) {
            toast.success(`${item.product.productName} eliminado del carrito`);
          }
        } catch (error) {
          toast.error("Error al eliminar producto del carrito");
        }
      },

      updateQuantity: (productId, quantity) => {
        try {
        const updatedCart = get().cart.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        );
        set({ cart: updatedCart });
        } catch (error) {
          toast.error("Error al actualizar cantidad");
        }
      },

      clearCart: () =>
        set({
          cart: [],
          tipoEntrega: null,
          zona: "",
          direccion: "",
          referencias: "",
          tipoPago: "mercado pago",
          total: 0,
          nombre: "",
          telefono: "",
        }),

      setTipoEntrega: (tipo) => set({ tipoEntrega: tipo }),
      setZona: (zona) => set({ zona }),
      setDireccion: (direccion) => set({ direccion }),
      setReferencias: (referencias) => set({ referencias }),
      setTipoPago: (tipo) => set({ tipoPago: tipo }),
      setTotal: (total) => set({ total }),
      setNombre: (nombre) => set({ nombre }),
      setTelefono: (telefono) => set({ telefono }),

      getTotalPrice: () =>
        get().cart.reduce((acc, item) => acc + item.quantity * item.product.price, 0),

      getTotalItems: () =>
        get().cart.reduce((acc, item) => acc + item.quantity, 0),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
        tipoEntrega: state.tipoEntrega,
        zona: state.zona,
        direccion: state.direccion,
        referencias: state.referencias,
        tipoPago: state.tipoPago,
        nombre: state.nombre,
        telefono: state.telefono,
      }),
    }
  )
);

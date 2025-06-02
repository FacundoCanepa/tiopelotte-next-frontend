import { create } from "zustand"
import { persist } from "zustand/middleware"
import { ProductType } from "@/types/product"

type CartItem = {
  product: ProductType
  quantity: number
}

type CartStore = {
  cart: CartItem[]
  addToCart: (product: ProductType, quantity: number) => void
  removeFromCart: (productId: number) => void
  clearCart: () => void
  updateQuantity: (productId: number, quantity: number) => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product, quantity) => {
        const existing = get().cart.find((item) => item.product.id === product.id)
        if (existing) {
          const updatedCart = get().cart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
          set({ cart: updatedCart })
        } else {
          set({ cart: [...get().cart, { product, quantity }] })
        }
      },

      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.product.id !== productId) })
      },

      clearCart: () => set({ cart: [] }),

      updateQuantity: (productId, quantity) => {
        const updatedCart = get().cart.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
        set({ cart: updatedCart })
      },

      getTotalPrice: () =>
        get().cart.reduce(
          (acc, item) => acc + item.quantity * item.product.price,
          0
        ),

      getTotalItems: () =>
        get().cart.reduce((acc, item) => acc + item.quantity, 0),
    }),
    {
      name: "cart-storage", // localStorage key
    }
  )
)

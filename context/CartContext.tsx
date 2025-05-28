"use client"

import { createContext, useContext, useState } from "react"
import { ProductType } from "@/types/product"

type CartItem = {
  product: ProductType
  quantity: number
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (product: ProductType, quantity: number) => void
  // Luego podés agregar: removeFromCart, clearCart, etc.
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (product: ProductType, quantity: number) => {
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.product.id === product.id)
      if (existing) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        return [...prevCart, { product, quantity }]
      }
    })
  }

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart debe usarse dentro del CartProvider")
  }
  return context
}

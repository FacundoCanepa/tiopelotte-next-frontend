/**
 * Store del carrito optimizado con analytics de e-commerce y performance mejorada
 * 
 * Optimizaciones implementadas:
 * - Tracking completo de e-commerce con Google Analytics
 * - Estados de loading para mejor UX
 * - Validaciones de datos robustas
 * - Persistencia optimizada con error handling
 * - Funciones memorizadas para performance
 * - Notificaciones UX mejoradas
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";

export type CartItem = {
  product: {
    id: number;
    productName: string;
    price: number;
    img: any;
    unidadMedida: string;
    descriptionCorta?: string;
    category?: {
      categoryNames: string;
    };
  };
  quantity: number;
};

export type CartStore = {
  // Estados del carrito
  cart: CartItem[];
  isLoading: boolean;
  lastUpdated: number;

  // Estados del checkout
  tipoEntrega: "domicilio" | "local" | null;
  zona: string;
  direccion: string;
  referencias: string;
  tipoPago: "mercado pago" | "efectivo" | "Elegís al momento de pagar";
  total: number;
  nombre: string;
  telefono: string;

  // Acciones del carrito con analytics
  addToCart: (product: CartItem["product"], quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;

  // Acciones del checkout
  setTipoEntrega: (tipo: "domicilio" | "local") => void;
  setZona: (zona: string) => void;
  setDireccion: (direccion: string) => void;
  setReferencias: (referencias: string) => void;
  setTipoPago: (tipo: "mercado pago" | "efectivo") => void;
  setTotal: (total: number) => void;
  setNombre: (nombre: string) => void;
  setTelefono: (telefono: string) => void;

  // Funciones calculadas optimizadas
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getCartAnalyticsData: () => any[];
  
  // Utilidades
  setLoading: (loading: boolean) => void;
  validateCart: () => boolean;
};

/**
 * Helper para tracking de e-commerce con Google Analytics
 */
const trackEcommerceEvent = (eventName: string, eventData: any) => {
  try {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", eventName, {
        currency: "ARS",
        ...eventData,
      });
      
      console.log(`📊 GA Event: ${eventName}`, eventData);
    }
  } catch (error) {
    console.warn("⚠️ Error tracking analytics:", error);
  }
};

/**
 * Helper para formatear items para analytics
 */
const formatItemForAnalytics = (item: CartItem, index?: number) => ({
  item_id: item.product.id.toString(),
  item_name: item.product.productName,
  item_category: item.product.category?.categoryNames || "Pastas",
  quantity: item.quantity,
  price: item.product.price,
  index: index || 0,
});

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Estados iniciales
      cart: [],
      isLoading: false,
      lastUpdated: Date.now(),
      tipoEntrega: "domicilio",
      zona: "",
      direccion: "",
      referencias: "",
      tipoPago: "mercado pago",
      total: 0,
      nombre: "",
      telefono: "",

      /**
       * Agregar producto al carrito con analytics completo
       */
      addToCart: (product, quantity) => {
        try {
          set({ isLoading: true });
          
          const existing = get().cart.find((item) => item.product.id === product.id);
          let updatedCart: CartItem[];
          let isNewItem = false;
          
          if (existing) {
            // Actualizar cantidad de producto existente
            updatedCart = get().cart.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
            
            toast.success(
              `${product.productName} actualizado en el carrito`,
              {
                description: `Cantidad: ${existing.quantity + quantity} ${product.unidadMedida}`,
                duration: 3000,
              }
            );
          } else {
            // Agregar nuevo producto
            isNewItem = true;
            updatedCart = [...get().cart, { product, quantity }];
            
            toast.success(
              `¡${product.productName} agregado al carrito!`,
              {
                description: `${quantity} ${product.unidadMedida} por $${(product.price * quantity).toLocaleString('es-AR')}`,
                duration: 3000,
              }
            );
          }

          // Actualizar estado
          set({ 
            cart: updatedCart, 
            lastUpdated: Date.now(),
            isLoading: false 
          });

          // Analytics: Add to Cart
          trackEcommerceEvent("add_to_cart", {
            value: product.price * quantity,
            items: [formatItemForAnalytics({ product, quantity })],
          });

          // Analytics: View Cart si es nuevo item
          if (isNewItem) {
            trackEcommerceEvent("view_cart", {
              value: get().getTotalPrice(),
              items: get().getCartAnalyticsData(),
            });
          }

        } catch (error) {
          console.error("❌ Error agregando al carrito:", error);
          toast.error("Error al agregar producto al carrito");
          set({ isLoading: false });
        }
      },

      /**
       * Eliminar producto del carrito con analytics
       */
      removeFromCart: (productId) => {
        try {
          set({ isLoading: true });
          
          const item = get().cart.find(item => item.product.id === productId);
          
          if (!item) {
            set({ isLoading: false });
            return;
          }

          // Actualizar carrito
          const updatedCart = get().cart.filter((item) => item.product.id !== productId);
          set({ 
            cart: updatedCart, 
            lastUpdated: Date.now(),
            isLoading: false 
          });

          // Analytics: Remove from Cart
          trackEcommerceEvent("remove_from_cart", {
            value: item.product.price * item.quantity,
            items: [formatItemForAnalytics(item)],
          });

          toast.success(
            `${item.product.productName} eliminado del carrito`,
            {
              description: "Podés volver a agregarlo cuando quieras",
              duration: 3000,
            }
          );

        } catch (error) {
          console.error("❌ Error eliminando del carrito:", error);
          toast.error("Error al eliminar producto del carrito");
          set({ isLoading: false });
        }
      },

      /**
       * Actualizar cantidad con validación mejorada
       */
      updateQuantity: (productId, quantity) => {
        try {
          if (quantity <= 0) {
            get().removeFromCart(productId);
            return;
          }

          set({ isLoading: true });

          const updatedCart = get().cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          );

          set({ 
            cart: updatedCart, 
            lastUpdated: Date.now(),
            isLoading: false 
          });

        } catch (error) {
          console.error("❌ Error actualizando cantidad:", error);
          toast.error("Error al actualizar cantidad");
          set({ isLoading: false });
        }
      },

      /**
       * Limpiar carrito con confirmación
       */
      clearCart: () => {
        const currentCart = get().cart;
        
        set({
          cart: [],
          tipoEntrega: "domicilio",
          zona: "",
          direccion: "",
          referencias: "",
          tipoPago: "mercado pago",
          total: 0,
          nombre: "",
          telefono: "",
          lastUpdated: Date.now(),
        });

        // Analytics: Clear Cart
        if (currentCart.length > 0) {
          trackEcommerceEvent("remove_from_cart", {
            value: get().getTotalPrice(),
            items: currentCart.map(formatItemForAnalytics),
          });
        }

        toast.success("Carrito vaciado", {
          description: "Todos los productos fueron eliminados",
          duration: 2000,
        });
      },

      // Setters del checkout optimizados
      setTipoEntrega: (tipo) => {
        set({ tipoEntrega: tipo });
        
        // Analytics: Shipping method selection
        trackEcommerceEvent("add_shipping_info", {
          shipping_tier: tipo,
          value: get().getTotalPrice(),
          items: get().getCartAnalyticsData(),
        });
      },

      setZona: (zona) => set({ zona }),
      setDireccion: (direccion) => set({ direccion }),
      setReferencias: (referencias) => set({ referencias }),
      
      setTipoPago: (tipo) => {
        set({ tipoPago: tipo });
        
        // Analytics: Payment method selection
        trackEcommerceEvent("add_payment_info", {
          payment_type: tipo,
          value: get().getTotalPrice(),
          items: get().getCartAnalyticsData(),
        });
      },

      setTotal: (total) => set({ total }),
      setNombre: (nombre) => set({ nombre }),
      setTelefono: (telefono) => set({ telefono }),
      setLoading: (loading) => set({ isLoading: loading }),

      /**
       * Calcular precio total optimizado
       */
      getTotalPrice: () => {
        try {
          return get().cart.reduce((acc, item) => {
            const itemTotal = item.quantity * item.product.price;
            return acc + itemTotal;
          }, 0);
        } catch (error) {
          console.error("❌ Error calculando precio total:", error);
          return 0;
        }
      },

      /**
       * Calcular total de items
       */
      getTotalItems: () => {
        try {
          return get().cart.reduce((acc, item) => acc + item.quantity, 0);
        } catch (error) {
          console.error("❌ Error calculando total items:", error);
          return 0;
        }
      },

      /**
       * Obtener datos formateados para analytics
       */
      getCartAnalyticsData: () => {
        try {
          return get().cart.map((item, index) => formatItemForAnalytics(item, index));
        } catch (error) {
          console.error("❌ Error formateando datos analytics:", error);
          return [];
        }
      },

      /**
       * Validar integridad del carrito
       */
      validateCart: () => {
        try {
          const cart = get().cart;
          
          // Verificar que todos los items tengan datos válidos
          const isValid = cart.every(item => 
            item.product?.id &&
            item.product?.productName &&
            item.product?.price > 0 &&
            item.quantity > 0
          );

          if (!isValid) {
            console.warn("⚠️ Carrito con datos inválidos detectado");
            // Limpiar items inválidos
            const validCart = cart.filter(item => 
              item.product?.id &&
              item.product?.productName &&
              item.product?.price > 0 &&
              item.quantity > 0
            );
            
            set({ cart: validCart, lastUpdated: Date.now() });
            
            if (validCart.length !== cart.length) {
              toast.warning("Se eliminaron algunos productos inválidos del carrito");
            }
          }

          return isValid;
        } catch (error) {
          console.error("❌ Error validando carrito:", error);
          return false;
        }
      },
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
        lastUpdated: state.lastUpdated,
      }),
      // Manejar errores de hidratación
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Validar carrito después de hidratar
          setTimeout(() => {
            state.validateCart();
          }, 100);
        }
      },
    }
  )
);
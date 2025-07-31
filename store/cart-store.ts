/**
 * Store del carrito optimizado para e-commerce con persistencia segura
 * Incluye validaciones, analytics y manejo de errores robusto
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { ProductType } from "@/types/product";

export interface CartItem {
  product: ProductType;
  quantity: number;
  addedAt: number;
}

export interface CartStore {
  // Estado del carrito
  items: CartItem[];
  isLoading: boolean;
  lastUpdated: number;

  // Información de checkout
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
  };
  
  deliveryInfo: {
    type: "delivery" | "pickup";
    address?: string;
    zone?: string;
    notes?: string;
  };
  
  paymentInfo: {
    method: "mercadopago" | "cash" | "pending";
  };

  // Acciones del carrito
  addItem: (product: ProductType, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;

  // Acciones de checkout
  setCustomerInfo: (info: Partial<CartStore['customerInfo']>) => void;
  setDeliveryInfo: (info: Partial<CartStore['deliveryInfo']>) => void;
  setPaymentInfo: (info: Partial<CartStore['paymentInfo']>) => void;

  // Getters
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getCartSummary: () => {
    totalItems: number;
    totalPrice: number;
    subtotal: number;
    deliveryFee: number;
  };

  // Validaciones
  validateCart: () => boolean;
  validateCheckout: () => { isValid: boolean; errors: string[] };
}

// Zonas de delivery con precios
const DELIVERY_ZONES = {
  "etcheverry-1": 1600,
  "etcheverry-2": 1500,
  "olmos": 1700,
  "los-hornos-1": 2000,
  "los-hornos-2": 2100,
  "abasto": 3300,
  // ... más zonas
} as const;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      items: [],
      isLoading: false,
      lastUpdated: Date.now(),
      
      customerInfo: {
        name: "",
        phone: "",
        email: "",
      },
      
      deliveryInfo: {
        type: "delivery",
        address: "",
        zone: "",
        notes: "",
      },
      
      paymentInfo: {
        method: "mercadopago",
      },

      // Agregar producto al carrito
      addItem: (product, quantity) => {
        try {
          set({ isLoading: true });
          
          const currentItems = get().items;
          const existingItem = currentItems.find(item => item.product.id === product.id);
          
          let newItems: CartItem[];
          
          if (existingItem) {
            // Actualizar cantidad existente
            newItems = currentItems.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
            
            toast.success(`${product.productName} actualizado en el carrito`, {
              description: `Nueva cantidad: ${existingItem.quantity + quantity}`,
            });
          } else {
            // Agregar nuevo producto
            newItems = [...currentItems, {
              product,
              quantity,
              addedAt: Date.now(),
            }];
            
            toast.success(`${product.productName} agregado al carrito`, {
              description: `${quantity} ${product.unidadMedida}`,
            });
          }

          set({
            items: newItems,
            lastUpdated: Date.now(),
            isLoading: false,
          });

          // Analytics
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'add_to_cart', {
              currency: 'ARS',
              value: product.price * quantity,
              items: [{
                item_id: product.id.toString(),
                item_name: product.productName,
                category: product.category?.categoryNames || 'Pastas',
                quantity: quantity,
                price: product.price,
              }],
            });
          }

        } catch (error) {
          console.error('Error agregando al carrito:', error);
          toast.error('Error al agregar producto al carrito');
          set({ isLoading: false });
        }
      },

      // Eliminar producto del carrito
      removeItem: (productId) => {
        try {
          const currentItems = get().items;
          const item = currentItems.find(item => item.product.id === productId);
          
          if (!item) return;

          const newItems = currentItems.filter(item => item.product.id !== productId);
          
          set({
            items: newItems,
            lastUpdated: Date.now(),
          });

          toast.success(`${item.product.productName} eliminado del carrito`);

          // Analytics
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'remove_from_cart', {
              currency: 'ARS',
              value: item.product.price * item.quantity,
              items: [{
                item_id: item.product.id.toString(),
                item_name: item.product.productName,
                category: item.product.category?.categoryNames || 'Pastas',
                quantity: item.quantity,
                price: item.product.price,
              }],
            });
          }

        } catch (error) {
          console.error('Error eliminando del carrito:', error);
          toast.error('Error al eliminar producto');
        }
      },

      // Actualizar cantidad
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        try {
          const newItems = get().items.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          );

          set({
            items: newItems,
            lastUpdated: Date.now(),
          });

        } catch (error) {
          console.error('Error actualizando cantidad:', error);
          toast.error('Error al actualizar cantidad');
        }
      },

      // Limpiar carrito
      clearCart: () => {
        set({
          items: [],
          customerInfo: { name: "", phone: "", email: "" },
          deliveryInfo: { type: "delivery", address: "", zone: "", notes: "" },
          paymentInfo: { method: "mercadopago" },
          lastUpdated: Date.now(),
        });
        
        toast.success('Carrito vaciado');
      },

      // Setters para checkout
      setCustomerInfo: (info) => {
        set(state => ({
          customerInfo: { ...state.customerInfo, ...info }
        }));
      },

      setDeliveryInfo: (info) => {
        set(state => ({
          deliveryInfo: { ...state.deliveryInfo, ...info }
        }));
      },

      setPaymentInfo: (info) => {
        set(state => ({
          paymentInfo: { ...state.paymentInfo, ...info }
        }));
      },

      // Getters
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      },

      getCartSummary: () => {
        const items = get().items;
        const deliveryInfo = get().deliveryInfo;
        
        const totalItems = items.reduce((total, item) => total + item.quantity, 0);
        const subtotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
        
        let deliveryFee = 0;
        if (deliveryInfo.type === "delivery" && deliveryInfo.zone) {
          deliveryFee = DELIVERY_ZONES[deliveryInfo.zone as keyof typeof DELIVERY_ZONES] || 0;
        }
        
        const totalPrice = subtotal + deliveryFee;

        return {
          totalItems,
          totalPrice,
          subtotal,
          deliveryFee,
        };
      },

      // Validar carrito
      validateCart: () => {
        const items = get().items;
        
        // Verificar que todos los items sean válidos
        const isValid = items.every(item => 
          item.product?.id &&
          item.product?.productName &&
          item.product?.price > 0 &&
          item.quantity > 0
        );

        if (!isValid) {
          // Limpiar items inválidos
          const validItems = items.filter(item => 
            item.product?.id &&
            item.product?.productName &&
            item.product?.price > 0 &&
            item.quantity > 0
          );
          
          set({ items: validItems });
          
          if (validItems.length !== items.length) {
            toast.warning('Se eliminaron productos inválidos del carrito');
          }
        }

        return isValid;
      },

      // Validar checkout
      validateCheckout: () => {
        const { customerInfo, deliveryInfo, items } = get();
        const errors: string[] = [];

        // Validar carrito no vacío
        if (items.length === 0) {
          errors.push('El carrito está vacío');
        }

        // Validar información del cliente
        if (!customerInfo.name.trim()) {
          errors.push('El nombre es requerido');
        }
        
        if (!customerInfo.phone.trim()) {
          errors.push('El teléfono es requerido');
        }

        // Validar información de entrega
        if (deliveryInfo.type === "delivery") {
          if (!deliveryInfo.address?.trim()) {
            errors.push('La dirección es requerida para delivery');
          }
          if (!deliveryInfo.zone) {
            errors.push('La zona de entrega es requerida');
          }
        }

        return {
          isValid: errors.length === 0,
          errors,
        };
      },
    }),
    {
      name: "tio-pelotte-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        customerInfo: state.customerInfo,
        deliveryInfo: state.deliveryInfo,
        paymentInfo: state.paymentInfo,
        lastUpdated: state.lastUpdated,
      }),
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
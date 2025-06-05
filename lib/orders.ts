import { useCartStore } from "@/store/cart-store";
import { ProductType } from "@/types/product";

export type RepeatItem = {
  productId: number;
  quantity: number;
};

export async function repeatOrder(items: RepeatItem[]) {
  for (const item of items) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${item.productId}?populate=*`
      );
      const data = await res.json();
      const product: ProductType | undefined = data.data;
      if (product) {
        useCartStore.getState().addToCart(product, item.quantity);
      }
    } catch (err) {
      console.error("Error al repetir producto", item.productId, err);
    }
  }
}
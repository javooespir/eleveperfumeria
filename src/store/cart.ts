import { create } from "zustand";
import { persist } from "zustand/middleware";
import { finalPrice, type BuyerType } from "@/lib/types";

// El item guarda los precios del producto, no un unitPrice ya calculado:
// el precio efectivo depende del tipo de compra, que puede cambiar despues
// de agregar (al llegar a 5 unidades pasa a mayorista solo). Guardando el
// numero final, el carrito quedaba con precios viejos.
export type CartItem = {
  productId: string;
  name: string;
  price: number;
  wholesalePrice: number | null;
  discountActive: boolean;
  discountPercent: number;
  image: string;
  qty: number;
  stock: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

// El carrito se guarda en el navegador: sin esto, recargar la pagina o
// volver mas tarde dejaba al cliente con el carrito vacio.
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            const nextQty = Math.min(existing.qty + qty, existing.stock);
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...i, qty: nextQty } : i
              ),
              isOpen: true,
            };
          }
          return {
            items: [...state.items, { ...item, qty: Math.min(qty, item.stock) }],
            isOpen: true,
          };
        }),
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      updateQty: (productId, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId ? { ...i, qty: Math.min(qty, i.stock) } : i
                ),
        })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "eleve-cart",
      // isOpen no se guarda: el carrito no debe abrirse solo al entrar.
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export function itemUnitPrice(item: CartItem, buyerType: BuyerType) {
  return finalPrice(item, buyerType);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

export function cartSubtotal(items: CartItem[], buyerType: BuyerType = "minorista") {
  return items.reduce((sum, i) => sum + itemUnitPrice(i, buyerType) * i.qty, 0);
}

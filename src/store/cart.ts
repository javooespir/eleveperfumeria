import { create } from "zustand";

export type CartItem = {
  productId: string;
  name: string;
  unitPrice: number;
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

export const useCartStore = create<CartState>((set) => ({
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
}));

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
}

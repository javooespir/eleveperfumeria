"use client";

import { useBuyerTypeStore } from "@/store/buyer-type";
import { useCartStore, cartCount } from "@/store/cart";
import { WHOLESALE_MIN_UNITS } from "@/lib/types";

export function WholesaleReminder() {
  const buyerType = useBuyerTypeStore((s) => s.buyerType);
  const items = useCartStore((s) => s.items);
  const count = cartCount(items);

  if (buyerType !== "mayorista" || count === 0 || count >= WHOLESALE_MIN_UNITS) return null;

  const missing = WHOLESALE_MIN_UNITS - count;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-foreground text-background text-center text-sm py-3 px-4">
      Te faltan <strong>{missing}</strong> {missing === 1 ? "unidad" : "unidades"} para completar
      el pedido mayorista (mínimo {WHOLESALE_MIN_UNITS}).
    </div>
  );
}

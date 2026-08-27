"use client";

import { useCartStore, cartCount } from "@/store/cart";
import { useBuyerTypeStore } from "@/store/buyer-type";
import { useHydrated } from "@/store/use-hydrated";
import { effectiveBuyerType, type BuyerType } from "@/lib/types";

/**
 * Tipo de compra aplicado en toda la UI: el elegido en el gate, o mayorista
 * automatico si el carrito llega al minimo de unidades.
 *
 * Ambos datos viven en localStorage, asi que hasta hidratar se devuelve
 * "minorista" — que es lo que renderizo el servidor. Sin esto los precios
 * del primer render podian no coincidir y romper la hidratacion.
 */
export function useEffectiveBuyerType(): BuyerType {
  const hydrated = useHydrated();
  const selected = useBuyerTypeStore((s) => s.buyerType);
  const count = useCartStore((s) => cartCount(s.items));
  if (!hydrated) return "minorista";
  return effectiveBuyerType(selected, count);
}

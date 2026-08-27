"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore, cartSubtotal, cartCount, itemUnitPrice } from "@/store/cart";
import { useBuyerTypeStore } from "@/store/buyer-type";
import { useEffectiveBuyerType } from "@/store/use-effective-buyer-type";
import { useHydrated } from "@/store/use-hydrated";
import { WHOLESALE_MIN_UNITS } from "@/lib/types";

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

export function CartDrawer() {
  const hydrated = useHydrated();
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const storedItems = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const selectedBuyerType = useBuyerTypeStore((s) => s.buyerType);
  const buyerType = useEffectiveBuyerType();
  const items = hydrated ? storedItems : [];
  const subtotal = cartSubtotal(items, buyerType);
  const count = cartCount(items);
  const belowWholesaleMin = selectedBuyerType === "mayorista" && count < WHOLESALE_MIN_UNITS;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent side="right" className="p-0 flex flex-col">
        <SheetHeader className="border-b border-border">
          <SheetTitle>Tu carrito</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center px-4">
            <p className="text-sm text-muted-foreground">Tu carrito está vacío.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3">
                <div className="relative size-16 shrink-0 overflow-hidden bg-muted">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm truncate">{item.name}</p>
                    <button
                      onClick={() => removeItem(item.productId)}
                      aria-label={`Quitar ${item.name}`}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {money(itemUnitPrice(item, buyerType))}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.productId, item.qty - 1)}
                      aria-label="Restar cantidad"
                      className="flex size-6 items-center justify-center border border-border"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="text-sm w-4 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.productId, item.qty + 1)}
                      aria-label="Sumar cantidad"
                      disabled={item.qty >= item.stock}
                      className="flex size-6 items-center justify-center border border-border disabled:opacity-30"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <SheetFooter className="border-t border-border">
            {selectedBuyerType !== "mayorista" && buyerType === "mayorista" && (
              <p className="text-xs text-center text-foreground bg-champagne/25 rounded-md py-2 px-3 mb-3">
                Llegaste a {WHOLESALE_MIN_UNITS} unidades: se aplicó precio mayorista.
              </p>
            )}
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Subtotal</span>
              <span className="font-medium">{money(subtotal)}</span>
            </div>
            {belowWholesaleMin ? (
              <>
                <Button disabled className="w-full">
                  Finalizar pedido
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Como mayorista necesitás {WHOLESALE_MIN_UNITS} unidades mínimo. Te faltan{" "}
                  {WHOLESALE_MIN_UNITS - count}.
                </p>
              </>
            ) : (
              <SheetClose asChild>
                <Button asChild className="w-full">
                  <Link href="/checkout">Finalizar pedido</Link>
                </Button>
              </SheetClose>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

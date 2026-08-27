"use client";

import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore, cartCount } from "@/store/cart";
import { useHydrated } from "@/store/use-hydrated";
import { useBuyerTypeStore } from "@/store/buyer-type";
import { Logo } from "@/components/site/Logo";
import type { Category } from "@/lib/types";

export function Header({ categories }: { categories: Category[] }) {
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const toggleCart = useCartStore((s) => s.toggle);
  const clearCart = useCartStore((s) => s.clear);
  // Hasta hidratar se muestra 0: el HTML del servidor no conoce el carrito
  // guardado en el navegador.
  const count = hydrated ? cartCount(items) : 0;
  const storedBuyerType = useBuyerTypeStore((s) => s.buyerType);
  const buyerType = hydrated ? storedBuyerType : null;
  const resetBuyerType = useBuyerTypeStore((s) => s.reset);

  const handleResetBuyerType = () => {
    clearCart();
    resetBuyerType();
  };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 h-16">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Abrir menú">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SheetHeader className="border-b border-border">
              <SheetTitle>Categorías</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col p-4 gap-1">
              <SheetClose asChild>
                <Link href="/catalogo" className="py-2.5 text-sm">
                  Todo el catálogo
                </Link>
              </SheetClose>
              {categories.map((c) => (
                <SheetClose asChild key={c.id}>
                  <Link href={`/catalogo?categoria=${c.slug}`} className="py-2.5 text-sm">
                    {c.name}
                  </Link>
                </SheetClose>
              ))}
              {buyerType && (
                <SheetClose asChild>
                  <button
                    onClick={handleResetBuyerType}
                    className="py-2.5 text-sm text-left text-muted-foreground"
                  >
                    Cambiar tipo de compra ({buyerType === "mayorista" ? "Mayorista" : "Minorista"})
                  </button>
                </SheetClose>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        <Logo />

        <div className="flex items-center gap-4">
          {buyerType && (
            <button
              onClick={handleResetBuyerType}
              className="hidden sm:flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
              title="Cambiar tipo de compra"
            >
              {buyerType === "mayorista" ? "Mayorista" : "Minorista"}
              <span aria-hidden="true">·</span>
              <span className="underline">cambiar</span>
            </button>
          )}
          <Link
            href="/catalogo"
            className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground"
          >
            Catálogo
          </Link>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Carrito, ${count} productos`}
            onClick={toggleCart}
            className="relative"
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-medium text-background">
                {count}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}

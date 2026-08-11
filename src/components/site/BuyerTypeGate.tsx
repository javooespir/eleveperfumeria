"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useBuyerTypeStore } from "@/store/buyer-type";
import { WHOLESALE_MIN_UNITS } from "@/lib/types";

export function BuyerTypeGate() {
  const buyerType = useBuyerTypeStore((s) => s.buyerType);
  const setBuyerType = useBuyerTypeStore((s) => s.setBuyerType);
  // Evita el flash del modal en el primer render del servidor (persist hidrata en cliente).
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated || buyerType) return null;

  return (
    <Dialog open>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-md text-center"
      >
        <DialogTitle className="font-heading text-xl font-light">¿Cómo comprás?</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          Elegí tu tipo de compra para ver los precios correspondientes.
        </DialogDescription>

        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={() => setBuyerType("minorista")}
            className="border border-border px-5 py-4 text-left hover:border-foreground transition-colors"
          >
            <p className="font-medium">Minorista</p>
            <p className="text-xs text-muted-foreground mt-1">
              Compro para mí, sin cantidad mínima.
            </p>
          </button>

          <button
            onClick={() => setBuyerType("mayorista")}
            className="border border-border px-5 py-4 text-left hover:border-foreground transition-colors"
          >
            <p className="font-medium">Mayorista</p>
            <p className="text-xs text-muted-foreground mt-1">
              Precios preferenciales. Mínimo {WHOLESALE_MIN_UNITS} unidades por pedido.
            </p>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

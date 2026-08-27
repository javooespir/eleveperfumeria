"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteOrder } from "../actions";

export function DeleteOrderButton({ id, customerName }: { id: string; customerName: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function remove(restock: boolean) {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", id);
      fd.set("restock", restock ? "true" : "false");
      await deleteOrder(fd);
    });
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={`Eliminar pedido de ${customerName}`}
        className="text-muted-foreground hover:text-destructive transition-colors"
      >
        <Trash2 className="size-4" />
      </button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1.5 text-xs">
      <p className="text-muted-foreground">¿Eliminar este pedido?</p>
      <div className="flex items-center gap-2">
        {isPending && <Loader2 className="size-3.5 animate-spin text-muted-foreground" />}
        <button
          type="button"
          disabled={isPending}
          onClick={() => remove(true)}
          className="underline text-destructive disabled:opacity-50"
        >
          Sí, devolver stock
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => remove(false)}
          className="underline text-destructive disabled:opacity-50"
        >
          Sí, sin devolver
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => setConfirming(false)}
          className="underline text-muted-foreground disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

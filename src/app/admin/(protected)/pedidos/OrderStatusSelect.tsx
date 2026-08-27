"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { updateOrderStatus, confirmOrderPayment } from "../actions";

const STATUSES = [
  { value: "PENDIENTE_CONFIRMACION", label: "Pendiente de confirmación" },
  { value: "NUEVO", label: "Nuevo" },
  { value: "EN_PROCESO", label: "En proceso" },
  { value: "ENTREGADO", label: "Entregado" },
];

export function OrderStatusSelect({ id, status }: { id: string; status: string }) {
  // useTransition da feedback de "guardando": antes el cambio se escribia en
  // la base pero en pantalla no pasaba nada visible, asi que parecia roto.
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      {status === "PENDIENTE_CONFIRMACION" && (
        <button
          type="submit"
          onClick={() =>
            startTransition(async () => {
              const fd = new FormData();
              fd.set("id", id);
              await confirmOrderPayment(fd);
            })
          }
          className="rounded-md bg-foreground text-background px-3 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          disabled={isPending}
        >
          Confirmar pago
        </button>
      )}

      <div className="flex items-center gap-1.5">
        {isPending && <Loader2 className="size-3.5 animate-spin text-muted-foreground" />}
        <select
          value={status}
          disabled={isPending}
          onChange={(e) => {
            const next = e.target.value;
            startTransition(async () => {
              const fd = new FormData();
              fd.set("id", id);
              fd.set("status", next);
              await updateOrderStatus(fd);
            });
          }}
          className="rounded-md border border-input bg-background px-2 py-1.5 text-xs disabled:opacity-50"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

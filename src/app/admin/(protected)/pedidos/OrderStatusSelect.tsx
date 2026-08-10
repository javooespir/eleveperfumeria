"use client";

import { updateOrderStatus, confirmOrderPayment } from "../actions";

const STATUSES = [
  { value: "PENDIENTE_CONFIRMACION", label: "Pendiente de confirmación" },
  { value: "NUEVO", label: "Nuevo" },
  { value: "EN_PROCESO", label: "En proceso" },
  { value: "ENTREGADO", label: "Entregado" },
];

export function OrderStatusSelect({ id, status }: { id: string; status: string }) {
  return (
    <div className="flex items-center gap-2">
      {status === "PENDIENTE_CONFIRMACION" && (
        <form action={confirmOrderPayment}>
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            className="rounded-md bg-foreground text-background px-3 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity"
          >
            Confirmar pago
          </button>
        </form>
      )}
      <form action={updateOrderStatus} className="flex items-center gap-2">
        <input type="hidden" name="id" value={id} />
        <select
          name="status"
          defaultValue={status}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          className="rounded-md border border-input bg-background px-2 py-1.5 text-xs"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
}

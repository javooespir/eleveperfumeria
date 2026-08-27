import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { zoneLabel } from "@/lib/shipping";
import { OrderStatusSelect } from "./OrderStatusSelect";
import { DeleteOrderButton } from "./DeleteOrderButton";

export const dynamic = "force-dynamic";

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

// El estado ahora se ve como etiqueta en la tarjeta. Antes solo existia
// dentro del desplegable, asi que cambiarlo no producia ningun cambio
// visible y parecia que el boton no hacia nada.
const STATUS_STYLE: Record<string, { label: string; className: string }> = {
  PENDIENTE_CONFIRMACION: {
    label: "Pendiente de confirmación",
    className: "bg-amber-500/15 text-amber-700",
  },
  NUEVO: { label: "Nuevo", className: "bg-blue-500/15 text-blue-700" },
  EN_PROCESO: { label: "En proceso", className: "bg-violet-500/15 text-violet-700" },
  ENTREGADO: { label: "Entregado", className: "bg-emerald-500/15 text-emerald-700" },
};

export default async function PedidosPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-heading font-light mb-1">Pedidos</h1>
      <p className="text-sm text-muted-foreground mb-8">{orders.length} pedidos recibidos</p>

      {orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">Todavía no hay pedidos.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((o) => {
            const items = JSON.parse(o.itemsJson) as {
              name: string;
              qty: number;
              unitPrice: number;
            }[];
            const totalUnits = items.reduce((sum, i) => sum + i.qty, 0);
            const style = STATUS_STYLE[o.status] ?? {
              label: o.status,
              className: "bg-muted text-muted-foreground",
            };

            return (
              <Card
                key={o.id}
                className={
                  o.status === "PENDIENTE_CONFIRMACION"
                    ? "ring-amber-500/40 bg-amber-500/5"
                    : undefined
                }
              >
                <div className="px-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <Badge className={`border-none ${style.className}`}>{style.label}</Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {o.buyerType === "mayorista" ? "Mayorista" : "Minorista"}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {totalUnits} {totalUnits === 1 ? "unidad" : "unidades"}
                        </span>
                      </div>

                      <p className="text-sm font-medium">{o.customerName}</p>
                      <p className="text-xs text-muted-foreground break-words">
                        {o.phone} — {o.address}
                      </p>
                      <p className="text-xs text-muted-foreground">{zoneLabel(o.zone)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(o.createdAt).toLocaleString("es-AR")}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <OrderStatusSelect id={o.id} status={o.status} />
                      <DeleteOrderButton id={o.id} customerName={o.customerName} />
                    </div>
                  </div>

                  <div className="mt-3 text-sm flex flex-col gap-1">
                    {items.map((it, i) => (
                      <div key={i} className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          {it.name} x{it.qty}
                        </span>
                        <span>{money(it.unitPrice * it.qty)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-border flex justify-between text-sm font-medium">
                    <span>Total</span>
                    <span>{money(o.total)}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

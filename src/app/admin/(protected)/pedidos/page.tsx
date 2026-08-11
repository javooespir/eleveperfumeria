import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { zoneLabel } from "@/lib/shipping";
import { OrderStatusSelect } from "./OrderStatusSelect";

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

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
                    <div>
                      {o.status === "PENDIENTE_CONFIRMACION" && (
                        <span className="inline-block mb-1 text-[10px] tracking-wide uppercase text-amber-700">
                          Pendiente de confirmación
                        </span>
                      )}
                      <p className="text-sm font-medium">
                        {o.customerName}
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                          {o.buyerType === "mayorista" ? "Mayorista" : "Minorista"}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {o.phone} — {o.address}
                      </p>
                      <p className="text-xs text-muted-foreground">{zoneLabel(o.zone)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(o.createdAt).toLocaleString("es-AR")}
                      </p>
                    </div>
                    <OrderStatusSelect id={o.id} status={o.status} />
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

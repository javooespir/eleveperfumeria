import Link from "next/link";
import { Package, Tags, ClipboardList, Truck, Clock, CheckCircle2, Wallet, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

const CONFIRMED_STATUSES = ["NUEVO", "EN_PROCESO", "ENTREGADO"] as const;
const DEFAULT_LOW_STOCK_THRESHOLD = 5;

export default async function AdminDashboard() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    productCount,
    categoryCount,
    orderCount,
    pendingCount,
    confirmedAgg,
    monthConfirmedAgg,
    config,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDIENTE_CONFIRMACION" } }),
    prisma.order.aggregate({
      where: { status: { in: [...CONFIRMED_STATUSES] } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.order.aggregate({
      where: { status: { in: [...CONFIRMED_STATUSES] }, createdAt: { gte: startOfMonth } },
      _sum: { total: true },
    }),
    prisma.shippingConfig.findUnique({ where: { id: "config" } }),
  ]);

  const lowStockThreshold = config?.lowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD;
  const lowStockCount = await prisma.product.count({
    where: { stock: { lte: lowStockThreshold }, isActive: true },
  });

  const metrics = [
    {
      label: "Recaudado (confirmado)",
      value: money(confirmedAgg._sum.total ?? 0),
      icon: Wallet,
      hint: `${confirmedAgg._count} pedidos confirmados`,
    },
    {
      label: "Recaudado este mes",
      value: money(monthConfirmedAgg._sum.total ?? 0),
      icon: Wallet,
      hint: startOfMonth.toLocaleDateString("es-AR", { month: "long", year: "numeric" }),
    },
    {
      label: "Por confirmar",
      value: String(pendingCount),
      icon: Clock,
      hint: "esperando pago/confirmación",
      alert: pendingCount > 0,
    },
    {
      label: "Confirmados",
      value: String(confirmedAgg._count),
      icon: CheckCircle2,
      hint: `de ${orderCount} totales — confirmación manual, sin pasarela de pago`,
    },
  ];

  const cards = [
    {
      href: "/admin/productos",
      label: "Productos",
      desc: "Crear, editar y eliminar productos del catálogo.",
      icon: Package,
      stat: `${productCount} productos`,
      alert: lowStockCount > 0 ? `${lowStockCount} con poco stock` : null,
    },
    {
      href: "/admin/categorias",
      label: "Categorías",
      desc: "Gestionar las categorías del catálogo.",
      icon: Tags,
      stat: `${categoryCount} categorías`,
    },
    {
      href: "/admin/pedidos",
      label: "Pedidos",
      desc: "Ver pedidos recibidos y su estado.",
      icon: ClipboardList,
      stat: `${orderCount} pedidos`,
      alert: pendingCount > 0 ? `${pendingCount} por confirmar` : null,
    },
    {
      href: "/admin/envio",
      label: "Envío",
      desc: "Configurar reglas de costo de envío.",
      icon: Truck,
      stat: null,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-heading font-light mb-1">Panel</h1>
      <p className="text-sm text-muted-foreground mb-8">Resumen general de ELEVÉ.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.label} className={m.alert ? "ring-amber-500/40 bg-amber-500/5" : undefined}>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="size-3.5" />
                  <span className="text-xs">{m.label}</span>
                </div>
                <p className="font-heading text-2xl mt-2">{m.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.hint}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {lowStockCount > 0 && (
        <Link href="/admin/productos">
          <Card className="mb-8 ring-amber-500/40 bg-amber-500/5 hover:ring-amber-500/60 transition-all">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertTriangle className="size-4 text-amber-700 shrink-0" />
              <p className="text-sm">
                <span className="font-medium">{lowStockCount} producto{lowStockCount === 1 ? "" : "s"}</span> con
                stock bajo (≤ {lowStockThreshold} unidades). Revisá el catálogo.
              </p>
            </CardContent>
          </Card>
        </Link>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.href} href={c.href}>
              <Card className="p-6 hover:ring-foreground/25 transition-all">
                <CardContent className="p-0 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-muted-foreground" />
                      <p className="font-heading text-lg">{c.label}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1.5">{c.desc}</p>
                    {c.stat && (
                      <p className="text-xs text-muted-foreground mt-3">{c.stat}</p>
                    )}
                  </div>
                  {c.alert && (
                    <Badge className="bg-amber-500/15 text-amber-700 border-none shrink-0">
                      {c.alert}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

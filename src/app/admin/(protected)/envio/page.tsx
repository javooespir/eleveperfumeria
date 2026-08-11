import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { defaultShippingRules, SHIPPING_ZONES, ZONE_SHIPPING_COST } from "@/lib/shipping";
import { updateShippingConfig } from "../actions";

export default async function EnvioPage() {
  const config = await prisma.shippingConfig.findUnique({ where: { id: "config" } });
  const rules = config ?? { id: "config", ...defaultShippingRules, lowStockThreshold: 5 };

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-heading font-light mb-1">Envío y stock</h1>
      <p className="text-sm text-muted-foreground mb-8">Reglas de costo de envío y alertas de stock.</p>

      <Card>
        <CardHeader>
          <CardTitle>Configuración</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateShippingConfig} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="freeShippingMinAmount">Monto mínimo para envío gratis</Label>
              <Input
                id="freeShippingMinAmount"
                name="freeShippingMinAmount"
                type="number"
                min={0}
                defaultValue={rules.freeShippingMinAmount}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5 pt-3 border-t border-border">
              <Label htmlFor="lowStockThreshold">Alertar cuando el stock sea menor o igual a</Label>
              <Input
                id="lowStockThreshold"
                name="lowStockThreshold"
                type="number"
                min={0}
                defaultValue={rules.lowStockThreshold}
                required
              />
            </div>

            <Button type="submit" className="w-fit">
              Guardar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Costo de envío por zona</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-4">
            Valores de ejemplo, fijos en el código (no editables desde acá todavía). Cuando definas el
            método de envío real (transportista, por km, etc.) los reemplazamos por un cotizador de verdad.
          </p>
          <div className="flex flex-col gap-2">
            {SHIPPING_ZONES.map((z) => (
              <div key={z.value} className="flex justify-between text-sm py-1.5 border-b border-border last:border-0">
                <span>{z.label}</span>
                <span className="text-muted-foreground">
                  ${ZONE_SHIPPING_COST[z.value].toLocaleString("es-AR")}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

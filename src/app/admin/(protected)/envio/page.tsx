import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { defaultShippingRules } from "@/lib/shipping";
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
              <Label htmlFor="freeShippingRadiusKm">Radio (km) con envío gratis</Label>
              <Input
                id="freeShippingRadiusKm"
                name="freeShippingRadiusKm"
                type="number"
                min={0}
                step="0.1"
                defaultValue={rules.freeShippingRadiusKm}
                required
              />
            </div>

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

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="baseShippingCost">Costo de envío base</Label>
              <Input
                id="baseShippingCost"
                name="baseShippingCost"
                type="number"
                min={0}
                defaultValue={rules.baseShippingCost}
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
    </div>
  );
}

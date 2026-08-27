import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStoreConfig } from "@/lib/config";
import { updateShippingConfig } from "../actions";

export const dynamic = "force-dynamic";

const ZONE_INPUTS = [
  { name: "costCaba", label: "CABA" },
  { name: "costZonaOeste", label: "Zona Oeste (GBA)" },
  { name: "costBuenosAires", label: "Buenos Aires (resto)" },
  { name: "costOtrasProvincias", label: "Otras provincias" },
] as const;

export default async function EnvioPage() {
  const config = await getStoreConfig();

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-heading font-light mb-1">Envío y stock</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Cuánto cobrás de envío en cada zona y cuándo avisarte que falta stock.
      </p>

      <form action={updateShippingConfig} className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Costo de envío por zona</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {ZONE_INPUTS.map((z) => (
              <div key={z.name} className="flex flex-col gap-1.5">
                <Label htmlFor={z.name}>{z.label}</Label>
                {/* Sin step: con step="100" el navegador rechazaba en silencio
                    montos como 2350 y el formulario no guardaba nada. */}
                <Input
                  id={z.name}
                  name={z.name}
                  type="number"
                  min={0}
                  defaultValue={config[z.name]}
                  required
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Envío gratis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="freeShippingMinAmount">
                A partir de este monto el envío es gratis
              </Label>
              <Input
                id="freeShippingMinAmount"
                name="freeShippingMinAmount"
                type="number"
                min={0}
                defaultValue={config.freeShippingMinAmount}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lowStockThreshold">
                Avisarme cuando queden esta cantidad de unidades o menos
              </Label>
              <Input
                id="lowStockThreshold"
                name="lowStockThreshold"
                type="number"
                min={0}
                defaultValue={config.lowStockThreshold}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-fit">
          Guardar cambios
        </Button>
      </form>
    </div>
  );
}

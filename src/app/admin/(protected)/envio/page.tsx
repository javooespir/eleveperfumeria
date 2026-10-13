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
        Cómo se maneja el envío, cuánto cobrás en cada zona y cuándo avisarte que falta stock.
      </p>

      <form action={updateShippingConfig} className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cómo se maneja el envío</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <label className="flex items-start gap-3 rounded-lg border border-border p-3 cursor-pointer has-checked:border-foreground has-checked:bg-muted/40">
              <input
                type="radio"
                name="shippingMode"
                value="coordinar"
                defaultChecked={config.shippingMode === "coordinar"}
                className="mt-1 size-4"
              />
              <span className="text-sm">
                <span className="font-medium">Coordinar por WhatsApp</span>
                <span className="block text-xs text-muted-foreground mt-0.5">
                  El cliente no carga dirección y no se cobra envío. En el checkout aparece un
                  cartel avisando que el envío se arregla por chat.
                </span>
              </span>
            </label>

            <label className="flex items-start gap-3 rounded-lg border border-border p-3 cursor-pointer has-checked:border-foreground has-checked:bg-muted/40">
              <input
                type="radio"
                name="shippingMode"
                value="zonas"
                defaultChecked={config.shippingMode !== "coordinar"}
                className="mt-1 size-4"
              />
              <span className="text-sm">
                <span className="font-medium">Cobrar envío por zona</span>
                <span className="block text-xs text-muted-foreground mt-0.5">
                  El cliente carga calle, localidad y código postal, elige su zona y se le suma el
                  costo de envío al total.
                </span>
              </span>
            </label>

            <p className="text-xs text-muted-foreground">
              El texto del cartel se edita en <strong>Textos → Checkout</strong>.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Costo de envío por zona</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-xs text-muted-foreground">
              Solo se usa con la opción “Cobrar envío por zona”.
            </p>
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

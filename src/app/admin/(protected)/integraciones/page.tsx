import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStoreConfig } from "@/lib/config";
import { SITE_URL } from "@/lib/site";
import { updateIntegrations } from "../actions";

export const dynamic = "force-dynamic";

export default async function IntegracionesPage() {
  const config = await getStoreConfig();

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-heading font-light mb-1">Integraciones</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Conectá herramientas de publicidad y medición.
      </p>

      <form action={updateIntegrations}>
        <Card>
          <CardHeader>
            <CardTitle>Pixel de Meta (Facebook e Instagram Ads)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="metaPixelId">ID del pixel</Label>
              <Input
                id="metaPixelId"
                name="metaPixelId"
                inputMode="numeric"
                defaultValue={config.metaPixelId ?? ""}
                placeholder="1234567890123456"
              />
              <p className="text-xs text-muted-foreground">
                Lo encontrás en Meta Business → Administrador de eventos → Orígenes de datos. Son
                solo números. Dejalo vacío para desactivar el seguimiento.
              </p>
            </div>

            <div className="rounded-md bg-muted/50 p-4 text-xs text-muted-foreground flex flex-col gap-2">
              <p className="font-medium text-foreground">Para verificar el dominio en Meta</p>
              <p>
                El sitio está alojado en Vercel. En Meta te van a pedir verificar el dominio:
                elegí la opción de <strong>meta tag</strong> o <strong>archivo HTML</strong> y
                pasanos el código, lo cargamos nosotros.
              </p>
              <p>
                Dominio actual: <strong>{SITE_URL.replace("https://", "")}</strong>
              </p>
            </div>

            <Button type="submit" className="w-fit">
              Guardar
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CONTENT_FIELDS, getSiteContent } from "@/lib/site-content";
import { updateSiteContent } from "../actions";

export const dynamic = "force-dynamic";

export default async function TextosPage() {
  const content = await getSiteContent();

  const groups = CONTENT_FIELDS.reduce<Record<string, typeof CONTENT_FIELDS>>((acc, field) => {
    (acc[field.group] ??= []).push(field);
    return acc;
  }, {});

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-heading font-light mb-1">Textos de la página</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Editá lo que dice la página de inicio. Si dejás un campo vacío se vuelve al texto original.
      </p>

      <form action={updateSiteContent} className="flex flex-col gap-6">
        {Object.entries(groups).map(([group, fields]) => (
          <Card key={group}>
            <CardHeader>
              <CardTitle>{group}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {fields.map((field) => (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  {field.multiline ? (
                    <Textarea
                      id={field.key}
                      name={field.key}
                      rows={3}
                      defaultValue={content[field.key]}
                      placeholder={field.default}
                    />
                  ) : (
                    <Input
                      id={field.key}
                      name={field.key}
                      defaultValue={content[field.key]}
                      placeholder={field.default}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        <Button type="submit" className="w-fit sticky bottom-4">
          Guardar textos
        </Button>
      </form>
    </div>
  );
}

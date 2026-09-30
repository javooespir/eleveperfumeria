import { CheckCircle2, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSiteContent } from "@/lib/site-content";
import {
  QUIZ_DEFAULTS,
  SCENT_FAMILIES,
  quizBlurbKey,
  quizOptionKey,
  quizProductKey,
  quizQuestionKey,
} from "@/lib/quiz";
import { updateQuizContent } from "../actions";

export const dynamic = "force-dynamic";

export default async function QuizPage() {
  const [content, products] = await Promise.all([
    getSiteContent(),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, brand: true },
    }),
  ]);

  const validIds = new Set(products.map((p) => p.id));
  const assigned = SCENT_FAMILIES.map((f) => ({
    ...f,
    productId: content[quizProductKey(f.value)],
    ok: validIds.has(content[quizProductKey(f.value)]),
  }));
  const missing = assigned.filter((a) => !a.ok);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-heading font-light mb-1">Quiz de notas</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Cuatro preguntas con cinco opciones cada una. Cada opción suma para un perfil, y el perfil
        más elegido define el perfume recomendado.
      </p>

      {missing.length === 0 ? (
        <div className="flex items-start gap-2.5 rounded-lg border border-emerald-600/30 bg-emerald-500/10 p-4 mb-8">
          <CheckCircle2 className="size-4 text-emerald-700 mt-0.5 shrink-0" />
          <p className="text-sm">
            <strong>Todo listo.</strong> Los 5 perfiles tienen un perfume asignado, así que
            cualquier combinación de respuestas llega a una recomendación.
          </p>
        </div>
      ) : (
        <div className="flex items-start gap-2.5 rounded-lg border border-amber-600/30 bg-amber-500/10 p-4 mb-8">
          <AlertTriangle className="size-4 text-amber-700 mt-0.5 shrink-0" />
          <div className="text-sm">
            <strong>Falta asignar {missing.length} de 5 perfiles.</strong>
            <p className="mt-1 text-muted-foreground">
              Quien termine el quiz con el perfil {missing.map((m) => m.label).join(", ")} no va a
              ver ninguna recomendación. Elegí un perfume abajo, en “Resultados”.
            </p>
          </div>
        </div>
      )}

      <form action={updateQuizContent} className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <p className="text-xs text-muted-foreground -mb-2">
              Qué perfume se recomienda según el perfil que gane. Solo aparecen productos visibles
              en el catálogo.
            </p>

            {SCENT_FAMILIES.map((f) => {
              const current = content[quizProductKey(f.value)];
              const ok = validIds.has(current);
              return (
                <div key={f.value} className="flex flex-col gap-1.5">
                  <Label htmlFor={quizProductKey(f.value)} className="flex items-center gap-2">
                    Perfil {f.label}
                    {ok ? (
                      <CheckCircle2 className="size-3.5 text-emerald-600" />
                    ) : (
                      <span className="text-[10px] uppercase tracking-wide text-amber-700">
                        sin asignar
                      </span>
                    )}
                  </Label>
                  <select
                    id={quizProductKey(f.value)}
                    name={quizProductKey(f.value)}
                    defaultValue={ok ? current : ""}
                    className="border border-input bg-background rounded-md px-3 py-2 text-sm h-10"
                  >
                    <option value="">— Elegí un perfume —</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.brand})
                      </option>
                    ))}
                  </select>
                  <Textarea
                    name={quizBlurbKey(f.value)}
                    rows={2}
                    defaultValue={content[quizBlurbKey(f.value)]}
                    placeholder="Descripción que se muestra con la recomendación"
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {QUIZ_DEFAULTS.map((q, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Pregunta {i + 1}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={quizQuestionKey(i)}>Texto de la pregunta</Label>
                <Input
                  id={quizQuestionKey(i)}
                  name={quizQuestionKey(i)}
                  defaultValue={content[quizQuestionKey(i)]}
                  placeholder={q.question}
                />
              </div>

              {SCENT_FAMILIES.map((f) => (
                <div key={f.value} className="flex flex-col gap-1.5">
                  <Label htmlFor={quizOptionKey(i, f.value)}>
                    Opción que suma al perfil {f.label}
                  </Label>
                  <Input
                    id={quizOptionKey(i, f.value)}
                    name={quizOptionKey(i, f.value)}
                    defaultValue={content[quizOptionKey(i, f.value)]}
                    placeholder={q.options[f.value]}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        <Button type="submit" className="w-fit sticky bottom-4">
          Guardar quiz
        </Button>
      </form>
    </div>
  );
}

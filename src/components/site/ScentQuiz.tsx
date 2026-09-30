"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuizStore } from "@/store/quiz";
import { useCartStore } from "@/store/cart";
import { useEffectiveBuyerType } from "@/store/use-effective-buyer-type";
import {
  buildQuizQuestions,
  quizBlurbKey,
  quizProductKey,
  scoreQuiz,
  type ScentFamily,
} from "@/lib/quiz";
import type { SiteContent } from "@/lib/site-content";
import { finalPrice, type Product } from "@/lib/types";

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

export function ScentQuiz({
  products,
  content,
}: {
  products: Product[];
  content: SiteContent;
}) {
  const open = useQuizStore((s) => s.open);
  const setOpen = useQuizStore((s) => s.setOpen);
  const addItem = useCartStore((s) => s.addItem);
  const buyerType = useEffectiveBuyerType();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ScentFamily[]>([]);

  const reset = () => {
    setStep(0);
    setAnswers([]);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) reset();
  };

  const handleAnswer = (family: ScentFamily) => {
    setAnswers((prev) => [...prev, family]);
    setStep((s) => s + 1);
  };

  const questions = buildQuizQuestions(content);
  const isResult = step >= questions.length;
  const family = isResult ? scoreQuiz(answers) : null;
  // El perfume se busca por id, no por nombre: antes estaba atado a nombres
  // fijos y al renovarse el catalogo 4 de los 5 perfiles quedaron sin
  // resultado, con el modal en blanco.
  const product = family ? products.find((p) => p.id === content[quizProductKey(family)]) : null;
  const blurb = family ? content[quizBlurbKey(family)] : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {!isResult ? (
          <>
            <DialogTitle className="font-heading text-lg font-medium">
              {questions[step].question}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Pregunta {step + 1} de {questions.length}
            </DialogDescription>

            <div className="flex flex-col gap-2 mt-2">
              {questions[step].options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => handleAnswer(opt.family)}
                  className="border border-border px-4 py-3 text-left text-sm hover:border-foreground transition-colors"
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex gap-1.5 mt-4">
              {questions.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded-full ${i <= step ? "bg-foreground" : "bg-border"}`}
                />
              ))}
            </div>
          </>
        ) : product ? (
          <>
            <DialogTitle className="font-heading text-lg font-medium">
              Tu fragancia es {product.name}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {blurb}
            </DialogDescription>

            <div className="flex gap-4 mt-2">
              <div className="relative size-24 shrink-0 bg-muted overflow-hidden">
                <Image src={product.images[0]} alt={product.name} fill sizes="96px" className="object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {product.brand}
                </p>
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-sm mt-1">{money(finalPrice(product, buyerType))}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-5">
              <Button
                className="rounded-none flex-1"
                onClick={() => {
                  addItem(
                    {
                      productId: product.id,
                      name: product.name,
                      price: product.price,
                      wholesalePrice: product.wholesalePrice,
                      discountActive: product.discountActive,
                      discountPercent: product.discountPercent,
                      image: product.images[0],
                      stock: product.stock,
                    },
                    1
                  );
                  handleOpenChange(false);
                }}
                disabled={product.stock <= 0}
              >
                Agregar al carrito
              </Button>
              <Button asChild variant="outline" className="rounded-none flex-1">
                <Link href="/catalogo" onClick={() => handleOpenChange(false)}>
                  Ver catálogo
                </Link>
              </Button>
            </div>

            <button
              onClick={reset}
              className="text-xs text-muted-foreground underline mt-4 self-center"
            >
              Repetir el quiz
            </button>
          </>
        ) : (
          // Sin perfume asignado a este perfil el quiz no puede quedar mudo:
          // se ofrece el catalogo en vez de un modal vacio.
          <>
            <DialogTitle className="font-heading text-lg font-medium">
              Tenemos varias que te van a gustar
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Escribinos y te ayudamos a elegir, o mirá el catálogo completo.
            </DialogDescription>
            <div className="flex flex-col sm:flex-row gap-2 mt-5">
              <Button asChild className="rounded-none flex-1">
                <Link href="/catalogo" onClick={() => handleOpenChange(false)}>
                  Ver catálogo
                </Link>
              </Button>
              <Button variant="outline" className="rounded-none flex-1" onClick={reset}>
                Repetir el quiz
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuizStore } from "@/store/quiz";
import { useCartStore } from "@/store/cart";
import { useEffectiveBuyerType } from "@/store/use-effective-buyer-type";
import { QUIZ_QUESTIONS, QUIZ_RESULTS, scoreQuiz, type ScentFamily } from "@/lib/quiz";
import { finalPrice, type Product } from "@/lib/types";

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

export function ScentQuiz({ products }: { products: Product[] }) {
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

  const isResult = step >= QUIZ_QUESTIONS.length;
  const family = isResult ? scoreQuiz(answers) : null;
  const result = family ? QUIZ_RESULTS[family] : null;
  const product = result ? products.find((p) => p.name === result.productName) : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {!isResult ? (
          <>
            <DialogTitle className="font-heading text-lg font-medium">
              {QUIZ_QUESTIONS[step].question}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Pregunta {step + 1} de {QUIZ_QUESTIONS.length}
            </DialogDescription>

            <div className="flex flex-col gap-2 mt-2">
              {QUIZ_QUESTIONS[step].options.map((opt) => (
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
              {QUIZ_QUESTIONS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded-full ${i <= step ? "bg-foreground" : "bg-border"}`}
                />
              ))}
            </div>
          </>
        ) : product && result ? (
          <>
            <DialogTitle className="font-heading text-lg font-medium">
              Tu fragancia es {product.name}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {result.blurb}
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
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

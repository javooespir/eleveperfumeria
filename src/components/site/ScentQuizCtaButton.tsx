"use client";

import { Button } from "@/components/ui/button";
import { useQuizStore } from "@/store/quiz";

export function ScentQuizCtaButton() {
  const setQuizOpen = useQuizStore((s) => s.setOpen);

  return (
    <Button
      className="rounded-none bg-background text-foreground hover:bg-champagne"
      onClick={() => setQuizOpen(true)}
    >
      Encontrá tu perfume ideal
    </Button>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingCta() {
  return (
    <section className="border-t border-border bg-foreground text-background py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center px-4 sm:px-6">
        <h2 className="font-heading text-3xl sm:text-4xl font-medium leading-tight tracking-tight">
          Perfumes, body splash y perfumeros.
          <br />
          <span className="text-champagne">Todo en un mismo catálogo.</span>
        </h2>
        <Button
          asChild
          className="rounded-none bg-background text-foreground hover:bg-champagne hover:text-foreground mt-8"
        >
          <Link href="/catalogo">Ver catálogo completo</Link>
        </Button>
      </div>
    </section>
  );
}

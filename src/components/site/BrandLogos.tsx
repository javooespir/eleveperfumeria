import { BrandMarquee } from "@/components/site/BrandMarquee";

export function BrandLogos() {
  return (
    <section className="border-t border-border py-12 sm:py-14 overflow-hidden">
      <p className="text-center text-xs tracking-[0.2em] text-muted-foreground uppercase mb-8">
        Marcas que trabajamos
      </p>
      <BrandMarquee />
    </section>
  );
}

import Link from "next/link";
import { ScentQuizCtaButton } from "./ScentQuizCtaButton";
import type { SiteContent } from "@/lib/site-content";

// Fondo negro plano a proposito: antes habia lineas SVG animadas (dos capas
// de 18 trazos con stroke-dashoffset por @keyframes) que glitcheaban al
// scrollear en algunos equipos. El efecto no aportaba nada al mensaje, asi
// que se saco en vez de seguir peleando con la animacion.
export function ScentQuizCta({ content }: { content: SiteContent }) {
  return (
    <section className="relative bg-ink text-background py-20 sm:py-28">
      <div className="relative z-10 mx-auto max-w-2xl text-center px-4 sm:px-6">
        <span className="text-xs tracking-[0.25em] text-champagne uppercase">
          {content.quiz_eyebrow}
        </span>

        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight mt-4 leading-[1.05]">
          {content.quiz_title_1}
          <br />
          {content.quiz_title_2}
        </h2>

        <p className="text-sm sm:text-base text-background/70 mt-5 max-w-md mx-auto">
          {content.quiz_subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <ScentQuizCtaButton />
          <Link
            href="/catalogo?categoria=tubitos-arabes"
            className="inline-flex items-center justify-center rounded-none px-4 py-2 text-sm text-background hover:bg-background/10 transition-colors"
          >
            Ver tubitos de muestra
          </Link>
        </div>
      </div>
    </section>
  );
}

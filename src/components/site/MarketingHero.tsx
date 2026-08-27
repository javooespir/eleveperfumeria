"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { Sparkles, PackageCheck, Truck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMarquee } from "@/components/site/BrandMarquee";
import { useQuizStore } from "@/store/quiz";
import type { SiteContent } from "@/lib/site-content";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

export function MarketingHero({
  productCount,
  brandCount,
  categoryCount,
  content,
}: {
  productCount: number;
  brandCount: number;
  categoryCount: number;
  content: SiteContent;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const setQuizOpen = useQuizStore((s) => s.setOpen);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !rootRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
      tl.from(".hero-badge", { opacity: 0, y: 12, duration: 0.5 })
        .from(".hero-line", { opacity: 0, y: 24, duration: 0.6, stagger: 0.08 }, "-=0.25")
        .from(".hero-sub", { opacity: 0, y: 12, duration: 0.5 }, "-=0.3")
        .from(".hero-cta", { opacity: 0, y: 12, duration: 0.5 }, "-=0.3")
        .from(".hero-card", { opacity: 0, y: 24, duration: 0.6, stagger: 0.1 }, "-=0.4");
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative w-full min-h-[92svh] lg:min-h-0 bg-ink text-background overflow-hidden"
    >
      {/* En mobile la foto ocupa solo la franja del titulo — abajo (donde
          esta la card de stats) queda negro solido, para que la card nunca
          compita con la imagen. En desktop (layout de 2 columnas) no hay ese
          problema de apilado, asi que la foto cubre toda la seccion. */}
      {/* Mobile: la foto arranca visible recien despues del titulo (mask
          empuja el reveal al 55%), asi el titulo queda sobre negro solido
          y la foto se aprecia mejor mas abajo, cerca de los botones/card. */}
      <div
        className="absolute inset-x-0 top-0 h-[60vh] lg:hidden"
        style={{
          maskImage:
            "linear-gradient(180deg, transparent, transparent 22%, black 38%, black 88%, transparent)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent, transparent 22%, black 38%, black 88%, transparent)",
        }}
      >
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-90"
        />
      </div>
      <div className="absolute inset-x-0 top-0 h-[60vh] lg:hidden bg-gradient-to-t from-ink/35 via-ink/5 to-ink/60" />

      {/* Desktop: layout de 2 columnas lado a lado, sin problema de
          apilado — la foto cubre toda la seccion. */}
      <div
        className="hidden lg:block absolute inset-0"
        style={{
          maskImage: "linear-gradient(180deg, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, black 15%, black 85%, transparent)",
        }}
      >
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
      </div>
      <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/70" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-14 sm:pt-20 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="hero-badge">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-wider text-background/80">
                {content.hero_badge}
                <Sparkles className="size-3.5 text-champagne" />
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.03] mt-6">
              <span className="hero-line block">{content.hero_title_1}</span>
              <span className="hero-line block text-champagne">{content.hero_title_2}</span>
            </h1>

            <p
              className="hero-sub text-sm sm:text-base text-background/60 mt-6 max-w-md"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.85)" }}
            >
              {content.hero_subtitle}
            </p>

            <div className="hero-cta flex flex-col sm:flex-row gap-3 mt-40 sm:mt-8">
              <Button asChild className="rounded-full bg-background text-foreground hover:bg-champagne px-7">
                <Link href="/catalogo">{content.hero_cta_primary}</Link>
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-white/15 bg-white/5 text-background hover:bg-white/10 px-7"
                onClick={() => setQuizOpen(true)}
              >
                {content.hero_cta_secondary}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-5 mt-3 sm:mt-4 lg:mt-0">
            <div className="hero-card relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <div className="text-2xl font-medium tracking-tight">{productCount}+</div>
                  <div className="text-sm text-background/60">fragancias disponibles</div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 text-sm text-background/70 mb-6">
                <div className="flex items-center gap-2.5">
                  <Truck className="size-4 text-champagne shrink-0" />
                  {content.hero_benefit_1}
                </div>
                <div className="flex items-center gap-2.5">
                  <PackageCheck className="size-4 text-champagne shrink-0" />
                  {content.hero_benefit_2}
                </div>
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="size-4 text-champagne shrink-0" />
                  {content.hero_benefit_3}
                </div>
              </div>

              <div className="h-px w-full bg-white/10 mb-5" />

              <div className="grid grid-cols-2 gap-4 text-center mb-6">
                <div>
                  <div className="text-lg font-medium">{brandCount}+</div>
                  <div className="text-[10px] uppercase tracking-wide text-background/50">Marcas</div>
                </div>
                <div>
                  <div className="text-lg font-medium">{categoryCount}</div>
                  <div className="text-[10px] uppercase tracking-wide text-background/50">Categorías</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-background/80">
                  En stock
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-background/80">
                  Por pedido
                </span>
              </div>
            </div>

            <div className="hero-card relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 py-7 backdrop-blur-xl">
              <h3 className="mb-5 px-7 text-xs uppercase tracking-wide text-background/50">
                Nuestras marcas
              </h3>
              <BrandMarquee size="size-9" gap="mx-6" duration={26} dark />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

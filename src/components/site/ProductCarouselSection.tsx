"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "@/components/ui/badge";
import { finalPrice, type Product } from "@/lib/types";

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

export function ProductCarouselSection({
  title,
  emoji,
  products,
}: {
  title: string;
  emoji: string;
  products: Product[];
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".carousel-card", {
        opacity: 0,
        y: 24,
        duration: 0.5,
        ease: "cubic-bezier(0.23, 1, 0.32, 1)",
        stagger: 0.06,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-14 sm:py-16">
      <h2 className="text-center text-lg sm:text-xl font-heading font-light mb-8">
        {emoji} {title} {emoji}
      </h2>

      <div className="flex gap-4 overflow-x-auto px-4 sm:px-6 pb-2 scrollbar-hide snap-x snap-mandatory">
        {products.map((product) => {
          const price = finalPrice(product);
          const hasDiscount = product.discountActive && product.discountPercent > 0;

          return (
            <Link
              key={product.id}
              href="/catalogo"
              className="carousel-card shrink-0 w-[46%] sm:w-[30%] md:w-[22%] lg:w-[18%] snap-start"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 46vw, 20vw"
                  className="object-cover"
                />
                {hasDiscount && (
                  <Badge className="absolute top-2 left-2 bg-champagne text-foreground border-none">
                    -{product.discountPercent}%
                  </Badge>
                )}
              </div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mt-3">
                {product.brand}
              </p>
              <p className="text-sm truncate">{product.name}</p>
              <div className="flex items-center gap-2 mt-1">
                {hasDiscount && (
                  <span className="text-xs text-muted-foreground line-through">
                    {money(product.price)}
                  </span>
                )}
                <span className="text-sm font-medium">{money(price)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

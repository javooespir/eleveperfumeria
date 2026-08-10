"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export const BRANDS = [
  { name: "Lattafa", src: "/images/marcas/lattafa.png" },
  { name: "Armaf", src: "/images/marcas/armaf.png" },
  { name: "Afnan", src: "/images/marcas/afnan.png" },
  { name: "Asdaaf", src: "/images/marcas/asdaaf.png" },
  { name: "Maison Alhambra", src: "/images/marcas/maison.png" },
];

// Repetimos varias veces antes de duplicar el set entero: con pocas marcas
// el ancho total podia ser menor al viewport y dejaba un hueco en blanco
// antes de reiniciar el loop. Con suficientes copias, cada mitad siempre
// cubre de sobra cualquier ancho de pantalla o card.
const REPEATS = 8;
const HALF = Array.from({ length: REPEATS }, () => BRANDS).flat();
const LOOP = [...HALF, ...HALF];

export function BrandMarquee({
  size = "size-14 sm:size-16",
  gap = "mx-8 sm:mx-12",
  duration = 40,
  dark = false,
}: {
  size?: string;
  gap?: string;
  duration?: number;
  dark?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        xPercent: -50,
        duration,
        repeat: -1,
        ease: "none",
      });
    });

    return () => ctx.revert();
  }, [duration]);

  return (
    <div className="w-full overflow-hidden">
      <div ref={trackRef} className="flex items-center whitespace-nowrap will-change-transform">
        {LOOP.map((brand, i) => (
          <span
            key={`${brand.name}-${i}`}
            aria-hidden={i >= HALF.length}
            className={`relative ${size} shrink-0 ${gap} grayscale opacity-70 ${dark ? "invert" : ""}`}
          >
            <Image src={brand.src} alt={brand.name} fill sizes="64px" className="object-contain" />
          </span>
        ))}
      </div>
    </div>
  );
}

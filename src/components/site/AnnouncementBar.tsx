"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Frases placeholder — reemplazar por promociones reales del cliente.
const MESSAGES = [
  "Envío gratis en compras +$50.000",
  "3 y 6 cuotas sin interés",
  "Descuento especial pagando por transferencia",
  "Perfumeros y muestras disponibles",
];

const LOOP_TEXT = MESSAGES.join("   •   ");

export function AnnouncementBar() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        xPercent: -50,
        duration: 22,
        repeat: -1,
        ease: "none",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full bg-foreground text-background overflow-hidden h-9 flex items-center">
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        <span className="text-xs tracking-wide px-6">{LOOP_TEXT}</span>
        <span className="text-xs tracking-wide px-6" aria-hidden="true">
          {LOOP_TEXT}
        </span>
      </div>
    </div>
  );
}

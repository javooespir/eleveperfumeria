"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { MODE_DATA, type Mode } from "@/lib/buyer-modes";
import type { SiteContent } from "@/lib/site-content";

/**
 * Version compacta de minorista/mayorista para la columna derecha del hero.
 *
 * El cliente pidio subir esta informacion (es la decision mas importante que
 * toma el visitante) y bajar la tarjeta de estadisticas. Comparte MODE_DATA
 * con la seccion original para no tener dos textos que mantener.
 */
export function WholesaleHeroCard({ content }: { content: SiteContent }) {
  const [mode, setMode] = useState<Mode>("retail");
  const data = MODE_DATA[mode];
  const isRetail = mode === "retail";
  const StatIcon = data.stat.icon;

  return (
    <div className="hero-card relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7 backdrop-blur-xl">
      <p className="text-[10px] uppercase tracking-[0.2em] text-champagne mb-4">
        Elegí tu forma de comprar
      </p>

      <div className="flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10 mb-6">
        {(["retail", "wholesale"] as Mode[]).map((opt) => {
          const active = mode === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => setMode(opt)}
              className="relative flex-1 h-10 rounded-full flex items-center justify-center text-sm font-medium"
            >
              {active && (
                <motion.div
                  layoutId="hero-buyer-switch"
                  className="absolute inset-0 rounded-full bg-white/12 shadow-inner"
                  transition={{ type: "spring", stiffness: 220, damping: 22 }}
                />
              )}
              <span className={`relative z-10 ${active ? "text-background" : "text-background/50"}`}>
                {MODE_DATA[opt].label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <div
            className={`absolute inset-[-12%] rounded-full border border-dashed ${data.colors.ring}`}
          />
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${data.colors.gradient} blur-2xl opacity-30`}
          />
          <div className="relative size-28 sm:size-32 rounded-full border border-white/5 overflow-hidden bg-black/20">
            {/* Remount por key, sin animacion de salida: con AnimatePresence
                las dos fotos quedaban superpuestas al cambiar rapido. */}
            <motion.div
              key={data.id}
              initial={{ opacity: 0, scale: 1.25, x: isRetail ? -24 : 24 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                transition: { type: "spring", stiffness: 220, damping: 22 },
              }}
              className="relative w-full h-full p-4"
            >
              <Image
                src={data.image}
                alt={data.title}
                fill
                sizes="128px"
                className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
              />
            </motion.div>
          </div>
        </div>

        <div className="min-w-0">
          <h2 className="font-heading text-xl sm:text-2xl font-medium tracking-tight leading-tight">
            {data.title}
          </h2>
          <p className="text-xs sm:text-sm text-background/60 mt-2 leading-relaxed">
            {data.description}
          </p>
        </div>
      </div>

      <div className="h-px w-full bg-white/10 my-5" />

      <div className="flex flex-col gap-2.5">
        {data.features
          // Renglon vaciado desde el admin = renglon que no se muestra.
          .map((f) => ({ ...f, text: content[f.key] ?? f.label }))
          .filter((f) => f.text.trim())
          .map((feature) => (
            <div key={feature.key} className="flex items-center gap-2.5 text-sm text-background/75">
              <feature.icon className="size-4 text-champagne shrink-0" />
              <span>{feature.text}</span>
            </div>
          ))}
      </div>

      <div className="flex items-center justify-between gap-3 mt-5">
        <span className="flex items-center gap-2 text-xs text-background/60">
          <StatIcon className="size-3.5" />
          {data.stat.label}
        </span>
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-background/70 hover:text-background transition-colors group"
        >
          Ver catálogo
          <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import {
  Truck,
  MessageCircle,
  CreditCard,
  Package,
  Users,
  Tag,
  CheckCircle2,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { WHOLESALE_MIN_UNITS } from "@/lib/types";

// Adaptado de un patron "Earbud Showcase" (21st.dev): mismo esqueleto de
// animacion (switch entre dos estados con framer-motion, imagen + panel de
// datos + selector), reescrito para minorista/mayorista y con la paleta de
// ELEVÉ (negro / blanco / champagne) en vez de azul/verde.

type Mode = "retail" | "wholesale";

type Feature = { label: string; icon: LucideIcon };

type ModeData = {
  id: Mode;
  label: string;
  title: string;
  description: string;
  image: string;
  colors: { gradient: string; glow: string; ring: string };
  badge: string;
  stat: { label: string; icon: LucideIcon };
  features: Feature[];
};

const MODE_DATA: Record<Mode, ModeData> = {
  retail: {
    id: "retail",
    label: "Minorista",
    title: "Comprá a tu ritmo",
    description:
      "Elegí cualquier fragancia del catálogo, sin cantidad mínima. Ideal para uso personal o para regalar.",
    image: "/images/perfume-minorista.png",
    colors: {
      gradient: "from-zinc-500 to-zinc-950",
      glow: "bg-white",
      ring: "border-white/30",
    },
    badge: "Sin mínimo de compra",
    stat: { label: "Envío a domicilio", icon: Truck },
    features: [
      { label: "Todas las categorías", icon: Package },
      { label: "3 y 6 cuotas sin interés", icon: CreditCard },
      { label: "Coordinación por WhatsApp", icon: MessageCircle },
    ],
  },
  wholesale: {
    id: "wholesale",
    label: "Mayorista",
    title: "Comprá para revender",
    description: `Con ${WHOLESALE_MIN_UNITS} unidades o más accedés a precios preferenciales en todo el catálogo — ideal para comercios y revendedores.`,
    image: "/images/perfume-mayorista.png",
    colors: {
      gradient: "from-champagne to-[#1a1611]",
      glow: "bg-champagne",
      ring: "border-champagne/40",
    },
    badge: "Precio preferencial",
    stat: { label: `Mínimo ${WHOLESALE_MIN_UNITS} unidades`, icon: Users },
    features: [
      { label: "Precios especiales por volumen", icon: Tag },
      { label: "Sin mínimo por artículo", icon: CheckCircle2 },
      { label: "Coordinación por WhatsApp", icon: MessageCircle },
    ],
  },
};

const containerAnim: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const itemAnim: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
  exit: { opacity: 0, y: -8, filter: "blur(4px)" },
};

function imageAnim(isRetail: boolean): Variants {
  return {
    initial: {
      opacity: 0,
      scale: 1.3,
      filter: "blur(10px)",
      x: isRetail ? -60 : 60,
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      x: 0,
      transition: { type: "spring", stiffness: 220, damping: 22 },
    },
    exit: { opacity: 0, scale: 0.7, filter: "blur(12px)", transition: { duration: 0.2 } },
  };
}

function ModeVisual({ data, isRetail }: { data: ModeData; isRetail: boolean }) {
  return (
    <div className="relative shrink-0">
      <div
        className={`absolute inset-[-15%] rounded-full border border-dashed ${data.colors.ring}`}
      />
      <motion.div
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${data.colors.gradient} blur-2xl opacity-30`}
      />

      <div className="relative size-64 sm:size-72 md:size-80 rounded-full border border-white/5 flex items-center justify-center overflow-hidden bg-black/20 backdrop-blur-sm">
        {/* Sin AnimatePresence: con ella el elemento saliente a veces se
            quedaba trabado a mitad de la animacion de salida y el nuevo se
            montaba encima, dejando las dos fotos superpuestas. Un remount
            simple por key (sin exit) es menos vistoso pero siempre correcto. */}
        <motion.div
          key={data.id}
          variants={imageAnim(isRetail)}
          initial="initial"
          animate="animate"
          className="relative z-10 w-full h-full p-8"
        >
          <Image
            src={data.image}
            alt={data.title}
            fill
            sizes="320px"
            className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] p-8"
          />
        </motion.div>
      </div>

      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-background/70 bg-black/60 px-4 py-2 rounded-full border border-white/10 backdrop-blur">
          <span className={`size-1.5 rounded-full ${data.colors.glow}`} />
          {data.badge}
        </div>
      </div>
    </div>
  );
}

function ModeDetails({ data }: { data: ModeData }) {
  const StatIcon = data.stat.icon;
  return (
    <motion.div
      variants={containerAnim}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-start text-left"
    >
      <motion.span
        variants={itemAnim}
        className="text-xs font-semibold uppercase tracking-[0.2em] text-background/50 mb-2"
      >
        {data.label}
      </motion.span>
      <motion.h3 variants={itemAnim} className="font-heading text-3xl sm:text-4xl font-medium tracking-tight mb-3">
        {data.title}
      </motion.h3>
      <motion.p variants={itemAnim} className="text-background/60 mb-8 max-w-sm leading-relaxed text-sm sm:text-base">
        {data.description}
      </motion.p>

      <motion.div
        variants={itemAnim}
        className="w-full space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm"
      >
        {data.features.map((feature) => (
          <div key={feature.label} className="flex items-center gap-3 text-sm text-background/80">
            <feature.icon className="size-4 text-champagne shrink-0" />
            <span>{feature.label}</span>
          </div>
        ))}

        <div className="pt-2 flex justify-start">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-background/70 hover:text-background transition-colors group"
          >
            Ver catálogo
            <ChevronRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>

      <motion.div variants={itemAnim} className="mt-6 flex items-center gap-2.5 text-background/60">
        <StatIcon className="size-4" />
        <span className="text-sm font-medium">{data.stat.label}</span>
      </motion.div>
    </motion.div>
  );
}

function ModeSwitcher({ active, onToggle }: { active: Mode; onToggle: (m: Mode) => void }) {
  const options: Mode[] = ["retail", "wholesale"];
  return (
    <div className="flex justify-center mt-10">
      <div className="flex items-center gap-1 p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl">
        {options.map((opt) => {
          const d = MODE_DATA[opt];
          const isActive = active === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className="relative w-28 h-11 rounded-full flex items-center justify-center text-sm font-medium"
            >
              {isActive && (
                <motion.div
                  layoutId="wholesale-switch-surface"
                  className="absolute inset-0 rounded-full bg-white/10 shadow-inner"
                  transition={{ type: "spring", stiffness: 220, damping: 22 }}
                />
              )}
              <span className={`relative z-10 ${isActive ? "text-background" : "text-background/50"}`}>
                {d.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function WholesaleShowcase() {
  const [mode, setMode] = useState<Mode>("retail");
  const data = MODE_DATA[mode];
  const isRetail = mode === "retail";

  return (
    <section className="relative w-full bg-ink text-background overflow-hidden py-16 sm:py-24">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            background: isRetail
              ? "radial-gradient(circle at 0% 50%, rgba(255,255,255,0.06), transparent 55%)"
              : "radial-gradient(circle at 100% 50%, rgba(217,201,163,0.12), transparent 55%)",
          }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        />
        {/* El glow radial de arriba llega hasta el borde superior (centrado
            al 50% de alto, radio 55%), asi que se notaba un salto de color
            contra la seccion de arriba (negro plano, sin glow). Esta franja
            fuerza negro puro justo en el borde, tape el glow ahi y lo deja
            visible recien mas abajo. */}
        <div className="absolute inset-x-0 top-0 h-32 sm:h-40 bg-gradient-to-b from-ink to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-xs tracking-[0.25em] text-champagne uppercase">
            Elegí tu forma de comprar
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-medium tracking-tight mt-3">
            Minorista o mayorista
          </h2>
        </div>

        <div
          className={`flex flex-col md:items-center gap-14 md:gap-16 w-full ${
            isRetail ? "md:flex-row" : "md:flex-row-reverse"
          }`}
        >
          <div className="flex justify-center md:block">
            <ModeVisual data={data} isRetail={isRetail} />
          </div>

          <div className="w-full max-w-md mx-auto md:mx-0">
            <ModeDetails key={mode} data={data} />
          </div>
        </div>

        <ModeSwitcher active={mode} onToggle={setMode} />
      </div>
    </section>
  );
}

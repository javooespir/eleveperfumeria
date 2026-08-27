"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Logo } from "@/components/site/Logo";
import { useQuizStore } from "@/store/quiz";
import { WHATSAPP_LINK } from "@/lib/whatsapp";

// Adaptado de un footer de 21st.dev (framer-motion, stagger + hover pills +
// franja diagonal animada). "motion/react" del original -> "framer-motion"
// (mismo paquete/API que ya usa el resto del sitio, evita instalar una
// segunda libreria de animacion redundante). El "SocialCloud" del original
// es un componente aparte que no vino con el snippet, así que las redes van
// como una fila simple de iconos con el mismo hover que los links de texto.

const SOCIALS = [
  { name: "Instagram", href: "https://www.instagram.com/eleve_ok/", Icon: InstagramIcon },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@eleveimportados_ok",
    Icon: TikTokIcon,
  },
  { name: "WhatsApp", href: WHATSAPP_LINK, Icon: WhatsAppIcon },
];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M14 3v10.8a3.1 3.1 0 1 1-2.6-3.06V8.2A5.5 5.5 0 1 0 16.9 13.6V8.9a6.7 6.7 0 0 0 4.1 1.4V7.7a4.1 4.1 0 0 1-3.4-1.6A4.3 4.3 0 0 1 16.8 3H14Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8.3 8.6c.2-.5.5-.5.8-.5h.6c.2 0 .4 0 .6.4.2.5.7 1.6.7 1.7.1.1.1.3 0 .4-.1.2-.1.3-.3.5l-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.5 1.5.3.1.5.1.6-.1l.6-.7c.2-.3.4-.2.6-.1l1.5.7c.2.1.4.2.4.3.1.5-.1 1.3-.7 1.7-.6.4-1.2.6-2 .5-.7-.1-2.5-.9-4.1-2.5-1.9-1.9-2.9-3.9-3-4.2-.1-.3-.6-1.2-.6-2.1s.4-1.4.6-1.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

export function Footer() {
  const setQuizOpen = useQuizStore((s) => s.setOpen);

  return (
    <footer className="w-full py-12 bg-background text-foreground overflow-hidden border-t border-border">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        variants={containerVariants}
        className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col items-center gap-10 mb-12"
      >
        <motion.div variants={itemVariants}>
          <Logo className="h-9 w-auto" />
        </motion.div>

        <motion.nav
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium relative z-10"
        >
          <Link href="/" className="relative px-2 py-1 group">
            <span className="relative z-10 text-muted-foreground group-hover:text-foreground transition-colors">
              Inicio
            </span>
          </Link>
          <Link href="/catalogo" className="relative px-2 py-1 group">
            <span className="relative z-10 text-muted-foreground group-hover:text-foreground transition-colors">
              Catálogo
            </span>
          </Link>
          <button type="button" onClick={() => setQuizOpen(true)} className="relative px-2 py-1 group">
            <span className="relative z-10 text-muted-foreground group-hover:text-foreground transition-colors">
              Quiz de notas
            </span>
          </button>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="relative px-2 py-1 group"
          >
            <span className="relative z-10 text-muted-foreground group-hover:text-foreground transition-colors">
              Contacto
            </span>
          </a>
        </motion.nav>

        <motion.div variants={itemVariants} className="flex items-center gap-4">
          {SOCIALS.map(({ name, href, Icon }) => (
            <motion.a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.94 }}
              className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              <Icon className="size-4" />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="w-full h-10 border-y border-foreground opacity-10 bg-[repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)]"
        style={{ backgroundSize: "10px 10px" }}
        initial={{ backgroundPositionX: "0%" }}
        whileInView={{ backgroundPositionX: "100%" }}
        viewport={{ once: true }}
        transition={{ ease: "linear", duration: 20 }}
      />

      <motion.div
        className="mx-auto max-w-7xl px-4 sm:px-6 mt-8 text-center text-xs text-muted-foreground"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={itemVariants}
      >
        <p>&copy; {new Date().getFullYear()} ELEVÉ — Perfumería de catálogo</p>
        <p className="mt-2 flex items-center justify-center gap-3">
          <Link href="/terminos" className="underline hover:text-foreground transition-colors">
            Términos y condiciones
          </Link>
          <span aria-hidden>·</span>
          <Link href="/privacidad" className="underline hover:text-foreground transition-colors">
            Política de privacidad
          </Link>
        </p>
        <p className="mt-2">
          Creado por{" "}
          <a href="https://encende.click" className="underline hover:text-foreground transition-colors">
            encende.click
          </a>
        </p>
      </motion.div>
    </footer>
  );
}

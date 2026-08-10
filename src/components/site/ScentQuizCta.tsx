import Link from "next/link";
import { ScentQuizCtaButton } from "./ScentQuizCtaButton";

// Fondo de lineas animadas, mismo espiritu que el "Background Paths" que
// paso el cliente, pero reescrito en CSS puro en vez de framer-motion:
// la version original animaba pathLength/opacity/pathOffset con JS en 72
// <motion.path> a la vez (2 capas x 36 trazos), lo que trababa la pagina
// entera (la seccion colapsaba y todo lo de abajo dejaba de renderizar).
// Con pathLength="1" nativo de SVG + stroke-dasharray/dashoffset animados
// por @keyframes, el navegador anima esto en el compositor — mismo efecto
// visual de "trazos que respiran", costo real casi nulo.
function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 10 * position} -${189 + i * 12}C-${380 - i * 10 * position} -${
      189 + i * 12
    } -${312 - i * 10 * position} ${216 - i * 12} ${152 - i * 10 * position} ${
      343 - i * 12
    }C${616 - i * 10 * position} ${470 - i * 12} ${684 - i * 10 * position} ${
      875 - i * 12
    } ${684 - i * 10 * position} ${875 - i * 12}`,
    width: 0.5 + i * 0.06,
    duration: 18 + (i % 6) * 3,
    delay: -(i % 9),
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full text-background" viewBox="0 0 696 316" fill="none" preserveAspectRatio="xMidYMid slice">
        {paths.map((path) => (
          <path
            key={path.id}
            d={path.d}
            pathLength={1}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.15 + path.id * 0.03}
            className="eleve-quiz-path"
            style={{
              animationDuration: `${path.duration}s`,
              animationDelay: `${path.delay}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function ScentQuizCta() {
  return (
    <section className="relative bg-foreground text-background overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl text-center px-4 sm:px-6">
        <span className="text-xs tracking-[0.25em] text-champagne uppercase">
          ¿No sabés cuál elegir?
        </span>

        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight mt-4 leading-[1.05]">
          Hacé el quiz de notas
          <br />
          y encontrá tu fragancia
        </h2>

        <p className="text-sm sm:text-base text-background/70 mt-5 max-w-md mx-auto">
          4 preguntas rápidas y te recomendamos una fragancia del catálogo —
          antes de comprar el frasco completo, probá un tubito de 5ml.
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

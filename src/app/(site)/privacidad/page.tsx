import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Cómo tratamos tus datos en ÉLEVÉ.",
  alternates: { canonical: "/privacidad" },
};

// Si en algun momento se agrega Google Analytics, Meta Pixel u otra
// herramienta de seguimiento, actualizar la seccion "Cookies y analítica"
// de esta pagina para que siga siendo verdadera.
export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-heading font-light mb-2">Política de privacidad</h1>
      <p className="text-xs text-muted-foreground mb-8">
        Última actualización: {new Date().toLocaleDateString("es-AR", { year: "numeric", month: "long" })}
      </p>

      <div className="flex flex-col gap-6 text-sm leading-relaxed text-foreground/90">
        <section>
          <h2 className="font-heading text-base font-medium mb-1.5">Qué datos pedimos</h2>
          <p>
            Cuando hacés un pedido te pedimos nombre, teléfono y dirección de entrega. Es la
            información mínima necesaria para coordinar y despachar tu compra.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-base font-medium mb-1.5">Para qué los usamos</h2>
          <p>
            Solo para procesar tu pedido: confirmarlo por WhatsApp, coordinar el pago y la
            entrega. No los usamos para nada más.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-base font-medium mb-1.5">Con quién los compartimos</h2>
          <p>
            No compartimos tus datos con terceros. Se guardan en una base de datos privada, a la
            que solo accede nuestro equipo.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-base font-medium mb-1.5">Cookies y analítica</h2>
          <p>
            Hoy este sitio no usa cookies de seguimiento ni herramientas de analítica de
            terceros (como Google Analytics). Si eso cambia en el futuro, lo vamos a reflejar
            acá.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-base font-medium mb-1.5">Tus derechos</h2>
          <p>
            Podés pedirnos en cualquier momento que te digamos qué datos tenemos tuyos o que los
            eliminemos, escribiéndonos por WhatsApp.
          </p>
        </section>
      </div>
    </div>
  );
}

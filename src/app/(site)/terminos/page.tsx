import type { Metadata } from "next";
import { WHOLESALE_MIN_UNITS } from "@/lib/types";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Términos y condiciones de compra en ÉLEVÉ.",
  alternates: { canonical: "/terminos" },
};

export default function TerminosPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-heading font-light mb-2">Términos y condiciones</h1>
      <p className="text-xs text-muted-foreground mb-8">
        Última actualización: {new Date().toLocaleDateString("es-AR", { year: "numeric", month: "long" })}
      </p>

      <div className="flex flex-col gap-6 text-sm leading-relaxed text-foreground/90">
        <section>
          <h2 className="font-heading text-base font-medium mb-1.5">Sobre este sitio</h2>
          <p>
            ÉLEVÉ es un catálogo online de perfumería. El sitio muestra productos y precios,
            pero no procesa pagos: cada pedido se coordina y confirma directamente por WhatsApp
            con nuestro equipo.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-base font-medium mb-1.5">Precios y stock</h2>
          <p>
            Los precios están expresados en pesos argentinos y pueden cambiar sin aviso previo.
            El stock mostrado es orientativo — puede variar hasta que confirmemos tu pedido por
            WhatsApp.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-base font-medium mb-1.5">Cómo funciona un pedido</h2>
          <p>
            Al finalizar tu compra en el sitio, el pedido se envía por WhatsApp con el detalle y
            el total. Ahí coordinamos el medio de pago y la entrega. El pedido queda confirmado
            recién cuando lo aprobamos de nuestro lado, no de forma automática.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-base font-medium mb-1.5">Compra mayorista</h2>
          <p>
            Los precios mayoristas aplican a partir de {WHOLESALE_MIN_UNITS} unidades por pedido.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-base font-medium mb-1.5">Envíos</h2>
          <p>
            El costo de envío se calcula según tu zona y se muestra antes de confirmar el pedido.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-base font-medium mb-1.5">Cambios y devoluciones</h2>
          <p>
            ¿Algo no salió como esperabas? Escribinos por WhatsApp y lo vemos caso a caso.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-base font-medium mb-1.5">Contacto</h2>
          <p>
            Para cualquier consulta sobre estos términos, escribinos por WhatsApp desde el botón
            de contacto del sitio.
          </p>
        </section>
      </div>
    </div>
  );
}

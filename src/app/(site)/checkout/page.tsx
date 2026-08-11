import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CheckoutForm } from "@/components/site/CheckoutForm";
import { defaultShippingRules } from "@/lib/shipping";

// Pagina personalizada por el carrito de cada visitante, sin contenido
// propio que valga la pena indexar — se excluye de resultados de busqueda.
export const metadata: Metadata = {
  title: "Finalizar pedido",
  robots: { index: false, follow: true },
};

export default async function CheckoutPage() {
  const config = await prisma.shippingConfig.findUnique({ where: { id: "config" } });

  const rules = config
    ? { freeShippingMinAmount: config.freeShippingMinAmount }
    : defaultShippingRules;

  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-heading font-light mb-6">Finalizar pedido</h1>
      <CheckoutForm rules={rules} />
    </div>
  );
}

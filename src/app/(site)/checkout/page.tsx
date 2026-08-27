import type { Metadata } from "next";
import { CheckoutForm } from "@/components/site/CheckoutForm";
import { getStoreConfig } from "@/lib/config";

// Pagina personalizada por el carrito de cada visitante, sin contenido
// propio que valga la pena indexar — se excluye de resultados de busqueda.
export const metadata: Metadata = {
  title: "Finalizar pedido",
  robots: { index: false, follow: true },
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const config = await getStoreConfig();

  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-heading font-light mb-6">Finalizar pedido</h1>
      <CheckoutForm rules={config} />
    </div>
  );
}

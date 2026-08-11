import { prisma } from "@/lib/prisma";
import { CheckoutForm } from "@/components/site/CheckoutForm";
import { defaultShippingRules } from "@/lib/shipping";

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

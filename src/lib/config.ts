import { prisma } from "@/lib/prisma";
import { defaultShippingRules, type ShippingRules } from "@/lib/shipping";

export const LOW_STOCK_THRESHOLD_DEFAULT = 5;

export type StoreConfig = ShippingRules & { lowStockThreshold: number };

const FALLBACK: StoreConfig = {
  ...defaultShippingRules,
  lowStockThreshold: LOW_STOCK_THRESHOLD_DEFAULT,
};

/** Config del negocio (envio + stock). Si no hay fila todavia, devuelve los defaults. */
export async function getStoreConfig(): Promise<StoreConfig> {
  const config = await prisma.shippingConfig.findUnique({ where: { id: "config" } });
  if (!config) return FALLBACK;
  return {
    freeShippingMinAmount: config.freeShippingMinAmount,
    costCaba: config.costCaba,
    costZonaOeste: config.costZonaOeste,
    costBuenosAires: config.costBuenosAires,
    costOtrasProvincias: config.costOtrasProvincias,
    lowStockThreshold: config.lowStockThreshold,
  };
}

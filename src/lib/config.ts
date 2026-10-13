import { prisma } from "@/lib/prisma";
import { defaultShippingRules, type ShippingRules } from "@/lib/shipping";

export const LOW_STOCK_THRESHOLD_DEFAULT = 5;

/** "zonas" cobra envio por zona; "coordinar" lo arregla por WhatsApp. */
export type ShippingMode = "zonas" | "coordinar";

export type StoreConfig = ShippingRules & {
  lowStockThreshold: number;
  metaPixelId: string | null;
  shippingMode: ShippingMode;
};

const FALLBACK: StoreConfig = {
  ...defaultShippingRules,
  lowStockThreshold: LOW_STOCK_THRESHOLD_DEFAULT,
  metaPixelId: null,
  shippingMode: "zonas",
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
    metaPixelId: config.metaPixelId?.trim() || null,
    shippingMode: config.shippingMode === "coordinar" ? "coordinar" : "zonas",
  };
}

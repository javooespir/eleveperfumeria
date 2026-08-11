export const MONTO_MINIMO_ENVIO_GRATIS = 50000;

export type ShippingZone = "caba" | "zona_oeste" | "buenos_aires" | "otras_provincias";

export const SHIPPING_ZONES: { value: ShippingZone; label: string }[] = [
  { value: "caba", label: "CABA" },
  { value: "zona_oeste", label: "Zona Oeste (GBA)" },
  { value: "buenos_aires", label: "Buenos Aires (resto)" },
  { value: "otras_provincias", label: "Otras provincias" },
];

export function zoneLabel(zone: string) {
  return SHIPPING_ZONES.find((z) => z.value === zone)?.label ?? zone;
}

// Costos de ejemplo por zona — todavia no hay metodo de envio real definido
// (transportista, kilometraje, etc). Reemplazar por el cotizador real cuando
// el cliente confirme como va a manejar la logistica.
export const ZONE_SHIPPING_COST: Record<ShippingZone, number> = {
  caba: 2000,
  zona_oeste: 2500,
  buenos_aires: 3500,
  otras_provincias: 6000,
};

export type ShippingRules = {
  freeShippingMinAmount: number;
};

export const defaultShippingRules: ShippingRules = {
  freeShippingMinAmount: MONTO_MINIMO_ENVIO_GRATIS,
};

export function calcularEnvio(
  zone: ShippingZone,
  montoTotal: number,
  rules: ShippingRules = defaultShippingRules
): number {
  if (montoTotal > rules.freeShippingMinAmount) return 0;
  return ZONE_SHIPPING_COST[zone];
}

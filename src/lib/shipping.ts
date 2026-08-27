export const MONTO_MINIMO_ENVIO_GRATIS = 50000;

export type ShippingZone = "caba" | "zona_oeste" | "buenos_aires" | "otras_provincias";

export const SHIPPING_ZONES: { value: ShippingZone; label: string; costKey: ZoneCostKey }[] = [
  { value: "caba", label: "CABA", costKey: "costCaba" },
  { value: "zona_oeste", label: "Zona Oeste (GBA)", costKey: "costZonaOeste" },
  { value: "buenos_aires", label: "Buenos Aires (resto)", costKey: "costBuenosAires" },
  { value: "otras_provincias", label: "Otras provincias", costKey: "costOtrasProvincias" },
];

export type ZoneCostKey =
  | "costCaba"
  | "costZonaOeste"
  | "costBuenosAires"
  | "costOtrasProvincias";

export function zoneLabel(zone: string) {
  return SHIPPING_ZONES.find((z) => z.value === zone)?.label ?? zone;
}

export type ShippingRules = {
  freeShippingMinAmount: number;
  costCaba: number;
  costZonaOeste: number;
  costBuenosAires: number;
  costOtrasProvincias: number;
};

// Valores iniciales — el admin los sobreescribe desde /admin/envio.
export const defaultShippingRules: ShippingRules = {
  freeShippingMinAmount: MONTO_MINIMO_ENVIO_GRATIS,
  costCaba: 2000,
  costZonaOeste: 2500,
  costBuenosAires: 3500,
  costOtrasProvincias: 6000,
};

export function zoneCost(zone: ShippingZone, rules: ShippingRules): number {
  const key = SHIPPING_ZONES.find((z) => z.value === zone)?.costKey;
  return key ? rules[key] : 0;
}

export function calcularEnvio(
  zone: ShippingZone,
  montoTotal: number,
  rules: ShippingRules = defaultShippingRules
): number {
  if (montoTotal > rules.freeShippingMinAmount) return 0;
  return zoneCost(zone, rules);
}

// Reglas de envio del boceto. El admin panel puede sobreescribir estos valores
// via ShippingConfig (Prisma) — estas constantes son el fallback por defecto.
export const MONTO_MINIMO_ENVIO_GRATIS = 50000;
export const RADIO_KM_ENVIO_GRATIS = 5;
export const COSTO_ENVIO_FIJO = 2500;

export type ShippingRules = {
  freeShippingRadiusKm: number;
  freeShippingMinAmount: number;
  baseShippingCost: number;
};

export const defaultShippingRules: ShippingRules = {
  freeShippingRadiusKm: RADIO_KM_ENVIO_GRATIS,
  freeShippingMinAmount: MONTO_MINIMO_ENVIO_GRATIS,
  baseShippingCost: COSTO_ENVIO_FIJO,
};

// TODO: reemplazar distanciaKm simulado por geocoding real (direccion cliente
// vs. direccion del local) cuando el cliente confirme ambos datos.
export function calcularEnvio(
  distanciaKm: number,
  montoTotal: number,
  rules: ShippingRules = defaultShippingRules
): number {
  if (distanciaKm < rules.freeShippingRadiusKm) return 0;
  if (montoTotal > rules.freeShippingMinAmount) return 0;
  return rules.baseShippingCost;
}

/**
 * Eventos del pixel de Meta.
 *
 * Vive en lib (y no en el componente) para que tambien lo pueda usar el
 * store del carrito sin importar un componente de React.
 *
 * Si no hay pixel configurado en el admin, `fbq` no existe y estas llamadas
 * no hacen nada.
 */
type Fbq = (...args: unknown[]) => void;

export function trackPixel(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (typeof fbq === "function") fbq("track", event, data);
}

export const ARS = "ARS";

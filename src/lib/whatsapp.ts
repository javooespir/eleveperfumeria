import type { BuyerType } from "@/lib/types";

// Unico numero de WhatsApp del negocio: pedidos y contacto del footer salen
// de aca, para que cambiarlo sea un solo lugar (variable de entorno).
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5491138752317";

export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

export function buildWhatsAppMessage(params: {
  lines: { name: string; qty: number; unitPrice: number }[];
  buyerType: BuyerType;
  subtotal: number;
  shippingCost: number;
  total: number;
  customerName: string;
  /** null cuando el envio se coordina por WhatsApp: no se pidio direccion. */
  address: string | null;
  zone: string | null;
  phone: string;
}) {
  const {
    lines: orderLines,
    buyerType,
    subtotal,
    shippingCost,
    total,
    customerName,
    phone,
    address,
    zone,
  } = params;

  const lines = [
    "Hola ELEVÉ! Quiero hacer este pedido:",
    "",
    ...orderLines.map(
      (i) => `• ${i.name} x${i.qty} — ${money(i.unitPrice)} c/u = ${money(i.unitPrice * i.qty)}`
    ),
    "",
    `Subtotal: ${money(subtotal)}${buyerType === "mayorista" ? " (precio mayorista)" : ""}`,
    `Envío: ${address ? (shippingCost === 0 ? "Gratis" : money(shippingCost)) : "a coordinar"}`,
    `Total: ${money(total)}`,
    "",
    `Nombre: ${customerName}`,
    `Teléfono: ${phone}`,
    ...(address ? [`Dirección: ${address}`] : []),
    ...(zone ? [`Zona: ${zone}`] : []),
  ];

  return lines.join("\n");
}

export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

import type { CartItem } from "@/store/cart";

// Numero placeholder para el boceto — reemplazar por el numero real del
// cliente en NEXT_PUBLIC_WHATSAPP_NUMBER (.env) antes de producción.
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5491100000000";

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

export function buildWhatsAppMessage(params: {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  customerName: string;
  phone: string;
  address: string;
}) {
  const { items, subtotal, shippingCost, total, customerName, phone, address } = params;

  const lines = [
    "Hola ELEVÉ! Quiero hacer este pedido:",
    "",
    ...items.map(
      (i) => `• ${i.name} x${i.qty} — ${money(i.unitPrice)} c/u = ${money(i.unitPrice * i.qty)}`
    ),
    "",
    `Subtotal: ${money(subtotal)}`,
    `Envío: ${shippingCost === 0 ? "Gratis" : money(shippingCost)}`,
    `Total: ${money(total)}`,
    "",
    `Nombre: ${customerName}`,
    `Teléfono: ${phone}`,
    `Dirección: ${address}`,
  ];

  return lines.join("\n");
}

export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

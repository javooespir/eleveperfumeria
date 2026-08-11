"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCartStore, cartSubtotal, cartCount } from "@/store/cart";
import { useBuyerTypeStore } from "@/store/buyer-type";
import { WHOLESALE_MIN_UNITS } from "@/lib/types";
import { calcularEnvio, SHIPPING_ZONES, type ShippingRules, type ShippingZone } from "@/lib/shipping";
import { buildWhatsAppMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { AddressAutocomplete } from "@/components/site/AddressAutocomplete";

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

export function CheckoutForm({ rules }: { rules: ShippingRules }) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const subtotal = cartSubtotal(items);
  const buyerType = useBuyerTypeStore((s) => s.buyerType) ?? "minorista";
  const count = cartCount(items);
  const belowWholesaleMin = buyerType === "mayorista" && count < WHOLESALE_MIN_UNITS;

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [zone, setZone] = useState<ShippingZone | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shippingCost = useMemo(
    () => (zone ? calcularEnvio(zone, subtotal, rules) : 0),
    [zone, subtotal, rules]
  );
  const total = subtotal + shippingCost;

  const canSubmit =
    items.length > 0 && customerName && phone && address && zone && !submitting && !belowWholesaleMin;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);

    const payload = {
      customerName,
      phone,
      address,
      zone,
      buyerType,
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        qty: i.qty,
        unitPrice: i.unitPrice,
      })),
      subtotal,
      shippingCost,
      total,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "No se pudo registrar el pedido. Probá de nuevo.");
        setSubmitting(false);
        return;
      }
    } catch {
      setError("No se pudo conectar. Probá de nuevo.");
      setSubmitting(false);
      return;
    }

    const message = buildWhatsAppMessage({
      items,
      subtotal,
      shippingCost,
      total,
      customerName,
      phone,
      address,
    });
    window.open(buildWhatsAppLink(message), "_blank");
    clear();
    router.push("/");
  }

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Tu carrito está vacío.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/40">
          <p className="text-sm font-medium">Resumen del pedido</p>
        </div>

        <div className="flex flex-col gap-4 p-4">
          {items.map((i) => (
            <div key={i.productId} className="flex items-center gap-3">
              <div className="relative size-14 shrink-0 rounded-md overflow-hidden border border-border bg-muted">
                <Image src={i.image} alt={i.name} fill sizes="56px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{i.name}</p>
                <p className="text-xs text-muted-foreground">x{i.qty}</p>
              </div>
              <p className="text-sm font-medium shrink-0">{money(i.unitPrice * i.qty)}</p>
            </div>
          ))}

          <div className="flex flex-col gap-1 border-t border-border pt-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span>{!zone ? "—" : shippingCost === 0 ? "Gratis" : money(shippingCost)}</span>
            </div>
            <div className="flex justify-between font-medium text-base mt-1">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="nombre">Nombre</Label>
        <Input id="nombre" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="telefono">Teléfono</Label>
        <Input id="telefono" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="direccion">Dirección</Label>
        <AddressAutocomplete id="direccion" value={address} onChange={setAddress} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="zona">Zona de entrega</Label>
        <select
          id="zona"
          value={zone}
          onChange={(e) => setZone(e.target.value as ShippingZone)}
          required
          className="border border-input bg-background rounded-md px-3 py-2 text-sm h-9"
        >
          <option value="" disabled>
            Elegí tu zona
          </option>
          {SHIPPING_ZONES.map((z) => (
            <option key={z.value} value={z.value}>
              {z.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-xs text-destructive text-center -mt-2">{error}</p>
      )}

      {belowWholesaleMin && (
        <p className="text-xs text-destructive text-center -mt-2">
          Como mayorista necesitás {WHOLESALE_MIN_UNITS} unidades mínimo en el carrito. Te faltan{" "}
          {WHOLESALE_MIN_UNITS - count}.
        </p>
      )}

      <Button type="submit" className="w-full rounded-none" disabled={!canSubmit}>
        Enviar pedido por WhatsApp
      </Button>
    </form>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCartStore, cartSubtotal, cartCount } from "@/store/cart";
import { useBuyerTypeStore } from "@/store/buyer-type";
import { WHOLESALE_MIN_UNITS } from "@/lib/types";
import { calcularEnvio, type ShippingRules } from "@/lib/shipping";
import { buildWhatsAppMessage, buildWhatsAppLink } from "@/lib/whatsapp";

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

// Distancias de prueba para el boceto — reemplazar por geocoding real luego.
const TEST_DISTANCES = [2, 4, 6, 12, 20];

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
  const [distanceKm, setDistanceKm] = useState(4);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shippingCost = useMemo(
    () => calcularEnvio(distanceKm, subtotal, rules),
    [distanceKm, subtotal, rules]
  );
  const total = subtotal + shippingCost;

  const canSubmit =
    items.length > 0 && customerName && phone && address && !submitting && !belowWholesaleMin;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);

    const payload = {
      customerName,
      phone,
      address,
      distanceKm,
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
      <div className="flex flex-col gap-3 border-b border-border pb-5">
        {items.map((i) => (
          <div key={i.productId} className="flex justify-between text-sm">
            <span>
              {i.name} x{i.qty}
            </span>
            <span>{money(i.unitPrice * i.qty)}</span>
          </div>
        ))}
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
        <Textarea id="direccion" value={address} onChange={(e) => setAddress(e.target.value)} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="distancia">
          Distancia al local (km) — {/* TODO: reemplazar por geocoding real */} valor de prueba
        </Label>
        <Input
          id="distancia"
          type="number"
          min={0}
          value={distanceKm}
          onChange={(e) => setDistanceKm(Number(e.target.value))}
        />
        <div className="flex gap-2 mt-1 flex-wrap">
          {TEST_DISTANCES.map((km) => (
            <button
              type="button"
              key={km}
              onClick={() => setDistanceKm(km)}
              className="rounded-full border border-border px-3 py-1 text-xs"
            >
              {km} km
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1 border-t border-border pt-4 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{money(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Envío</span>
          <span>{shippingCost === 0 ? "Gratis" : money(shippingCost)}</span>
        </div>
        <div className="flex justify-between font-medium text-base mt-1">
          <span>Total</span>
          <span>{money(total)}</span>
        </div>
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

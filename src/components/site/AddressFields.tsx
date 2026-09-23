"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AddressParts } from "@/lib/address";

/**
 * Direccion en campos separados.
 *
 * Antes era un solo campo con autocompletado de OpenStreetMap que pisaba lo
 * escrito por su "display_name": para "Catriel 3870, Lomas del Mirador"
 * guardaba "Monte Dorrego, CP 1754", y para "Pueyrredón 1832, Ramos Mejía"
 * ofrecia primero una calle de Mar de Ajó. Ahora la localidad y el CP los
 * escribe el cliente, que es quien los sabe, y el autocompletado (Google
 * Places, si hay API key) solo sugiere: nunca reemplaza nada sin un click.
 */

type Suggestion = { placeId: string; text: string };

export function AddressFields({
  value,
  onChange,
}: {
  value: AddressParts;
  onChange: (value: AddressParts) => void;
}) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const set = (patch: Partial<AddressParts>) => onChange({ ...value, ...patch });

  function handleStreet(text: string) {
    set({ street: text });
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (text.trim().length < 4) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/address?q=${encodeURIComponent(text)}`);
        const data = (await res.json()) as { suggestions?: Suggestion[] };
        const list = data.suggestions ?? [];
        setSuggestions(list);
        setOpen(list.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  }

  async function choose(s: Suggestion) {
    setSuggestions([]);
    setOpen(false);
    set({ street: s.text });

    try {
      const res = await fetch(`/api/address?placeId=${encodeURIComponent(s.placeId)}`);
      const d = (await res.json()) as {
        street?: string;
        locality?: string;
        postalCode?: string;
      };
      // Solo se completa lo que Google devuelve con dato; si viene vacio se
      // respeta lo que ya escribio el cliente.
      onChange({
        ...value,
        street: d.street || s.text,
        locality: d.locality || value.locality,
        postalCode: d.postalCode || value.postalCode,
      });
    } catch {
      /* la sugerencia ya quedo en el campo */
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div ref={containerRef} className="relative flex flex-col gap-1.5">
        <Label htmlFor="calle">Calle y altura</Label>
        <Input
          id="calle"
          className="h-11"
          value={value.street}
          onChange={(e) => handleStreet(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="Av. Pueyrredón 1832"
          autoComplete="off"
          required
        />
        {loading && (
          <span className="absolute right-3 top-10 text-[10px] text-muted-foreground">buscando…</span>
        )}
        {open && suggestions.length > 0 && (
          <ul className="absolute top-full z-20 mt-1 w-full max-h-56 overflow-auto rounded-md border border-border bg-popover shadow-md text-sm">
            {suggestions.map((s) => (
              <li key={s.placeId}>
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 hover:bg-muted transition-colors"
                  onClick={() => choose(s)}
                >
                  {s.text}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="extra">
          Piso / Depto <span className="text-muted-foreground font-normal">(opcional)</span>
        </Label>
        <Input
          id="extra"
          className="h-11"
          value={value.extra}
          onChange={(e) => set({ extra: e.target.value })}
          placeholder="3° B"
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="localidad">Localidad o barrio</Label>
          <Input
            id="localidad"
            className="h-11"
            value={value.locality}
            onChange={(e) => set({ locality: e.target.value })}
            placeholder="Ramos Mejía"
            autoComplete="off"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cp">Código postal</Label>
          <Input
            id="cp"
            value={value.postalCode}
            onChange={(e) => set({ postalCode: e.target.value.replace(/\D/g, "").slice(0, 4) })}
            placeholder="1704"
            inputMode="numeric"
            className="w-24 h-11"
            autoComplete="off"
            required
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

// Autocompletado de direcciones via Nominatim (OpenStreetMap) — gratis, sin
// API key. Calidad de sugerencias es menor que Google Places; si mas adelante
// se consigue una API key de Google Maps se puede cambiar solo esta funcion
// de busqueda por la de Places Autocomplete sin tocar el resto del checkout.

type Suggestion = { display_name: string };

async function searchAddress(query: string): Promise<Suggestion[]> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&addressdetails=0&countrycodes=ar&limit=5&q=${encodeURIComponent(query)}`
  );
  if (!res.ok) return [];
  return res.json();
}

export function AddressAutocomplete({
  id,
  value,
  onChange,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
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

  function handleChange(text: string) {
    onChange(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (text.trim().length < 5) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const results = await searchAddress(text).catch(() => []);
      setSuggestions(results);
      setOpen(results.length > 0);
    }, 400);
  }

  return (
    <div ref={containerRef} className="relative">
      <Input
        id={id}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder="Empezá a escribir tu dirección..."
        autoComplete="off"
        required
      />
      {open && (
        <ul className="absolute z-20 mt-1 w-full max-h-56 overflow-auto rounded-md border border-border bg-popover shadow-md text-sm">
          {suggestions.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-muted transition-colors"
                onClick={() => {
                  onChange(s.display_name);
                  setSuggestions([]);
                  setOpen(false);
                }}
              >
                {s.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

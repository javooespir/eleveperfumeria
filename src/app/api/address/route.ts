import { NextResponse } from "next/server";

/**
 * Proxy del autocompletado de direcciones de Google Places.
 *
 * La API key vive solo en el servidor (GOOGLE_MAPS_API_KEY, sin NEXT_PUBLIC_):
 * si el navegador la tuviera, cualquiera podria copiarla y gastar la cuota de
 * la cuenta. Sin key configurada, responde `configured: false` y el checkout
 * sigue andando con los campos escritos a mano.
 */

const AUTOCOMPLETE_URL = "https://places.googleapis.com/v1/places:autocomplete";

type Suggestion = { placeId: string; text: string };

async function autocomplete(input: string, key: string): Promise<Suggestion[]> {
  const res = await fetch(AUTOCOMPLETE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
    },
    body: JSON.stringify({
      input,
      includedRegionCodes: ["ar"],
      languageCode: "es",
      // Solo direcciones concretas: sin esto sugiere provincias y comercios.
      includedPrimaryTypes: ["street_address", "premise", "subpremise", "route"],
    }),
  });

  if (!res.ok) return [];

  const data = (await res.json()) as {
    suggestions?: { placePrediction?: { placeId: string; text?: { text: string } } }[];
  };

  return (data.suggestions ?? [])
    .map((s) => s.placePrediction)
    .filter((p): p is { placeId: string; text?: { text: string } } => !!p?.placeId)
    .map((p) => ({ placeId: p.placeId, text: p.text?.text ?? "" }))
    .filter((s) => s.text);
}

type Components = { longText: string; shortText: string; types: string[] }[];

function pick(components: Components, type: string, short = false) {
  const hit = components.find((c) => c.types.includes(type));
  if (!hit) return "";
  return short ? hit.shortText : hit.longText;
}

async function details(placeId: string, key: string) {
  const res = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=es`,
    { headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "addressComponents" } }
  );

  if (!res.ok) return null;

  const data = (await res.json()) as { addressComponents?: Components };
  const c = data.addressComponents ?? [];

  const route = pick(c, "route");
  const number = pick(c, "street_number");

  // Google devuelve la localidad en distintos niveles segun la zona: en CABA
  // el barrio viene como sublocality y en el conurbano la ciudad como
  // locality. Se toma el primero que exista, de mas especifico a menos.
  const locality =
    pick(c, "locality") ||
    pick(c, "sublocality_level_1") ||
    pick(c, "sublocality") ||
    pick(c, "administrative_area_level_2");

  return {
    street: [route, number].filter(Boolean).join(" "),
    locality,
    postalCode: pick(c, "postal_code"),
  };
}

export async function GET(request: Request) {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return NextResponse.json({ configured: false, suggestions: [] });

  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get("placeId");

  try {
    if (placeId) {
      const result = await details(placeId, key);
      if (!result) return NextResponse.json({ configured: true, error: true }, { status: 502 });
      return NextResponse.json({ configured: true, ...result });
    }

    const q = (searchParams.get("q") ?? "").trim();
    if (q.length < 4) return NextResponse.json({ configured: true, suggestions: [] });

    return NextResponse.json({ configured: true, suggestions: await autocomplete(q, key) });
  } catch {
    // Si Google falla, el checkout no se cae: se completa a mano.
    return NextResponse.json({ configured: true, suggestions: [] });
  }
}

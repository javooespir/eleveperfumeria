export type AddressParts = {
  street: string; // calle y altura
  extra: string; // piso / depto (opcional)
  locality: string; // localidad o barrio
  postalCode: string;
};

export const emptyAddress: AddressParts = {
  street: "",
  extra: "",
  locality: "",
  postalCode: "",
};

/** Arma la direccion en una linea, como la lee un cadete. */
export function formatAddress(a: AddressParts): string {
  const line = [a.street.trim(), a.extra.trim()].filter(Boolean).join(", ");
  const place = [a.locality.trim(), a.postalCode.trim() && `CP ${a.postalCode.trim()}`]
    .filter(Boolean)
    .join(", ");
  return [line, place].filter(Boolean).join(" — ");
}

/**
 * Minimo para poder despachar: calle con altura, localidad y CP de 4 digitos.
 * Antes alcanzaba con cualquier texto y entraban pedidos imposibles de entregar.
 */
export function validateAddress(a: AddressParts): string | null {
  const street = a.street.trim();
  if (street.length < 5) return "Escribí la calle y la altura.";
  if (!/\d/.test(street)) return "Falta la altura de la calle.";
  if (a.locality.trim().length < 3) return "Escribí la localidad o barrio.";
  if (!/^\d{4}$/.test(a.postalCode.trim())) return "El código postal tiene 4 números.";
  return null;
}

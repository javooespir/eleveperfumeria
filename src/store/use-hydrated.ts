"use client";

import { useEffect, useState } from "react";

/**
 * true recien despues del primer render en el cliente.
 *
 * Los stores con `persist` (carrito, tipo de compra) leen localStorage al
 * crearse, asi que en el cliente arrancan con datos que el HTML del servidor
 * no tenia. Renderizar eso en el primer paso rompe la hidratacion; con este
 * flag se muestra el estado vacio hasta que React termina de hidratar.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

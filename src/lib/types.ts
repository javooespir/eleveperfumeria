export type BuyerType = "minorista" | "mayorista";

export const WHOLESALE_MIN_UNITS = 5;

export type Product = {
  id: string;
  productCode: string | null;
  name: string;
  brand: string;
  description: string;
  price: number;
  wholesalePrice: number | null;
  discountActive: boolean;
  discountPercent: number;
  images: string[];
  stock: number;
  categoryId: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

function basePrice(product: Pick<Product, "price" | "wholesalePrice">, buyerType: BuyerType) {
  if (buyerType === "mayorista" && product.wholesalePrice != null) return product.wholesalePrice;
  return product.price;
}

export function finalPrice(
  product: Pick<Product, "price" | "wholesalePrice" | "discountActive" | "discountPercent">,
  buyerType: BuyerType = "minorista"
) {
  const base = basePrice(product, buyerType);
  if (!product.discountActive || product.discountPercent <= 0) return base;
  return Math.round(base * (1 - product.discountPercent / 100));
}

/**
 * Tipo de compra que realmente se aplica. Llegar a WHOLESALE_MIN_UNITS
 * unidades activa precio mayorista aunque el visitante haya elegido
 * "minorista"; a la inversa no degrada una eleccion explicita de mayorista
 * (esos ven el recordatorio de cuantas unidades les faltan).
 */
export function effectiveBuyerType(selected: BuyerType | null, count: number): BuyerType {
  if (count >= WHOLESALE_MIN_UNITS) return "mayorista";
  return selected ?? "minorista";
}

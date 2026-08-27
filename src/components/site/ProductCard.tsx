"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { finalPrice, type Product } from "@/lib/types";
import { useCartStore } from "@/store/cart";
import { useEffectiveBuyerType } from "@/store/use-effective-buyer-type";

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

export function ProductCard({
  product,
  onOpen,
}: {
  product: Product;
  onOpen: (product: Product) => void;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const buyerType = useEffectiveBuyerType();
  const price = finalPrice(product, buyerType);
  const hasDiscount = product.discountActive && product.discountPercent > 0;
  const isWholesale = buyerType === "mayorista" && product.wholesalePrice != null;

  return (
    <div className="flex flex-col">
      <button
        onClick={() => onOpen(product)}
        className="relative aspect-[4/5] w-full overflow-hidden bg-muted text-left"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover"
        />
        {hasDiscount && (
          <Badge className="absolute top-2 left-2 bg-champagne text-foreground border-none">
            -{product.discountPercent}%
          </Badge>
        )}
      </button>

      <button onClick={() => onOpen(product)} className="text-left mt-3">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{product.brand}</p>
        <p className="text-sm">{product.name}</p>
        <div className="flex items-center gap-2 mt-1">
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              {money(product.price)}
            </span>
          )}
          <span className="text-sm font-medium">{money(price)}</span>
          {isWholesale && (
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
              mayorista
            </span>
          )}
        </div>
      </button>

      <Button
        variant="outline"
        size="sm"
        className="mt-3 w-full rounded-none"
        onClick={() =>
          addItem(
            {
              productId: product.id,
              name: product.name,
              price: product.price,
              wholesalePrice: product.wholesalePrice,
              discountActive: product.discountActive,
              discountPercent: product.discountPercent,
              image: product.images[0],
              stock: product.stock,
            },
            1
          )
        }
        disabled={product.stock <= 0}
      >
        {product.stock <= 0 ? "Sin stock" : "Agregar"}
      </Button>
    </div>
  );
}

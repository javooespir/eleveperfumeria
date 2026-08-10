"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { finalPrice, type Product } from "@/lib/types";
import { useCartStore } from "@/store/cart";
import { useBuyerTypeStore } from "@/store/buyer-type";

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

export function ProductModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const buyerType = useBuyerTypeStore((s) => s.buyerType) ?? "minorista";
  const open = () => setQty(1);

  if (!product) return null;

  const price = finalPrice(product, buyerType);
  const hasDiscount = product.discountActive && product.discountPercent > 0;
  const isWholesale = buyerType === "mayorista" && product.wholesalePrice != null;

  return (
    <Dialog
      open={!!product}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
        else open();
      }}
    >
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden gap-0 max-h-[90vh] overflow-y-auto">
        <Carousel className="w-full">
          <CarouselContent>
            {product.images.map((src, i) => (
              <CarouselItem key={i}>
                <div className="relative aspect-square w-full bg-muted">
                  <Image
                    src={src}
                    alt={`${product.name} — foto ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 512px"
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="p-5">
          <DialogTitle className="text-lg font-normal">{product.name}</DialogTitle>
          <DialogDescription className="text-xs uppercase tracking-wide mt-1">
            {product.brand}
          </DialogDescription>

          <p className="text-sm text-muted-foreground mt-3">{product.description}</p>

          <div className="flex items-center gap-2 mt-4">
            {hasDiscount && (
              <>
                <span className="text-sm text-muted-foreground line-through">
                  {money(product.price)}
                </span>
                <Badge className="bg-champagne text-foreground border-none">
                  -{product.discountPercent}%
                </Badge>
              </>
            )}
            <span className="text-lg font-medium">{money(price)}</span>
            {isWholesale && (
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                precio mayorista
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Restar cantidad"
              className="flex size-9 items-center justify-center border border-border"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-6 text-center">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              aria-label="Sumar cantidad"
              disabled={qty >= product.stock}
              className="flex size-9 items-center justify-center border border-border disabled:opacity-30"
            >
              <Plus className="size-4" />
            </button>
          </div>

          <Button
            className="w-full mt-5 rounded-none"
            disabled={product.stock <= 0}
            onClick={() => {
              addItem(
                {
                  productId: product.id,
                  name: product.name,
                  unitPrice: price,
                  image: product.images[0],
                  stock: product.stock,
                },
                qty
              );
              onClose();
            }}
          >
            {product.stock <= 0 ? "Sin stock" : "Agregar al carrito"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

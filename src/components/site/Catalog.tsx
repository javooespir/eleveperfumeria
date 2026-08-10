"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CategoryChips } from "@/components/site/CategoryChips";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductModal } from "@/components/site/ProductModal";
import { BuyerTypeGate } from "@/components/site/BuyerTypeGate";
import type { Category, Product } from "@/lib/types";

export function Catalog({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get("categoria");
  const [activeSlug, setActiveSlug] = useState<string | null>(initialSlug);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const activeCategory = categories.find((c) => c.slug === activeSlug);
  const filtered = useMemo(
    () =>
      activeCategory
        ? products.filter((p) => p.categoryId === activeCategory.id)
        : products,
    [products, activeCategory]
  );

  return (
    <div>
      <BuyerTypeGate />
      <CategoryChips categories={categories} active={activeSlug} onSelect={setActiveSlug} />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 px-4 sm:px-6 pb-16">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} onOpen={setSelectedProduct} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-16">
          No hay productos en esta categoría.
        </p>
      )}

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}

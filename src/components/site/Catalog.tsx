"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const searchParams = useSearchParams();

  // La categoria activa sale siempre de la URL, no de un estado local. Antes
  // se copiaba a useState en el primer render, asi que los links del menu
  // lateral (/catalogo?categoria=...) cambiaban la direccion pero el listado
  // se quedaba igual: solo filtraban los botones de arriba.
  const activeSlug = searchParams.get("categoria");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  function selectCategory(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("categoria", slug);
    else params.delete("categoria");
    const query = params.toString();
    router.replace(query ? `/catalogo?${query}` : "/catalogo", { scroll: false });
  }

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
      <CategoryChips categories={categories} active={activeSlug} onSelect={selectCategory} />

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

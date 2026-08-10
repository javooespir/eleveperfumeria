import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { Catalog } from "@/components/site/Catalog";
import type { Product } from "@/lib/types";

export default async function CatalogoPage() {
  const [rawProducts, categories] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const products: Product[] = rawProducts.map((p) => ({
    id: p.id,
    productCode: p.productCode,
    name: p.name,
    brand: p.brand,
    description: p.description,
    price: p.price,
    wholesalePrice: p.wholesalePrice,
    discountActive: p.discountActive,
    discountPercent: p.discountPercent,
    images: JSON.parse(p.images) as string[],
    stock: p.stock,
    categoryId: p.categoryId,
  }));

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.slice(0, 50).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.name,
        brand: p.brand,
        image: p.images[0],
        offers: {
          "@type": "Offer",
          priceCurrency: "ARS",
          price: p.price,
          availability:
            p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
      },
    })),
  };

  return (
    <Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <Catalog products={products} categories={categories} />
    </Suspense>
  );
}

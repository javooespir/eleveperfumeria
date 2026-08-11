import { Suspense } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Catalog } from "@/components/site/Catalog";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Perfumes árabes y de diseñador, body splash y tubitos de muestra. Envíos a domicilio, precios minorista y mayorista.",
  alternates: { canonical: "/catalogo" },
};

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <h1 className="px-4 sm:px-6 pt-8 text-2xl sm:text-3xl font-heading font-light">
        Catálogo de perfumes
      </h1>
      {/* Suspense acotado solo al client component: usa useSearchParams(),
          que requiere este boundary. Si envolviera tambien el h1/json-ld de
          arriba, quedan afuera del HTML estatico (van solo en el payload RSC
          para hidratacion) — invisibles para crawlers que no ejecutan JS. */}
      <Suspense>
        <Catalog products={products} categories={categories} />
      </Suspense>
    </>
  );
}

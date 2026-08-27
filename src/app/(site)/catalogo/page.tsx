import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Catalog } from "@/components/site/Catalog";
import type { Product } from "@/lib/types";

// El catalogo refleja stock, precios, fotos y altas/bajas de productos que
// el cliente cambia desde el admin. Prerenderizado quedaba congelado hasta
// el proximo deploy (fotos nuevas y stock actualizado no aparecian).
//
// Ademas, al ser dinamica, <Catalog> ya no necesita el <Suspense> que pedia
// useSearchParams() cuando la pagina era estatica. Ese boundary (sin
// fallback) impedia que el subarbol hidratara: el catalogo se veia bien pero
// no respondia a ningun click — ni filtros, ni "Agregar", ni el popup de
// minorista/mayorista.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Perfumes árabes y de diseñador, body splash y tubitos de muestra. Envíos a domicilio, precios minorista y mayorista.",
  alternates: { canonical: "/catalogo" },
};

export default async function CatalogoPage() {
  const [rawProducts, categories] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } }),
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
      <Catalog products={products} categories={categories} />
    </>
  );
}

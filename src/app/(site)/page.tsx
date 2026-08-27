import { prisma } from "@/lib/prisma";
import { MarketingHero } from "@/components/site/MarketingHero";
import { ProductCarouselSection } from "@/components/site/ProductCarouselSection";
import { BrandLogos } from "@/components/site/BrandLogos";
import { LandingCta } from "@/components/site/LandingCta";
import { ScentQuizCta } from "@/components/site/ScentQuizCta";
import { WholesaleShowcase } from "@/components/site/WholesaleShowcase";
import { getSiteContent } from "@/lib/site-content";
import type { Product } from "@/lib/types";

// La portada muestra stock, precios y textos que el cliente edita desde el
// admin. Con prerenderizado estatico esos cambios no aparecian hasta el
// siguiente deploy, asi que se renderiza por request.
export const dynamic = "force-dynamic";

function toProduct(p: {
  id: string;
  productCode: string | null;
  name: string;
  brand: string;
  description: string;
  price: number;
  wholesalePrice: number | null;
  discountActive: boolean;
  discountPercent: number;
  images: string;
  stock: number;
  categoryId: string;
}): Product {
  return {
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
  };
}

export default async function LandingPage() {
  const [trendingRaw, productCount, categoryCount, content] = await Promise.all([
    prisma.product.findMany({
      where: { isTrending: true, isActive: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.category.count(),
    getSiteContent(),
  ]);

  const trending = trendingRaw.map(toProduct);

  return (
    <>
      <MarketingHero
        productCount={productCount}
        brandCount={5}
        categoryCount={categoryCount}
        content={content}
      />
      {trending.length > 0 && (
        <ProductCarouselSection
          title={content.trending_title}
          emoji="🔥"
          products={trending}
        />
      )}
      <ScentQuizCta content={content} />
      <WholesaleShowcase />
      <BrandLogos />
      <LandingCta content={content} />
    </>
  );
}

import { prisma } from "@/lib/prisma";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Header } from "@/components/site/Header";
import { CartDrawer } from "@/components/site/CartDrawer";
import { Footer } from "@/components/site/Footer";
import { WholesaleReminder } from "@/components/site/WholesaleReminder";
import { ScentQuiz } from "@/components/site/ScentQuiz";
import { QUIZ_RESULTS } from "@/lib/quiz";
import type { Product } from "@/lib/types";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const quizProductNames = Object.values(QUIZ_RESULTS).map((r) => r.productName);

  const [categories, quizProductsRaw] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ where: { name: { in: quizProductNames } } }),
  ]);

  const quizProducts: Product[] = quizProductsRaw.map((p) => ({
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

  return (
    <>
      <Header categories={categories} />
      <AnnouncementBar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <WholesaleReminder />
      <ScentQuiz products={quizProducts} />
    </>
  );
}

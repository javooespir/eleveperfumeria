// Seed data para el prototipo ELEVÉ. Productos y precios extraidos de las
// fichas reales que paso el cliente (product w price/). Fotos en /public/images/products.
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "Perfumes Árabes Hombre", slug: "perfumes-arabes-hombre" },
  { name: "Perfumes Árabes Mujer", slug: "perfumes-arabes-mujer" },
  { name: "Perfumes Árabes Unisex", slug: "perfumes-arabes-unisex" },
  { name: "Perfumes Diseñador Hombre", slug: "perfumes-disenador-hombre" },
  { name: "Perfumes Diseñador Mujer", slug: "perfumes-disenador-mujer" },
  { name: "Bodysplash", slug: "bodysplash" },
  { name: "Tubitos Árabes", slug: "tubitos-arabes" },
];

const wholesale = (price: number) => Math.round((price * 0.75) / 500) * 500;

const placeholderImages = (seed: string) => [
  `https://picsum.photos/seed/${seed}-1/800/1000`,
  `https://picsum.photos/seed/${seed}-2/800/1000`,
];

type SeedProduct = {
  code: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  discount?: number;
  featured?: boolean;
  trending?: boolean;
  image: string;
};

const products: SeedProduct[] = [
  // ---- Perfumes Árabes Hombre ----
  { code: "PAH-01", name: "Jean Lowe Immortel", brand: "Maison Alhambra", price: 52000, category: "perfumes-arabes-hombre", featured: true, image: "jean-lowe-immortel.jpg" },
  { code: "PAH-02", name: "Fakhar", brand: "Lattafa", price: 60000, category: "perfumes-arabes-hombre", featured: true, image: "fakhar.jpg" },
  { code: "PAH-03", name: "Fakhar Gold", brand: "Lattafa", price: 50000, category: "perfumes-arabes-hombre", image: "fakhar-gold.jpg" },
  { code: "PAH-04", name: "Asad Bourbon", brand: "Lattafa", price: 70000, category: "perfumes-arabes-hombre", trending: true, image: "asad-bourbon.jpg" },
  { code: "PAH-05", name: "Asad Zanzibar Limited Edition", brand: "Lattafa", price: 60000, category: "perfumes-arabes-hombre", image: "asad-zanzibar.jpg" },
  { code: "PAH-06", name: "Asad", brand: "Lattafa", price: 60000, category: "perfumes-arabes-hombre", featured: true, trending: true, image: "asad.jpg" },
  { code: "PAH-07", name: "Odyssey Tyrant Special Edition", brand: "Armaf", price: 50000, category: "perfumes-arabes-hombre", image: "odyssey-tyrant.jpg" },
  { code: "PAH-08", name: "Odyssey Mandarin Sky Limited Edition", brand: "Armaf", price: 66000, category: "perfumes-arabes-hombre", trending: true, image: "odyssey-mandarin-sky.jpg" },
  { code: "PAH-09", name: "9PM", brand: "Afnan", price: 65000, category: "perfumes-arabes-hombre", featured: true, image: "afnan-9pm.jpg" },
  { code: "PAH-10", name: "Ameer Al Arab Imperium", brand: "Asdaaf", price: 40000, category: "perfumes-arabes-hombre", image: "ameer-al-arab-imperium.jpg" },
  { code: "PAH-11", name: "Club de Nuit Urban Elixir", brand: "Armaf", price: 79000, category: "perfumes-arabes-hombre", featured: true, trending: true, image: "club-de-nuit-urban-elixir.jpg" },
  { code: "PAH-12", name: "Club de Nuit Intense Man", brand: "Armaf", price: 70000, category: "perfumes-arabes-hombre", trending: true, image: "club-de-nuit-intense-man.jpg" },

  // ---- Perfumes Árabes Mujer ----
  { code: "PAM-01", name: "Mayar", brand: "Lattafa", price: 55000, category: "perfumes-arabes-mujer", featured: true, image: "mayar.jpg" },
  { code: "PAM-02", name: "Sakeena", brand: "Lattafa", price: 55000, category: "perfumes-arabes-mujer", featured: true, image: "sakeena.jpg" },
  { code: "PAM-03", name: "Yara", brand: "Lattafa", price: 50000, category: "perfumes-arabes-mujer", trending: true, image: "yara-tous.jpg" },
  { code: "PAM-04", name: "Yara Moi", brand: "Lattafa", price: 55000, category: "perfumes-arabes-mujer", image: "yara-moi.jpg" },
  { code: "PAM-05", name: "Yara Candy", brand: "Lattafa", price: 60000, category: "perfumes-arabes-mujer", featured: true, trending: true, image: "yara-candy.jpg" },
  { code: "PAM-06", name: "Eclaire", brand: "Lattafa", price: 60000, category: "perfumes-arabes-mujer", image: "eclaire.jpg" },
  { code: "PAM-07", name: "Badee Al Oud Noble Blush", brand: "Lattafa", price: 55000, category: "perfumes-arabes-mujer", trending: true, image: "badee-al-oud-noble-blush.jpg" },
  { code: "PAM-08", name: "Club de Nuit Woman", brand: "Armaf", price: 79000, category: "perfumes-arabes-mujer", featured: true, image: "club-de-nuit-women.jpg" },
  { code: "PAM-09", name: "TAG Donna Di Terra", brand: "Armaf", price: 30000, category: "perfumes-arabes-mujer", image: "tag-donna-di-terra.jpg" },

  // ---- Perfumes Árabes Unisex ----
  { code: "PAU-01", name: "Khamrah", brand: "Lattafa", price: 60000, category: "perfumes-arabes-unisex", featured: true, trending: true, image: "khamrah.jpg" },
  { code: "PAU-02", name: "Khamrah Qahwa", brand: "Lattafa", price: 55000, category: "perfumes-arabes-unisex", trending: true, image: "khamrah-qahwa.jpg" },
  { code: "PAU-03", name: "Emaan", brand: "Lattafa", price: 50000, category: "perfumes-arabes-unisex", image: "emaan.jpg" },
  { code: "PAU-04", name: "Badee Al Oud Honor & Glory", brand: "Lattafa", price: 55000, category: "perfumes-arabes-unisex", featured: true, image: "badee-al-oud-honor-glory.jpg" },
];

// Perfumes Diseñador Hombre/Mujer: categorías vacías por ahora — se sacaron
// Polo Red, Acqua di Giò y 212 VIP Rosé a pedido del cliente (sin foto propia
// confirmada / no las quiere vender). Quedan listas para cargar productos reales despues.

async function main() {
  await prisma.shippingConfig.upsert({
    where: { id: "config" },
    update: {},
    create: { id: "config" },
  });

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c,
    });
  }

  for (const p of products) {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: p.category } });
    await prisma.product.create({
      data: {
        productCode: p.code,
        name: p.name,
        brand: p.brand,
        description: `${p.name} de ${p.brand}. Eau de Parfum 100ml.`,
        price: p.price,
        wholesalePrice: wholesale(p.price),
        discountActive: (p.discount ?? 0) > 0,
        discountPercent: p.discount ?? 0,
        isFeatured: p.featured ?? false,
        isTrending: p.trending ?? false,
        images: JSON.stringify([`/images/products/${p.image}`]),
        stock: 20,
        categoryId: category.id,
      },
    });
  }

  // Bodysplash y tubitos: sin foto/precio real provisto por el cliente aun,
  // se mantienen con datos placeholder hasta que el cliente los confirme.
  // Sin flags de landing: son fotos placeholder (picsum), no reales — no deben
  // aparecer en "Sets y novedades" / "Los más buscados".
  const mockExtras: SeedProduct[] = [
    { code: "BS-01", name: "Body Splash Coco Sun", brand: "Casa Lumen", price: 18000, category: "bodysplash", image: "" },
    { code: "BS-02", name: "Body Splash Cherry Blossom", brand: "Maison Fleur", price: 18000, category: "bodysplash", discount: 10, image: "" },
    { code: "BS-03", name: "Body Splash Citrus Fresh", brand: "Atelier Nord", price: 17000, category: "bodysplash", image: "" },
    { code: "TA-01", name: "Tubito Khamrah 5ml", brand: "Lattafa", price: 9000, category: "tubitos-arabes", image: "" },
    { code: "TA-02", name: "Tubito Asad 5ml", brand: "Lattafa", price: 9000, category: "tubitos-arabes", image: "" },
    { code: "TA-03", name: "Tubito Yara 5ml", brand: "Lattafa", price: 8000, category: "tubitos-arabes", image: "" },
  ];

  for (const p of mockExtras) {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: p.category } });
    const seedKey = p.name.toLowerCase().replace(/\s+/g, "-");
    await prisma.product.create({
      data: {
        productCode: p.code,
        name: p.name,
        brand: p.brand,
        description: `${p.name} de ${p.brand}.`,
        price: p.price,
        wholesalePrice: wholesale(p.price),
        discountActive: (p.discount ?? 0) > 0,
        discountPercent: p.discount ?? 0,
        isFeatured: p.featured ?? false,
        isTrending: p.trending ?? false,
        // Sin foto/precio real todavia — quedan ocultos del catalogo
        // publico hasta que el cliente confirme los datos reales.
        isActive: false,
        images: JSON.stringify(placeholderImages(seedKey)),
        stock: 20,
        categoryId: category.id,
      },
    });
  }

  const total = products.length + mockExtras.length;
  console.log(`Seed OK: ${categories.length} categorias, ${total} productos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

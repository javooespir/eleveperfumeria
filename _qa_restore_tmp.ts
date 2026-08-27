import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { contentDefaults } from "@/lib/site-content";

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });
  await prisma.siteContent.update({
    where: { key: "hero_subtitle" },
    data: { value: contentDefaults.hero_subtitle },
  });
  const row = await prisma.siteContent.findUnique({ where: { key: "hero_subtitle" } });
  console.log("restaurado:", row?.value);
}
main().then(() => process.exit(0));

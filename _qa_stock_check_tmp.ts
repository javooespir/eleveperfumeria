import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });
  const ids = [
    "cmsnuirys000u2ovf73ag4jim", // Emaan (2 pedidos x1)
    "cmsnuin68000h2ovfm3qkepaa", // Club de Nuit Urban Elixir (2 pedidos x1)
    "cmsnuiq9m000q2ovftvpa2zew", // Club de Nuit Woman (1)
  ];
  const rows = await prisma.product.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true, stock: true },
  });
  console.log(rows);
}
main().then(() => process.exit(0));

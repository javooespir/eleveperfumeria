import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });
  const order = await prisma.order.findFirst({ where: { customerName: "QA Borrar" } });
  const product = await prisma.product.findUnique({
    where: { id: "cmsnuikft000a2ovfz7brmpcw" },
    select: { name: true, stock: true },
  });
  console.log("pedido QA Borrar existe:", !!order, "| stock:", product);
}
main().then(() => process.exit(0));

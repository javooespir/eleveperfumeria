import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, customerName: true, phone: true, address: true, zone: true, status: true, buyerType: true, total: true, itemsJson: true },
  });
  console.log(JSON.stringify(orders, null, 2));
}
main().then(() => process.exit(0));

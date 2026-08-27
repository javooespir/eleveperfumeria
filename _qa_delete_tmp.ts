import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const BASE = "http://localhost:59400";

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  const p = await prisma.product.findFirst({ where: { isActive: true, stock: { gte: 5 } } });
  if (!p) throw new Error("no product");
  const stockBefore = p.stock;

  const res = await fetch(`${BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerName: "QA Borrar",
      phone: "1131462214",
      address: "Calle Falsa 123",
      zone: "caba",
      items: [{ productId: p.id, qty: 2 }],
    }),
  });
  const created = await res.json();
  const afterOrder = await prisma.product.findUnique({ where: { id: p.id } });
  console.log(`creado pedido ${created.id} | stock ${stockBefore} -> ${afterOrder?.stock}`);
  console.log(`ORDER_ID=${created.id}`);
  console.log(`PRODUCT_ID=${p.id}`);
}
main().then(() => process.exit(0));

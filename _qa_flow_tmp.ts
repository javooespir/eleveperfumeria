import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const BASE = "http://localhost:59400";

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  const p = await prisma.product.findFirst({
    where: { isActive: true, stock: { gte: 10 }, wholesalePrice: { not: null } },
  });
  if (!p) throw new Error("no product with wholesale price and stock");
  console.log(`PRODUCTO: ${p.name} | minorista $${p.price} | mayorista $${p.wholesalePrice} | stock ${p.stock}`);

  // --- 1. Validacion: datos basura deben rechazarse ---
  const bad = await fetch(`${BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerName: ",", phone: ",", address: ",", zone: "caba",
      items: [{ productId: p.id, qty: 1 }],
    }),
  });
  console.log(`VALIDACION datos basura -> ${bad.status} ${await bad.text()}`);

  // --- 2. Zona invalida ---
  const badZone = await fetch(`${BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerName: "QA Test", phone: "1131462214", address: "Calle Falsa 123", zone: "",
      items: [{ productId: p.id, qty: 1 }],
    }),
  });
  console.log(`VALIDACION zona vacia -> ${badZone.status} ${await badZone.text()}`);

  // --- 3. Precio manipulado desde el cliente debe ignorarse ---
  const tampered = await fetch(`${BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerName: "QA Tamper", phone: "1131462214", address: "Calle Falsa 123", zone: "caba",
      items: [{ productId: p.id, qty: 1, unitPrice: 1 }],
      subtotal: 1, shippingCost: 0, total: 1,
    }),
  });
  const tamperedBody = await tampered.json();
  console.log(`ANTI-TAMPER precio 1 peso -> total real $${tamperedBody.total} (esperado ~$${p.price})`);

  // --- 4. Auto-mayorista con 5 unidades ---
  const wholesale = await fetch(`${BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerName: "QA Mayorista", phone: "1131462214", address: "Calle Falsa 123", zone: "caba",
      items: [{ productId: p.id, qty: 5 }],
    }),
  });
  const wBody = await wholesale.json();
  console.log(`AUTO-MAYORISTA 5u -> buyerType=${wBody.buyerType} unitPrice=$${wBody.items?.[0]?.unitPrice} (mayorista=$${p.wholesalePrice})`);

  // --- 5. Stock ---
  const after = await prisma.product.findUnique({ where: { id: p.id } });
  console.log(`STOCK ${p.stock} -> ${after?.stock} (esperado ${p.stock - 6})`);

  // --- limpieza ---
  const del = await prisma.order.deleteMany({ where: { customerName: { in: ["QA Tamper", "QA Mayorista"] } } });
  await prisma.product.update({ where: { id: p.id }, data: { stock: p.stock } });
  console.log(`LIMPIEZA: ${del.count} pedidos borrados, stock restaurado a ${p.stock}`);
}
main().then(() => process.exit(0));

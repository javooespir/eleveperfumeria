import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { customerName, phone, address, zone, buyerType, items, subtotal, shippingCost, total } = body;

  const cartItems = items as { productId: string; name: string; qty: number; unitPrice: number }[];

  try {
    const order = await prisma.$transaction(async (tx) => {
      for (const item of cartItems) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product || product.stock < item.qty) {
          throw new Error(`STOCK_INSUFICIENTE:${item.name}`);
        }
      }

      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.qty } },
        });
      }

      return tx.order.create({
        data: {
          customerName,
          phone,
          address,
          zone,
          buyerType: buyerType === "mayorista" ? "mayorista" : "minorista",
          itemsJson: JSON.stringify(items),
          subtotal,
          shippingCost,
          total,
        },
      });
    });

    return NextResponse.json({ id: order.id });
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("STOCK_INSUFICIENTE:")) {
      const name = err.message.split(":")[1];
      return NextResponse.json(
        { error: `Sin stock suficiente de "${name}". Actualizá el carrito.` },
        { status: 409 }
      );
    }
    throw err;
  }
}

export async function GET() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(orders);
}

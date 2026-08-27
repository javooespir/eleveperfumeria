import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getStoreConfig } from "@/lib/config";
import { calcularEnvio, SHIPPING_ZONES, type ShippingZone } from "@/lib/shipping";
import { effectiveBuyerType, finalPrice } from "@/lib/types";

type IncomingItem = { productId: string; qty: number };

export async function POST(request: Request) {
  const body = await request.json();
  const { customerName, phone, address, zone, items } = body as {
    customerName?: string;
    phone?: string;
    address?: string;
    zone?: string;
    items?: IncomingItem[];
  };

  // Validacion basica: sin esto entraban pedidos con nombre/telefono "," o
  // vacios, que despues no se pueden contactar.
  const name = String(customerName ?? "").trim();
  const phoneClean = String(phone ?? "").trim();
  const addressClean = String(address ?? "").trim();

  if (name.length < 2 || phoneClean.replace(/\D/g, "").length < 6 || addressClean.length < 5) {
    return NextResponse.json(
      { error: "Completá nombre, teléfono y dirección válidos." },
      { status: 400 }
    );
  }

  if (!SHIPPING_ZONES.some((z) => z.value === zone)) {
    return NextResponse.json({ error: "Elegí una zona de entrega." }, { status: 400 });
  }

  const cartItems = (items ?? []).filter((i) => i?.productId && Number(i.qty) > 0);
  if (cartItems.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: cartItems.map((i) => i.productId) } },
      });

      // Precios y totales se recalculan del lado del servidor a partir de la
      // base: lo que manda el navegador solo dice que producto y cuantas
      // unidades, nunca cuanto cuesta.
      const units = cartItems.reduce((sum, i) => sum + Math.floor(i.qty), 0);
      const buyerType = effectiveBuyerType(null, units);

      const lines = cartItems.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product || !product.isActive) {
          throw new Error(`NO_DISPONIBLE:${product?.name ?? "Un producto"}`);
        }
        const qty = Math.floor(item.qty);
        if (product.stock < qty) {
          throw new Error(`STOCK_INSUFICIENTE:${product.name}`);
        }
        return {
          productId: product.id,
          name: product.name,
          qty,
          unitPrice: finalPrice(product, buyerType),
        };
      });

      for (const line of lines) {
        await tx.product.update({
          where: { id: line.productId },
          data: { stock: { decrement: line.qty } },
        });
      }

      const config = await getStoreConfig();
      const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
      const shippingCost = calcularEnvio(zone as ShippingZone, subtotal, config);

      return tx.order.create({
        data: {
          customerName: name,
          phone: phoneClean,
          address: addressClean,
          zone: zone as string,
          buyerType,
          itemsJson: JSON.stringify(lines),
          subtotal,
          shippingCost,
          total: subtotal + shippingCost,
        },
      });
    });

    // El stock cambio: refrescar catalogo y portada para que no muestren
    // unidades que ya no existen.
    revalidatePath("/");
    revalidatePath("/catalogo");
    revalidatePath("/admin");
    revalidatePath("/admin/pedidos");

    return NextResponse.json({
      id: order.id,
      buyerType: order.buyerType,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total,
      items: JSON.parse(order.itemsJson),
    });
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("STOCK_INSUFICIENTE:")) {
      const name = err.message.split(":")[1];
      return NextResponse.json(
        { error: `Sin stock suficiente de "${name}". Actualizá el carrito.` },
        { status: 409 }
      );
    }
    if (err instanceof Error && err.message.startsWith("NO_DISPONIBLE:")) {
      const name = err.message.split(":")[1];
      return NextResponse.json(
        { error: `"${name}" ya no está disponible. Sacalo del carrito.` },
        { status: 409 }
      );
    }
    throw err;
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { clearAdminSession } from "@/lib/admin-auth";
import { CONTENT_FIELDS } from "@/lib/site-content";

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Refresca las paginas publicas despues de tocar catalogo o textos.
 * Estaba faltando "/catalogo" en varias acciones, asi que las fotos y el
 * stock nuevos no aparecian en el sitio hasta el proximo deploy.
 */
function revalidateStorefront() {
  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/admin");
  revalidatePath("/admin/productos");
}

function productDataFromForm(formData: FormData) {
  const images = String(formData.get("images") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const wholesaleRaw = String(formData.get("wholesalePrice") ?? "").trim();
  const codeRaw = String(formData.get("productCode") ?? "").trim();

  return {
    productCode: codeRaw || null,
    name: String(formData.get("name")).trim(),
    brand: String(formData.get("brand")).trim(),
    description: String(formData.get("description")).trim(),
    price: Number(formData.get("price")),
    wholesalePrice: wholesaleRaw ? Number(wholesaleRaw) : null,
    stock: Number(formData.get("stock")),
    discountActive: formData.get("discountActive") === "on",
    discountPercent: Number(formData.get("discountPercent") ?? 0),
    isFeatured: formData.get("isFeatured") === "on",
    isTrending: formData.get("isTrending") === "on",
    isActive: formData.get("isActive") === "on",
    images: JSON.stringify(
      images.length ? images : ["https://picsum.photos/seed/placeholder/800/1000"]
    ),
    categoryId: String(formData.get("categoryId")),
  };
}

// ---- Productos ----

export async function createProduct(formData: FormData) {
  await prisma.product.create({ data: productDataFromForm(formData) });
  revalidateStorefront();
  redirect("/admin/productos");
}

export async function updateProduct(id: string, formData: FormData) {
  await prisma.product.update({ where: { id }, data: productDataFromForm(formData) });
  revalidateStorefront();
  redirect("/admin/productos");
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.product.delete({ where: { id } });
  revalidateStorefront();
}

export async function toggleProductActive(formData: FormData) {
  const id = String(formData.get("id"));
  const active = formData.get("active") === "true";
  await prisma.product.update({ where: { id }, data: { isActive: active } });
  revalidateStorefront();
}

// ---- Categorias ----

export async function createCategory(formData: FormData) {
  const name = String(formData.get("name")).trim();
  if (!name) return;
  await prisma.category.create({ data: { name, slug: slugify(name) } });
  revalidatePath("/admin/categorias");
  revalidateStorefront();
}

export async function deleteCategory(formData: FormData) {
  const id = String(formData.get("id"));
  // Una categoria con productos no se puede borrar sin dejarlos huerfanos:
  // Prisma tiraria un error de foreign key contra una pantalla en blanco.
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) return;
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categorias");
  revalidateStorefront();
}

// ---- Pedidos ----

export async function updateOrderStatus(formData: FormData) {
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as
    | "PENDIENTE_CONFIRMACION"
    | "NUEVO"
    | "EN_PROCESO"
    | "ENTREGADO";
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/pedidos");
  revalidatePath("/admin");
}

export async function confirmOrderPayment(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.order.update({ where: { id }, data: { status: "NUEVO" } });
  revalidatePath("/admin/pedidos");
  revalidatePath("/admin");
}

export async function deleteOrder(formData: FormData) {
  const id = String(formData.get("id"));
  const restock = formData.get("restock") === "true";

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id } });
    if (!order) return;

    // Al borrar un pedido las unidades vuelven al stock, salvo que se pida
    // lo contrario (ej: ya se entrego y solo se limpia la lista).
    if (restock) {
      const items = JSON.parse(order.itemsJson) as { productId: string; qty: number }[];
      for (const item of items) {
        await tx.product.updateMany({
          where: { id: item.productId },
          data: { stock: { increment: item.qty } },
        });
      }
    }

    await tx.order.delete({ where: { id } });
  });

  revalidatePath("/admin/pedidos");
  revalidateStorefront();
}

// ---- Envio y stock ----

export async function updateShippingConfig(formData: FormData) {
  const data = {
    freeShippingMinAmount: Number(formData.get("freeShippingMinAmount")),
    lowStockThreshold: Number(formData.get("lowStockThreshold")),
    costCaba: Number(formData.get("costCaba")),
    costZonaOeste: Number(formData.get("costZonaOeste")),
    costBuenosAires: Number(formData.get("costBuenosAires")),
    costOtrasProvincias: Number(formData.get("costOtrasProvincias")),
  };
  await prisma.shippingConfig.upsert({
    where: { id: "config" },
    update: data,
    create: { id: "config", ...data },
  });
  revalidatePath("/admin/envio");
  revalidatePath("/checkout");
  revalidateStorefront();
}

// ---- Textos de la landing ----

export async function updateSiteContent(formData: FormData) {
  const updates = CONTENT_FIELDS.map((field) => {
    const value = String(formData.get(field.key) ?? "").trim();
    return { key: field.key, value: value || field.default };
  });

  await prisma.$transaction(
    updates.map((u) =>
      prisma.siteContent.upsert({
        where: { key: u.key },
        update: { value: u.value },
        create: { key: u.key, value: u.value },
      })
    )
  );

  revalidatePath("/admin/textos");
  revalidateStorefront();
}

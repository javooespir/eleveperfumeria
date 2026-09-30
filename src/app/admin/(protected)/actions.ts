"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { clearAdminSession } from "@/lib/admin-auth";
import {
  CONTENT_FIELDS,
  QUIZ_PRODUCT_FIELDS,
  QUIZ_TEXT_FIELDS,
  type ContentField,
} from "@/lib/site-content";

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

export async function renameCategory(formData: FormData) {
  const id = String(formData.get("id"));
  const name = String(formData.get("name")).trim();
  if (!name) return;

  // El slug se regenera junto con el nombre para que el link del menu siga
  // coincidiendo con la categoria.
  await prisma.category.update({ where: { id }, data: { name, slug: slugify(name) } });
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

// ---- Integraciones ----

export async function updateIntegrations(formData: FormData) {
  // Solo digitos: el ID del pixel es numerico y la gente suele pegar la linea
  // entera del script de Meta.
  const raw = String(formData.get("metaPixelId") ?? "").replace(/\D/g, "");
  const metaPixelId = raw || null;

  await prisma.shippingConfig.upsert({
    where: { id: "config" },
    update: { metaPixelId },
    create: { id: "config", metaPixelId },
  });

  revalidatePath("/admin/integraciones");
  revalidateStorefront();
}

// ---- Textos de la landing ----

async function saveContentFields(fields: ContentField[], formData: FormData) {
  const updates = fields.map((field) => {
    const value = String(formData.get(field.key) ?? "").trim();
    // Campo vacio vuelve al texto original, salvo que el default sea vacio
    // (el producto del quiz, que puede quedar sin elegir a proposito).
    return { key: field.key, value: value || field.default };
  });

  // Un solo INSERT con ON CONFLICT en vez de un upsert por campo dentro de
  // una transaccion: con 29 campos eran 29 idas y vueltas contra el pooler de
  // Supabase, tardaba 6,6s y moria por el limite de 5s de la transaccion
  // ("A rollback cannot be executed on an expired transaction"), asi que el
  // quiz no se guardaba. Asi es una sola consulta y sigue siendo atomico.
  const values = Prisma.join(
    updates.map((u) => Prisma.sql`(${u.key}, ${u.value}, NOW())`)
  );

  await prisma.$executeRaw`
    INSERT INTO "SiteContent" ("key", "value", "updatedAt")
    VALUES ${values}
    ON CONFLICT ("key") DO UPDATE
      SET "value" = EXCLUDED."value", "updatedAt" = NOW()
  `;

  revalidateStorefront();
}

export async function updateSiteContent(formData: FormData) {
  await saveContentFields(CONTENT_FIELDS, formData);
  revalidatePath("/admin/textos");
}

export async function updateQuizContent(formData: FormData) {
  await saveContentFields([...QUIZ_TEXT_FIELDS, ...QUIZ_PRODUCT_FIELDS], formData);
  revalidatePath("/admin/quiz");
}

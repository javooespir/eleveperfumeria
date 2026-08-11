"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { clearAdminSession } from "@/lib/admin-auth";

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

// ---- Productos ----

export async function createProduct(formData: FormData) {
  const images = String(formData.get("images") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const wholesaleRaw = String(formData.get("wholesalePrice") ?? "").trim();
  const codeRaw = String(formData.get("productCode") ?? "").trim();

  await prisma.product.create({
    data: {
      productCode: codeRaw || null,
      name: String(formData.get("name")),
      brand: String(formData.get("brand")),
      description: String(formData.get("description")),
      price: Number(formData.get("price")),
      wholesalePrice: wholesaleRaw ? Number(wholesaleRaw) : null,
      stock: Number(formData.get("stock")),
      discountActive: formData.get("discountActive") === "on",
      discountPercent: Number(formData.get("discountPercent") ?? 0),
      isFeatured: formData.get("isFeatured") === "on",
      isTrending: formData.get("isTrending") === "on",
      images: JSON.stringify(images.length ? images : ["https://picsum.photos/seed/placeholder/800/1000"]),
      categoryId: String(formData.get("categoryId")),
    },
  });

  revalidatePath("/admin/productos");
  revalidatePath("/");
  redirect("/admin/productos");
}

export async function updateProduct(id: string, formData: FormData) {
  const images = String(formData.get("images") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const wholesaleRaw = String(formData.get("wholesalePrice") ?? "").trim();
  const codeRaw = String(formData.get("productCode") ?? "").trim();

  await prisma.product.update({
    where: { id },
    data: {
      productCode: codeRaw || null,
      name: String(formData.get("name")),
      brand: String(formData.get("brand")),
      description: String(formData.get("description")),
      price: Number(formData.get("price")),
      wholesalePrice: wholesaleRaw ? Number(wholesaleRaw) : null,
      stock: Number(formData.get("stock")),
      discountActive: formData.get("discountActive") === "on",
      discountPercent: Number(formData.get("discountPercent") ?? 0),
      isFeatured: formData.get("isFeatured") === "on",
      isTrending: formData.get("isTrending") === "on",
      images: JSON.stringify(images.length ? images : ["https://picsum.photos/seed/placeholder/800/1000"]),
      categoryId: String(formData.get("categoryId")),
    },
  });

  revalidatePath("/admin/productos");
  revalidatePath("/");
  redirect("/admin/productos");
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/productos");
  revalidatePath("/");
}

// ---- Categorias ----

export async function createCategory(formData: FormData) {
  const name = String(formData.get("name"));
  await prisma.category.create({ data: { name, slug: slugify(name) } });
  revalidatePath("/admin/categorias");
  revalidatePath("/");
}

export async function deleteCategory(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categorias");
  revalidatePath("/");
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
}

export async function confirmOrderPayment(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.order.update({ where: { id }, data: { status: "NUEVO" } });
  revalidatePath("/admin/pedidos");
}

// ---- Envio ----

export async function updateShippingConfig(formData: FormData) {
  const data = {
    freeShippingMinAmount: Number(formData.get("freeShippingMinAmount")),
    lowStockThreshold: Number(formData.get("lowStockThreshold")),
  };
  await prisma.shippingConfig.upsert({
    where: { id: "config" },
    update: data,
    create: { id: "config", ...data },
  });
  revalidatePath("/admin/envio");
  revalidatePath("/admin");
  revalidatePath("/checkout");
}

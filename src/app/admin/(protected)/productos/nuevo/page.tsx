import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "../../actions";

export default async function NuevoProductoPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-heading font-light mb-6">Nuevo producto</h1>
      <ProductForm categories={categories} action={createProduct} submitLabel="Crear producto" />
    </div>
  );
}

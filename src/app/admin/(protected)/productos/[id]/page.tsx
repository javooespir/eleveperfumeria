import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProduct } from "../../actions";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const action = updateProduct.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-heading font-light mb-6">Editar producto</h1>
      <ProductForm
        categories={categories}
        action={action}
        submitLabel="Guardar cambios"
        initial={{
          productCode: product.productCode ?? "",
          name: product.name,
          brand: product.brand,
          description: product.description,
          price: product.price,
          wholesalePrice: product.wholesalePrice ?? undefined,
          stock: product.stock,
          discountActive: product.discountActive,
          discountPercent: product.discountPercent,
          isFeatured: product.isFeatured,
          isTrending: product.isTrending,
          images: JSON.parse(product.images),
          categoryId: product.categoryId,
        }}
      />
    </div>
  );
}

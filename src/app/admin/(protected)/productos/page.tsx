import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { deleteProduct } from "../actions";

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

export default async function ProductosPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-light">Productos</h1>
          <p className="text-sm text-muted-foreground mt-1">{products.length} en el catálogo</p>
        </div>
        <Button asChild>
          <Link href="/admin/productos/nuevo">Nuevo producto</Link>
        </Button>
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-3 pl-4 pr-4"></th>
                <th className="py-3 pr-4">Código</th>
                <th className="py-3 pr-4">Nombre</th>
                <th className="py-3 pr-4">Categoría</th>
                <th className="py-3 pr-4">Minorista</th>
                <th className="py-3 pr-4">Mayorista</th>
                <th className="py-3 pr-4">Stock</th>
                <th className="py-3 pr-4">Landing</th>
                <th className="py-3 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const image = (JSON.parse(p.images) as string[])[0];
                return (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                    <td className="py-2.5 pl-4 pr-4">
                      <div className="relative size-10 overflow-hidden rounded-md bg-muted">
                        {image && (
                          <Image src={image} alt={p.name} fill sizes="40px" className="object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{p.productCode ?? "—"}</td>
                    <td className="py-2.5 pr-4">
                      <p className="leading-tight">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.brand}</p>
                    </td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{p.category.name}</td>
                    <td className="py-2.5 pr-4">
                      {p.discountActive ? (
                        <span className="flex flex-col leading-tight">
                          <span className="text-xs text-muted-foreground line-through">{money(p.price)}</span>
                          <span>{money(Math.round(p.price * (1 - p.discountPercent / 100)))}</span>
                        </span>
                      ) : (
                        money(p.price)
                      )}
                    </td>
                    <td className="py-2.5 pr-4 text-muted-foreground">
                      {p.wholesalePrice ? money(p.wholesalePrice) : "—"}
                    </td>
                    <td className="py-2.5 pr-4">{p.stock}</td>
                    <td className="py-2.5 pr-4">
                      <div className="flex gap-1">
                        {p.isFeatured && (
                          <Badge variant="outline" className="text-[10px]">
                            Sets
                          </Badge>
                        )}
                        {p.isTrending && (
                          <Badge variant="outline" className="text-[10px]">
                            Buscados
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 pr-4">
                      <div className="flex gap-3 justify-end">
                        <Link href={`/admin/productos/${p.id}`} className="text-xs underline text-muted-foreground hover:text-foreground">
                          Editar
                        </Link>
                        <form action={deleteProduct}>
                          <input type="hidden" name="id" value={p.id} />
                          <button type="submit" className="text-xs underline text-destructive">
                            Eliminar
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createCategory, deleteCategory } from "../actions";

export default async function CategoriasPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-heading font-light mb-1">Categorías</h1>
      <p className="text-sm text-muted-foreground mb-8">{categories.length} categorías activas</p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Nueva categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCategory} className="flex items-end gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" required />
            </div>
            <Button type="submit">Agregar</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-3 pl-4 pr-4">Nombre</th>
                <th className="py-3 pr-4">Productos</th>
                <th className="py-3 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                  <td className="py-2.5 pl-4 pr-4">{c.name}</td>
                  <td className="py-2.5 pr-4 text-muted-foreground">{c._count.products}</td>
                  <td className="py-2.5 pr-4">
                    <form action={deleteCategory} className="flex justify-end">
                      <input type="hidden" name="id" value={c.id} />
                      <button
                        type="submit"
                        disabled={c._count.products > 0}
                        className="text-xs underline text-destructive disabled:opacity-30 disabled:no-underline"
                      >
                        Eliminar
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

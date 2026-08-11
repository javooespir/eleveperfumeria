import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { Category } from "@/lib/types";

type ProductFormValues = {
  productCode: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  wholesalePrice: number;
  stock: number;
  discountActive: boolean;
  discountPercent: number;
  isFeatured: boolean;
  isTrending: boolean;
  isActive: boolean;
  images: string[];
  categoryId: string;
};

export function ProductForm({
  categories,
  action,
  initial,
  submitLabel = "Guardar",
}: {
  categories: Category[];
  action: (formData: FormData) => void | Promise<void>;
  initial?: Partial<ProductFormValues>;
  submitLabel?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-5 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Información general</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="productCode">Código de producto</Label>
              <Input id="productCode" name="productCode" defaultValue={initial?.productCode} placeholder="Ej: PAH-01" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="categoryId">Categoría</Label>
              <select
                id="categoryId"
                name="categoryId"
                defaultValue={initial?.categoryId}
                required
                className="border border-input bg-background rounded-md px-3 py-2 text-sm h-9"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" defaultValue={initial?.name} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="brand">Marca</Label>
              <Input id="brand" name="brand" defaultValue={initial?.brand} required />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" name="description" defaultValue={initial?.description} required />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Precio y stock</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="price">Precio minorista</Label>
              <Input id="price" name="price" type="number" min={0} defaultValue={initial?.price} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="wholesalePrice">Precio mayorista</Label>
              <Input
                id="wholesalePrice"
                name="wholesalePrice"
                type="number"
                min={0}
                defaultValue={initial?.wholesalePrice}
                placeholder="Igual al minorista"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" name="stock" type="number" min={0} defaultValue={initial?.stock ?? 0} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-end pt-1 border-t border-border">
            <div className="flex items-center gap-2 pt-4">
              <input
                id="discountActive"
                name="discountActive"
                type="checkbox"
                defaultChecked={initial?.discountActive}
                className="size-4"
              />
              <Label htmlFor="discountActive">Descuento activo</Label>
            </div>
            <div className="flex flex-col gap-1.5 pt-4">
              <Label htmlFor="discountPercent">% Descuento</Label>
              <Input
                id="discountPercent"
                name="discountPercent"
                type="number"
                min={0}
                max={90}
                defaultValue={initial?.discountPercent ?? 0}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visibilidad</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              defaultChecked={initial?.isActive ?? true}
              className="size-4"
            />
            <Label htmlFor="isActive">Visible en el catálogo (destildá para ocultarlo sin borrarlo)</Label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                id="isFeatured"
                name="isFeatured"
                type="checkbox"
                defaultChecked={initial?.isFeatured}
                className="size-4"
              />
              <Label htmlFor="isFeatured">Sets y novedades</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="isTrending"
                name="isTrending"
                type="checkbox"
                defaultChecked={initial?.isTrending}
                className="size-4"
              />
              <Label htmlFor="isTrending">Más buscados</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fotos</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploader name="images" initial={initial?.images} />
        </CardContent>
      </Card>

      <Button type="submit" className="w-fit">
        {submitLabel}
      </Button>
    </form>
  );
}

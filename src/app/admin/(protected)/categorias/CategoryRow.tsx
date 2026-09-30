"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { renameCategory, deleteCategory } from "../actions";

export function CategoryRow({
  id,
  name,
  productCount,
}: {
  id: string;
  name: string;
  productCount: number;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const [isPending, startTransition] = useTransition();

  function save() {
    const next = draft.trim();
    if (!next || next === name) {
      setEditing(false);
      setDraft(name);
      return;
    }
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", id);
      fd.set("name", next);
      await renameCategory(fd);
      setEditing(false);
    });
  }

  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/40">
      <td className="py-2.5 pl-4 pr-4">
        {editing ? (
          <Input
            value={draft}
            autoFocus
            disabled={isPending}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") {
                setDraft(name);
                setEditing(false);
              }
            }}
            className="h-9 max-w-56"
          />
        ) : (
          name
        )}
      </td>
      <td className="py-2.5 pr-4 text-muted-foreground">{productCount}</td>
      <td className="py-2.5 pr-4">
        <div className="flex justify-end items-center gap-3">
          {isPending && <Loader2 className="size-3.5 animate-spin text-muted-foreground" />}

          {editing ? (
            <>
              <button
                type="button"
                onClick={save}
                disabled={isPending}
                className="text-xs underline disabled:opacity-40"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraft(name);
                  setEditing(false);
                }}
                disabled={isPending}
                className="text-xs underline text-muted-foreground disabled:opacity-40"
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="text-xs underline text-muted-foreground hover:text-foreground"
              >
                Editar
              </button>
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={id} />
                <button
                  type="submit"
                  disabled={productCount > 0}
                  title={
                    productCount > 0
                      ? "Primero movés o borrás los productos de esta categoría"
                      : undefined
                  }
                  className="text-xs underline text-destructive disabled:opacity-30 disabled:no-underline"
                >
                  Eliminar
                </button>
              </form>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

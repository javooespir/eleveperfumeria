"use client";

import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

export function CategoryChips({
  categories,
  active,
  onSelect,
}: {
  categories: Category[];
  active: string | null;
  onSelect: (slug: string | null) => void;
}) {
  const chips = [{ id: "all", name: "Todo", slug: null as string | null }, ...categories];

  return (
    <div className="flex gap-2 overflow-x-auto px-4 sm:px-6 py-4 scrollbar-hide">
      {chips.map((c) => {
        const isActive = active === c.slug;
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.slug)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-xs tracking-wide whitespace-nowrap transition-colors",
              isActive
                ? "bg-foreground text-background border-foreground"
                : "border-border text-foreground hover:border-foreground"
            )}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}

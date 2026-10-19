"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { cn } from "@/lib/utils";
import { ProductDTO, SortOption } from "@/types";

interface ProductGridProps {
  products: ProductDTO[];
  isAuthenticated: boolean;
}

type CategoryFilter = "ALL" | "MOUSE" | "KEYBOARD";
type ConnectionFilter = "ALL" | "WIRED" | "WIRELESS";

export function ProductGrid({ products, isAuthenticated }: ProductGridProps) {
  const [category, setCategory] = useState<CategoryFilter>("ALL");
  const [connection, setConnection] = useState<ConnectionFilter>("ALL");
  const [sort, setSort] = useState<SortOption>("featured");

  const filtered = useMemo(() => {
    let result = [...products];

    if (category !== "ALL") {
      result = result.filter((p) => p.category === category);
    }
    if (connection !== "ALL") {
      result = result.filter((p) => p.connectionType === connection || p.connectionType === "BOTH");
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        // Products are already fetched newest-first; no-op keeps order stable.
        break;
      default:
        // "featured": price drops first
        result.sort((a, b) => Number(b.priceDrop?.isDrop) - Number(a.priceDrop?.isDrop));
    }

    return result;
  }, [products, category, connection, sort]);

  return (
    <section id="catalog" className="container py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          {filtered.length} peripherals
        </div>

        <div className="flex flex-wrap gap-3">
          <FilterPill<CategoryFilter>
            value={category}
            onChange={setCategory}
            options={[
              { value: "ALL", label: "All" },
              { value: "MOUSE", label: "Mice" },
              { value: "KEYBOARD", label: "Keyboards" },
            ]}
          />
          <FilterPill<ConnectionFilter>
            value={connection}
            onChange={setConnection}
            options={[
              { value: "ALL", label: "Any Connection" },
              { value: "WIRED", label: "Wired" },
              { value: "WIRELESS", label: "Wireless" },
            ]}
          />

          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-20 text-center text-muted-foreground">
          No peripherals match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} isAuthenticated={isAuthenticated} />
          ))}
        </div>
      )}
    </section>
  );
}

function FilterPill<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex rounded-md border border-border bg-card p-1">
      {options.map((opt) => (
        <Button
          key={opt.value}
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onChange(opt.value)}
          className={cn(
            "h-7 px-3 text-xs",
            value === opt.value && "bg-primary text-primary-foreground hover:bg-primary"
          )}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}

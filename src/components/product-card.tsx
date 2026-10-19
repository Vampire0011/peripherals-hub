"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Heart, ExternalLink, Cable, Wifi, TrendingDown } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { toggleWishlist } from "@/lib/actions/products";
import { ProductDTO } from "@/types";

interface ProductCardProps {
  product: ProductDTO;
  isAuthenticated: boolean;
}

export function ProductCard({ product, isAuthenticated }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(!!product.isWishlisted);
  const [isPending, startTransition] = useTransition();

  const finalUrl = `/go/${product.id}`; // server redirect applies the affiliate tag

  function handleHeartClick() {
    if (!isAuthenticated) {
      window.location.href = "/login?callbackUrl=/";
      return;
    }
    setIsWishlisted((prev) => !prev); // optimistic
    startTransition(async () => {
      try {
        await toggleWishlist(product.id);
      } catch {
        setIsWishlisted((prev) => !prev); // revert on failure
      }
    });
  }

  return (
    <Card className="group overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 animate-fade-up">
      <div className="relative aspect-square bg-white/5">
        <a href={finalUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${product.title}`}>
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
          />
        </a>

        <button
          onClick={handleHeartClick}
          disabled={isPending}
          aria-label="Toggle favorite"
          className={cn(
            "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/70 backdrop-blur transition-colors hover:border-destructive",
            isWishlisted && "border-destructive bg-destructive/10"
          )}
        >
          <Heart className={cn("h-4 w-4 transition-colors", isWishlisted ? "fill-destructive text-destructive" : "text-foreground")} />
        </button>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          <Badge variant={product.category === "MOUSE" ? "accent" : "default"}>{product.category}</Badge>
          {product.priceDrop?.isDrop && (
            <Badge variant="success" className="flex items-center gap-1">
              <TrendingDown className="h-3 w-3" />
              {product.priceDrop.dropPercent}% Price Drop
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="pt-4">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug">{product.title}</h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">{formatPrice(product.price, product.currency)}</span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.oldPrice, product.currency)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {product.connectionType === "WIRED" ? <Cable className="h-3.5 w-3.5" /> : <Wifi className="h-3.5 w-3.5" />}
            {product.connectionType}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <a href={finalUrl} target="_blank" rel="noopener noreferrer" className="w-full">
          <Button className="w-full">
            Buy Now <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}

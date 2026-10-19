import { auth } from "@/auth";
import { getUserWishlist } from "@/lib/actions/products";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import { Heart } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const wishlist = await getUserWishlist();

  return (
    <div className="container py-10">
      <div className="mb-10 flex flex-col items-start gap-6 rounded-lg border border-border bg-card p-6 sm:flex-row sm:items-center">
        <Avatar className="h-16 w-16">
          <AvatarImage src={session?.user?.image ?? undefined} alt={session?.user?.name ?? "User"} />
          <AvatarFallback className="text-lg">{session?.user?.name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{session?.user?.name}</h1>
            {session?.user?.role === "ADMIN" && <Badge>Admin</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <Heart className="h-5 w-5 text-destructive" />
        <h2 className="text-lg font-semibold">Saved Gear ({wishlist.length})</h2>
      </div>

      {wishlist.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-20 text-center text-muted-foreground">
          No saved items yet. Tap the heart icon on any product to save it here.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} isAuthenticated={true} />
          ))}
        </div>
      )}
    </div>
  );
}

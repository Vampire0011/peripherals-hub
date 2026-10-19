import { Hero } from "@/components/hero";
import { ProductGrid } from "@/components/product-grid";
import { getProducts } from "@/lib/actions/products";
import { auth } from "@/auth";

export default async function HomePage() {
  const [products, session] = await Promise.all([getProducts(), auth()]);

  return (
    <>
      <Hero />
      <ProductGrid products={products} isAuthenticated={!!session?.user} />
    </>
  );
}

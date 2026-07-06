import { getAllProducts } from "@/lib/printful";
import { ProductCard, SiteFooter } from "@/components/commerce";
import { ShopTabs } from "@/components/shop-tabs";

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <>
      <section className="container-x pb-24 pt-28 md:pt-36">
        <div className="mb-14 md:mb-20">
          <p className="eyebrow mb-4">The Collection</p>
          <h1 className="font-display text-6xl font-bold tracking-tightest md:text-8xl">
            Shop All
          </h1>
          <p className="mt-6 max-w-md leading-relaxed text-boneDim">
            {products.length} {products.length === 1 ? "piece" : "pieces"}. Made to order, built to last.
          </p>
        </div>

        <ShopTabs products={products} active="all" />

        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 md:gap-y-16">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      <SiteFooter />
    </>
  );
}

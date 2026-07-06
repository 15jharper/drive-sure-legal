import { notFound } from "next/navigation";
import { getAllProducts } from "@/lib/printful";
import { ProductCard, SiteFooter } from "@/components/commerce";
import { ShopTabs } from "@/components/shop-tabs";

export default async function ShopCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  if (params.category !== "men" && params.category !== "women") {
    notFound();
  }

  const products = await getAllProducts();
  const filtered = products.filter((product) => product.category === params.category);

  return (
    <>
      <section className="container-x pb-24 pt-28 md:pt-36">
        <div className="mb-14 md:mb-20">
          <p className="eyebrow mb-4">The Collection</p>
          <h1 className="font-display text-6xl font-bold tracking-tightest md:text-8xl">
            Shop {params.category === "men" ? "Men" : "Women"}
          </h1>
          <p className="mt-6 max-w-md leading-relaxed text-boneDim">
            {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}. Made to order, built to last.
          </p>
        </div>

        <ShopTabs products={products} active={params.category} />

        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 md:gap-y-16">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      <SiteFooter />
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductByHandle } from "@/lib/printful";
import { ProductPurchase, SiteFooter } from "@/components/commerce";
import { formatMoney } from "@/lib/money";

export async function generateStaticParams() {
  return [{ handle: "6a473aa4e2f7d6" }];
}

export default async function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  const product = await getProductByHandle(params.handle);
  if (!product) notFound();

  return (
    <>
      <section className="container-x pb-24 pt-28 md:pt-36">
        <Link
          href="/shop"
          className="mb-8 inline-block text-sm uppercase tracking-[0.2em] text-boneDim hover:text-bone"
        >
          ← Back
        </Link>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {product.images.map((image, index) => (
              <div
                key={image.url}
                className={`relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-[#f4f1ea] to-[#e3ddd0] ${
                  index === 0 ? "sm:col-span-2 sm:aspect-[16/10]" : ""
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.altText ?? product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-6 md:p-10"
                />
              </div>
            ))}
          </div>
          <div>
            <p className="eyebrow">{product.subtitle}</p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tightest md:text-6xl">
              {product.title}
            </h1>
            <p className="mt-6 text-2xl text-bone">{formatMoney(product.price)}</p>
            <p className="mt-6 max-w-md leading-relaxed text-boneDim">
              {product.description}
            </p>
            <div className="mt-10">
              <ProductPurchase product={product} />
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}

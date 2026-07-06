import Link from "next/link";
import Image from "next/image";
import { getFeaturedProduct } from "@/lib/printful";
import { ProductPurchase, SiteFooter } from "@/components/commerce";
import { siteConfig } from "@/lib/config";
import { formatMoney } from "@/lib/money";

export default async function HomePage() {
  const featured = await getFeaturedProduct();

  return (
    <>
      <section className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=1600&q=70"
          alt=""
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-base/40 via-base/30 to-base" />
        <div className="container-x relative z-10 flex flex-col items-center text-center">
          <h1 className="font-display text-[18vw] font-extrabold leading-[0.85] tracking-tightest md:text-[13vw] lg:text-[11vw]">
            NOBODY
          </h1>
          <h1 className="font-display text-[18vw] font-extrabold leading-[0.85] tracking-tightest md:text-[13vw] lg:text-[11vw]">
            KNOWS.
          </h1>
          <p className="mt-8 max-w-xl text-base text-bone md:text-lg">
            {siteConfig.tagline}
          </p>
          <p className="mt-3 max-w-md text-sm text-boneDim">
            A brand for those building something bigger than themselves.
          </p>
          <div className="mt-10">
            <Link href="/shop" className="btn-primary">
              Shop The Collection
            </Link>
          </div>
        </div>
      </section>

      <section id="story" className="border-t border-line/40 py-32 md:py-48">
        <div className="container-x mx-auto max-w-4xl">
          <p className="eyebrow mb-14">Why Nobody Knows</p>
          <div className="flex flex-col gap-6 md:gap-8">
            {[
              "Nobody knows how a relationship will turn out.",
              "Nobody knows if the business will work.",
              "Nobody knows what's waiting around the next corner.",
              "Nobody knows how much time they have.",
              "Nobody knows what tomorrow brings.",
            ].map((line) => (
              <p
                key={line}
                className="text-2xl leading-snug tracking-tightest text-bone md:text-4xl md:leading-[1.15]"
              >
                {line}
              </p>
            ))}
          </div>
          <div className="mt-16 space-y-6 border-t border-line/40 pt-12 text-lg leading-relaxed text-boneDim md:text-xl">
            <p>
              And as scary as that can be — it&apos;s also what makes life worth living.
              If we knew exactly how everything would end, there&apos;d be no adventure.
              No faith. No hope. No surprises.
            </p>
            <p className="font-display text-3xl font-semibold leading-tight tracking-tightest text-bone md:text-5xl">
              Nobody Knows isn&apos;t about uncertainty.
              <br />
              It&apos;s about possibility.
            </p>
          </div>
        </div>
      </section>

      {featured ? (
        <section id="shop" className="border-t border-line/40 py-24 md:py-40">
          <div className="container-x">
            <div className="mb-16 flex items-end justify-between">
              <div>
                <p className="eyebrow mb-4">Featured</p>
                <h2 className="font-display text-5xl font-bold tracking-tightest md:text-7xl">
                  The Signature
                </h2>
              </div>
              <Link
                href={`/product/${featured.handle}`}
                className="link-underline hidden text-[11px] uppercase tracking-[0.2em] text-boneDim hover:text-bone md:block"
              >
                View Full Details
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {featured.images.slice(0, 4).map((image, index) => (
                  <div
                    key={image.url}
                    className={`relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-[#f4f1ea] to-[#e3ddd0] ${
                      index === 0 ? "sm:col-span-2 sm:aspect-[16/10]" : ""
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText ?? featured.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain p-6 md:p-10"
                    />
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-display text-4xl font-bold tracking-tightest md:text-5xl">
                  {featured.title}
                </h3>
                <p className="mt-2 text-sm uppercase tracking-[0.2em] text-boneDim">
                  {featured.subtitle}
                </p>
                <p className="mt-6 text-2xl text-bone">
                  {formatMoney(featured.price)}
                </p>
                <p className="mt-6 max-w-md leading-relaxed text-boneDim">
                  {featured.description}
                </p>
                <div className="mt-10">
                  <ProductPurchase product={featured} />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <SiteFooter />
    </>
  );
}

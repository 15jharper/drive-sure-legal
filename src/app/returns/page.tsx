import { SiteFooter } from "@/components/commerce";

export default function ReturnsPage() {
  return (
    <>
      <section className="container-x pb-24 pt-28 md:pt-36">
        <p className="eyebrow mb-4">Policy</p>
        <h1 className="font-display text-5xl font-bold tracking-tightest md:text-6xl">
          Shipping & Returns
        </h1>
        <div className="prose-invert mt-10 max-w-3xl space-y-6 text-boneDim">
          <p>
            Orders are made to order through our fulfillment partner. Production
            typically begins shortly after checkout and ships once quality review
            is complete.
          </p>
          <p>
            Because items are produced on demand, returns are accepted only for
            defects or fulfillment errors. Contact us within 14 days of delivery
            with your order details and photos.
          </p>
          <p>
            Questions? Email{" "}
            <a href="mailto:jordanharper412@icloud.com" className="text-bone underline">
              jordanharper412@icloud.com
            </a>
            .
          </p>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}

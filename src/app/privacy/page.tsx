import { SiteFooter } from "@/components/commerce";

export default function PrivacyPage() {
  return (
    <>
      <section className="container-x pb-24 pt-28 md:pt-36">
        <p className="eyebrow mb-4">Legal</p>
        <h1 className="font-display text-5xl font-bold tracking-tightest md:text-6xl">
          Privacy Policy
        </h1>
        <div className="mt-10 max-w-3xl space-y-6 text-boneDim">
          <p>
            Nobody Knows collects the information needed to fulfill orders,
            provide support, and improve the shopping experience. We do not sell
            your personal information.
          </p>
          <p>
            Order fulfillment is handled by Printful. Payment processing is
            handled by Stripe. Analytics may be collected through Vercel to
            understand site performance.
          </p>
          <p>
            Contact{" "}
            <a href="mailto:jordanharper412@icloud.com" className="text-bone underline">
              jordanharper412@icloud.com
            </a>{" "}
            for privacy requests.
          </p>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}

import { SiteFooter } from "@/components/commerce";

export default function TermsPage() {
  return (
    <>
      <section className="container-x pb-24 pt-28 md:pt-36">
        <p className="eyebrow mb-4">Legal</p>
        <h1 className="font-display text-5xl font-bold tracking-tightest md:text-6xl">
          Terms of Service
        </h1>
        <div className="mt-10 max-w-3xl space-y-6 text-boneDim">
          <p>
            By purchasing from Nobody Knows, you agree to these terms. Products
            are made to order and ship after production. Prices, availability,
            and shipping estimates may change.
          </p>
          <p>
            All sales are subject to our shipping and returns policy. Nothing on
            this site constitutes professional advice of any kind.
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

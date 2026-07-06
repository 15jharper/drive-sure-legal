import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="eyebrow">Order received</p>
      <h1 className="font-display text-4xl font-bold tracking-tightest md:text-6xl">
        Thank you.
      </h1>
      <p className="max-w-md text-boneDim">
        Your order is in. The work continues long before the recognition.
      </p>
      <Link href="/shop" className="btn-ghost mt-4">
        Back to Shop
      </Link>
    </div>
  );
}

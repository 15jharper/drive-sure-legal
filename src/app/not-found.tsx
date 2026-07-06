import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-[100svh] flex-col items-center justify-center gap-6 bg-base text-center">
      <p className="eyebrow">404</p>
      <h1 className="font-display text-6xl font-bold tracking-tightest md:text-8xl">
        Nobody knows
        <br />
        this page.
      </h1>
      <Link href="/" className="btn-ghost mt-4">
        Back Home
      </Link>
    </div>
  );
}

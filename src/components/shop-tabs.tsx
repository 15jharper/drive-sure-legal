import Link from "next/link";
import type { Product } from "@/lib/types";

export function ShopTabs({
  products,
  active,
}: {
  products: Product[];
  active: "all" | "men" | "women";
}) {
  const tabs = [
    { href: "/shop", label: "All", count: products.length, key: "all" as const },
    {
      href: "/shop/men",
      label: "Men",
      count: products.filter((product) => product.category === "men").length,
      key: "men" as const,
    },
    {
      href: "/shop/women",
      label: "Women",
      count: products.filter((product) => product.category === "women").length,
      key: "women" as const,
    },
  ];

  return (
    <div className="mb-10 flex items-center gap-8 border-b border-line/60 pb-4">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`relative pb-1 text-[12px] uppercase tracking-[0.2em] transition-colors ${
            active === tab.key ? "text-bone" : "text-boneDim hover:text-bone"
          }`}
        >
          {tab.label}
          <span className="ml-1 text-[9px] text-boneDim/70">{tab.count}</span>
          {active === tab.key ? (
            <span className="absolute -bottom-[17px] left-0 h-px w-full bg-bone" />
          ) : null}
        </Link>
      ))}
    </div>
  );
}

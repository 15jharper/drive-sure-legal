"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/cart";

const links = [
  { href: "/shop/men", label: "Men" },
  { href: "/shop/women", label: "Women" },
  { href: "/#story", label: "Story" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${
        scrolled ? "border-line/60 bg-base/90 backdrop-blur-md" : "border-transparent"
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between md:h-20">
        <Link
          href="/"
          className="font-display text-[13px] font-semibold uppercase tracking-[0.25em] text-bone"
        >
          Nobody Knows
        </Link>
        <div className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline text-[11px] uppercase tracking-[0.2em] text-boneDim transition-colors hover:text-bone"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <button
          type="button"
          onClick={openCart}
          className="text-[11px] uppercase tracking-[0.2em] text-bone transition-opacity hover:opacity-70"
          aria-label="Open cart"
        >
          Cart ({count})
        </button>
      </nav>
    </header>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { useCart, toProductImage } from "@/context/cart";
import { formatMoney } from "@/lib/money";

export function ProductPurchase({
  product,
  showQuantity = true,
}: {
  product: Product;
  showQuantity?: boolean;
}) {
  const { addLine } = useCart();
  const option = product.options[0];
  const [selectedValue, setSelectedValue] = useState(option?.values[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedVariant = useMemo(() => {
    return (
      product.variants.find((variant) =>
        variant.selectedOptions.every(
          (opt) => opt.name !== option?.name || opt.value === selectedValue,
        ),
      ) ?? product.variants[0]
    );
  }, [product.variants, option?.name, selectedValue]);

  const soldOut = !selectedVariant?.availableForSale;

  return (
    <div className="flex flex-col gap-8">
      {option ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="eyebrow">{option.name}</span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-bone">
              {selectedValue}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {option.values.map((value) => {
              const variant = product.variants.find((item) =>
                item.selectedOptions.some(
                  (opt) => opt.name === option.name && opt.value === value,
                ),
              );
              const unavailable = !variant?.availableForSale;
              const active = value === selectedValue;
              return (
                <button
                  key={value}
                  type="button"
                  disabled={unavailable}
                  onClick={() => setSelectedValue(value)}
                  className={`relative flex h-12 min-w-[3.5rem] items-center justify-center border px-4 text-[11px] uppercase tracking-[0.15em] transition-all duration-300 ${
                    active
                      ? "border-bone text-bone"
                      : "border-line text-boneDim hover:border-boneDim"
                  } ${unavailable ? "cursor-not-allowed opacity-30" : ""}`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {showQuantity ? (
        <div>
          <span className="eyebrow mb-4 block">Quantity</span>
          <div className="inline-flex items-center border border-line">
            <button
              type="button"
              className="px-4 py-3 text-boneDim hover:text-bone"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            >
              −
            </button>
            <span className="w-12 text-center text-sm text-bone">{quantity}</span>
            <button
              type="button"
              className="px-4 py-3 text-boneDim hover:text-bone"
              onClick={() => setQuantity((value) => value + 1)}
            >
              +
            </button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        disabled={soldOut}
        className="btn-primary flex-1"
        onClick={() => {
          if (!selectedVariant || soldOut) return;
          addLine({
            variantId: selectedVariant.id,
            productHandle: product.handle,
            title: product.title,
            variantTitle: selectedVariant.title,
            image: toProductImage(
              selectedVariant.image ?? product.featuredImage,
              product.title,
            ),
            price: selectedVariant.price,
            quantity,
          });
          setAdded(true);
          window.setTimeout(() => setAdded(false), 2000);
        }}
      >
        {soldOut
          ? "Sold Out"
          : added
            ? "Added ✓"
            : `Add — ${formatMoney(selectedVariant.price)}`}
      </button>
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.handle}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-[#f4f1ea] to-[#e3ddd0]">
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText ?? product.title}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-contain p-5 transition-transform duration-[900ms] ease-cinematic group-hover:scale-[1.05] md:p-8"
        />
      </div>
      <div className="mt-5 flex items-baseline justify-between">
        <h3 className="text-sm tracking-tight text-bone transition-opacity group-hover:opacity-70">
          {product.title}
        </h3>
        <span className="text-sm text-boneDim">
          {formatMoney(product.price)}
        </span>
      </div>
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer id="contact" className="relative border-t border-line/40 pb-10 pt-20 md:pt-28">
      <div className="container-x">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-2xl font-bold tracking-tightest">
              Nobody Knows
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-boneDim">
              Not about uncertainty. About possibility.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-5">Shop</p>
            <ul className="flex flex-col gap-3 text-sm text-boneDim">
              <li><Link href="/shop" className="link-underline hover:text-bone">Shop All</Link></li>
              <li><Link href="/shop/men" className="link-underline hover:text-bone">Men</Link></li>
              <li><Link href="/shop/women" className="link-underline hover:text-bone">Women</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-5">Info</p>
            <ul className="flex flex-col gap-3 text-sm text-boneDim">
              <li><Link href="/#story" className="link-underline hover:text-bone">Our Story</Link></li>
              <li><a href="mailto:jordanharper412@icloud.com" className="link-underline hover:text-bone">Contact</a></li>
              <li><Link href="/returns" className="link-underline hover:text-bone">Shipping & Returns</Link></li>
              <li><Link href="/privacy" className="link-underline hover:text-bone">Privacy</Link></li>
              <li><Link href="/terms" className="link-underline hover:text-bone">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-line/40 pt-8 md:flex-row md:items-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-boneDim">
            © {new Date().getFullYear()} Nobody Knows. All rights reserved.
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-boneDim">
            The work happens long before the recognition.
          </p>
        </div>
      </div>
    </footer>
  );
}

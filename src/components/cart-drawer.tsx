"use client";

import Link from "next/link";
import { useCart } from "@/context/cart";
import { siteConfig } from "@/lib/config";
import { formatMoney } from "@/lib/money";

export function CartDrawer() {
  const {
    lines,
    subtotal,
    isOpen,
    closeCart,
    removeLine,
    updateQuantity,
  } = useCart();

  if (!isOpen) return null;

  const remaining = Math.max(0, siteConfig.freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label="Close cart overlay"
        className="absolute inset-0 bg-black/60"
        onClick={closeCart}
      />
      <aside className="fixed right-0 top-0 z-[90] flex h-full w-full max-w-md flex-col border-l border-line bg-base">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <p className="font-display text-lg font-semibold tracking-tightest">
            Cart
          </p>
          <button
            type="button"
            onClick={closeCart}
            className="text-sm uppercase tracking-[0.2em] text-boneDim hover:text-bone"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {!lines.length ? (
            <p className="text-boneDim">Your cart is empty.</p>
          ) : (
            <div className="space-y-6">
              {lines.map((line) => (
                <div key={line.variantId} className="border-b border-line/60 pb-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-bone">{line.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.15em] text-boneDim">
                        {line.variantTitle}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLine(line.variantId)}
                      className="text-xs uppercase tracking-[0.15em] text-boneDim hover:text-bone"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="inline-flex items-center border border-line">
                      <button
                        type="button"
                        className="px-3 py-2 text-boneDim hover:text-bone"
                        onClick={() =>
                          updateQuantity(line.variantId, line.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm">{line.quantity}</span>
                      <button
                        type="button"
                        className="px-3 py-2 text-boneDim hover:text-bone"
                        onClick={() =>
                          updateQuantity(line.variantId, line.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-bone">
                      {formatMoney({
                        amount: String(Number(line.price.amount) * line.quantity),
                        currencyCode: line.price.currencyCode,
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-line px-6 py-6">
          {remaining > 0 ? (
            <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-boneDim">
              {formatMoney({ amount: String(remaining), currencyCode: "USD" })} away from free shipping
            </p>
          ) : null}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm uppercase tracking-[0.15em] text-boneDim">
              Subtotal
            </span>
            <span className="text-sm text-bone">
              {formatMoney({ amount: String(subtotal), currencyCode: "USD" })}
            </span>
          </div>
          <Link
            href="/checkout"
            onClick={closeCart}
            className="btn-primary w-full text-center"
          >
            Checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}

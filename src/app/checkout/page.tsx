"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useCart } from "@/context/cart";
import { siteConfig } from "@/lib/config";
import { formatMoney } from "@/lib/money";
import type { Recipient, ShippingRate } from "@/lib/types";

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const [recipient, setRecipient] = useState<Recipient>({
    name: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state_code: "",
    zip: "",
    country_code: "US",
  });
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = useMemo(
    () => subtotal + (selectedRate?.amount ?? 0),
    [subtotal, selectedRate],
  );

  if (!lines.length) {
    return (
      <div className="flex min-h-[100svh] flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tightest md:text-6xl">
          Your cart is empty.
        </h1>
        <Link href="/shop" className="btn-ghost">
          Shop the Collection
        </Link>
      </div>
    );
  }

  async function calculateShipping(event: FormEvent) {
    event.preventDefault();
    setLoadingRates(true);
    setError(null);
    setRates([]);
    setSelectedRate(null);

    try {
      const response = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines, recipient }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not fetch rates.");
      setRates(data.rates);
      setSelectedRate(data.rates[0] ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not fetch rates.");
    } finally {
      setLoadingRates(false);
    }
  }

  async function payWithCard() {
    if (!selectedRate) return;
    setPaying(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines,
          recipient,
          shipping: {
            name: selectedRate.name,
            amount: selectedRate.amount,
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Checkout failed.");
      if (data.url === "#checkout-mock") {
        setError("Demo mode — add your Stripe keys to enable live payment.");
        return;
      }
      clear();
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
    } finally {
      setPaying(false);
    }
  }

  return (
    <section className="container-x pb-24 pt-28 md:pt-36">
      <Link
        href="/shop"
        className="mb-8 inline-block text-sm uppercase tracking-[0.2em] text-boneDim hover:text-bone"
      >
        ← Continue Shopping
      </Link>
      <h1 className="font-display text-4xl font-bold tracking-tightest md:text-5xl">
        Checkout
      </h1>

      <div className="mt-12 grid grid-cols-1 gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={calculateShipping} className="space-y-5">
          <p className="eyebrow">Shipping Address</p>
          <input
            required
            placeholder="Full name"
            value={recipient.name}
            onChange={(event) =>
              setRecipient({ ...recipient, name: event.target.value })
            }
            className="w-full border-b border-line bg-transparent py-3 text-sm text-bone placeholder:text-boneDim/60 focus:border-bone focus:outline-none"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={recipient.email}
            onChange={(event) =>
              setRecipient({ ...recipient, email: event.target.value })
            }
            className="w-full border-b border-line bg-transparent py-3 text-sm text-bone placeholder:text-boneDim/60 focus:border-bone focus:outline-none"
          />
          <input
            required
            placeholder="Address"
            value={recipient.address1}
            onChange={(event) =>
              setRecipient({ ...recipient, address1: event.target.value })
            }
            className="w-full border-b border-line bg-transparent py-3 text-sm text-bone placeholder:text-boneDim/60 focus:border-bone focus:outline-none"
          />
          <input
            placeholder="Apartment, suite, etc. (optional)"
            value={recipient.address2}
            onChange={(event) =>
              setRecipient({ ...recipient, address2: event.target.value })
            }
            className="w-full border-b border-line bg-transparent py-3 text-sm text-bone placeholder:text-boneDim/60 focus:border-bone focus:outline-none"
          />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <input
              required
              placeholder="City"
              value={recipient.city}
              onChange={(event) =>
                setRecipient({ ...recipient, city: event.target.value })
              }
              className="w-full border-b border-line bg-transparent py-3 text-sm text-bone placeholder:text-boneDim/60 focus:border-bone focus:outline-none"
            />
            <input
              required
              placeholder="State / Province code"
              value={recipient.state_code}
              onChange={(event) =>
                setRecipient({ ...recipient, state_code: event.target.value })
              }
              className="w-full border-b border-line bg-transparent py-3 text-sm text-bone placeholder:text-boneDim/60 focus:border-bone focus:outline-none"
            />
            <input
              required
              placeholder="ZIP / Postal"
              value={recipient.zip}
              onChange={(event) =>
                setRecipient({ ...recipient, zip: event.target.value })
              }
              className="w-full border-b border-line bg-transparent py-3 text-sm text-bone placeholder:text-boneDim/60 focus:border-bone focus:outline-none"
            />
          </div>
          <select
            value={recipient.country_code}
            onChange={(event) =>
              setRecipient({ ...recipient, country_code: event.target.value })
            }
            className="w-full border border-line bg-base px-4 py-3 text-sm text-bone"
          >
            {siteConfig.countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.label}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-ghost" disabled={loadingRates}>
            {loadingRates ? "Calculating..." : "Calculate Shipping"}
          </button>

          {rates.length ? (
            <div className="space-y-4 border-t border-line/60 pt-8">
              <p className="eyebrow">Shipping Method</p>
              {rates.map((rate) => (
                <label
                  key={rate.id}
                  className="flex cursor-pointer items-center justify-between border border-line p-4"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping-rate"
                      checked={selectedRate?.id === rate.id}
                      onChange={() => setSelectedRate(rate)}
                    />
                    <div>
                      <p className="text-sm text-bone">{rate.name}</p>
                      <p className="text-xs text-boneDim">
                        {rate.minDays}–{rate.maxDays} business days
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-bone">
                    {formatMoney({
                      amount: String(rate.amount),
                      currencyCode: rate.currency,
                    })}
                  </span>
                </label>
              ))}
            </div>
          ) : null}
        </form>

        <div className="border border-line p-6 md:p-8">
          <p className="eyebrow mb-6">Order Summary</p>
          <div className="space-y-4">
            {lines.map((line) => (
              <div key={line.variantId} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-bone">{line.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.15em] text-boneDim">
                    {line.variantTitle} · Qty {line.quantity}
                  </p>
                </div>
                <span className="text-sm text-bone">
                  {formatMoney({
                    amount: String(Number(line.price.amount) * line.quantity),
                    currencyCode: line.price.currencyCode,
                  })}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-3 border-t border-line pt-6 text-sm">
            <div className="flex justify-between text-boneDim">
              <span>Subtotal</span>
              <span>{formatMoney({ amount: String(subtotal), currencyCode: "USD" })}</span>
            </div>
            <div className="flex justify-between text-boneDim">
              <span>Shipping</span>
              <span>
                {selectedRate
                  ? formatMoney({
                      amount: String(selectedRate.amount),
                      currencyCode: selectedRate.currency,
                    })
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between border-t border-line pt-4 text-xl text-bone">
              <span>Total</span>
              <span>{formatMoney({ amount: String(total), currencyCode: "USD" })}</span>
            </div>
          </div>
          <button
            type="button"
            className="btn-primary mt-8 w-full"
            disabled={!selectedRate || paying}
            onClick={payWithCard}
          >
            {paying ? "Redirecting..." : "Pay With Card"}
          </button>
          <p className="mt-3 text-center text-[10px] uppercase tracking-[0.2em] text-boneDim">
            Secure payment via Stripe
          </p>
          {error ? <p className="mt-4 text-center text-sm text-red-300">{error}</p> : null}
        </div>
      </div>
    </section>
  );
}

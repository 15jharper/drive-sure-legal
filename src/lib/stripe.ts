import Stripe from "stripe";
import type { CartLine, Recipient } from "@/lib/types";
import { normalizeMoney, sumMoney } from "@/lib/money";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2026-06-24.dahlia" });
}

export function normalizeCartLines(lines: CartLine[]): CartLine[] {
  return lines.map((line) => ({
    ...line,
    price: normalizeMoney(line.price),
    quantity: Math.max(1, Number(line.quantity) || 1),
  }));
}

export async function createCheckoutSession(args: {
  lines: CartLine[];
  recipient: Recipient;
  shipping: { name: string; amount: number | string };
}) {
  const stripe = getStripe();
  const normalized = normalizeCartLines(args.lines);
  const subtotal = sumMoney(normalized);
  const shippingAmount = Number(args.shipping.amount);

  if (!stripe) {
    return { url: "#checkout-mock" };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: args.recipient.email,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://wearnobodyknows.com"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://wearnobodyknows.com"}/checkout`,
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "GB", "AU", "NZ", "IE", "DE", "FR", "ES", "IT", "NL", "SE"],
    },
    line_items: normalized.map((line) => ({
      quantity: line.quantity,
      price_data: {
        currency: line.price.currencyCode.toLowerCase(),
        unit_amount: Math.round(Number(line.price.amount) * 100),
        product_data: {
          name: line.title,
          description: line.variantTitle,
          images: line.image?.url ? [line.image.url] : undefined,
        },
      },
    })),
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: Math.round(shippingAmount * 100),
            currency: "usd",
          },
          display_name: args.shipping.name,
        },
      },
    ],
    metadata: {
      variant_ids: normalized.map((line) => line.variantId).join(","),
      subtotal: subtotal.toFixed(2),
    },
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  return { url: session.url };
}

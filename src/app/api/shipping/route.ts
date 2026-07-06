import { NextResponse } from "next/server";
import type { CartLine, Recipient } from "@/lib/types";
import { estimateShipping } from "@/lib/printful";
import { normalizeCartLines } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lines = normalizeCartLines((body.lines ?? []) as CartLine[]);
    const recipient = body.recipient as Recipient;

    if (!lines.length) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    if (!recipient?.address1 || !recipient?.city || !recipient?.zip) {
      return NextResponse.json({ error: "Incomplete shipping address." }, { status: 400 });
    }

    const rawRates = await estimateShipping(lines, recipient);
    const rates = rawRates.map((rate) => ({
      id: rate.id,
      name: rate.name,
      amount: Number(rate.rate),
      currency: rate.currency,
      minDays: rate.minDeliveryDays ?? 4,
      maxDays: rate.maxDeliveryDays ?? 7,
    }));

    return NextResponse.json({ rates });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not fetch rates.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

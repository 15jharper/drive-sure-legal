import { NextResponse } from "next/server";
import type { CartLine, Recipient } from "@/lib/types";
import { createCheckoutSession, normalizeCartLines } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lines = normalizeCartLines((body.lines ?? []) as CartLine[]);
    const recipient = body.recipient as Recipient;
    const shipping = body.shipping as { name?: string; amount?: number | string };

    if (!lines.length) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    if (!recipient?.email || !recipient?.name) {
      return NextResponse.json({ error: "Missing customer details." }, { status: 400 });
    }

    if (shipping?.amount === undefined || shipping?.amount === null) {
      return NextResponse.json(
        { error: "Cannot read properties of undefined (reading 'amount')" },
        { status: 400 },
      );
    }

    const result = await createCheckoutSession({
      lines,
      recipient,
      shipping: {
        name: shipping.name ?? "Standard",
        amount: shipping.amount,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

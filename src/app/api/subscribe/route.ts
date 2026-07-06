import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const contact = String(body.contact ?? body.email ?? "").trim();

    if (!contact || contact.length < 5) {
      return NextResponse.json({ error: "Invalid contact." }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Subscription failed." }, { status: 500 });
  }
}

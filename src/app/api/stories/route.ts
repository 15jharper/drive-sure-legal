import { NextResponse } from "next/server";

const stories: Array<{ name: string; text: string; at: string }> = [
  {
    name: "M. — Chicago",
    text: "Nobody knows the 4am shifts I pulled to keep the lights on. This is for them.",
    at: new Date().toISOString(),
  },
  {
    name: "Reyna",
    text: "Nobody knows how many times I almost quit. I didn't.",
    at: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json({ stories });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = String(body.text ?? "").trim();
    const name = String(body.name ?? "").trim();

    if (!text) {
      return NextResponse.json({ error: "Story text is required." }, { status: 400 });
    }

    const story = {
      name: name || "Anonymous",
      text,
      at: new Date().toISOString(),
    };

    stories.unshift(story);
    return NextResponse.json({ ok: true, story });
  } catch {
    return NextResponse.json({ error: "Could not save story." }, { status: 500 });
  }
}

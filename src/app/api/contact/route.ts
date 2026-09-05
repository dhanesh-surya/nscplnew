import { NextResponse } from "next/server";

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();
  const subject = (body.subject ?? "General enquiry").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Please provide your name, email and a message." },
      { status: 400 }
    );
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json(
      { error: "Your message is a bit short — please add a little more detail." },
      { status: 400 }
    );
  }

  // No database in this simple portal — in production you would persist or
  // forward this (e.g. email / CRM / Slack). For now we acknowledge receipt.
  console.log(`[contact] ${name} <${email}> — ${subject}`);

  return NextResponse.json({
    ok: true,
    message: `Thanks, ${name.split(" ")[0]}! We've received your message and will reply to ${email} soon.`,
  });
}

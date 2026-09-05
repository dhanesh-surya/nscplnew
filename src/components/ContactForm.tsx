"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "ok" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setMsg("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const out = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("ok");
        setMsg(out.message || "Thanks! We have received your message and will reply soon.");
        form.reset();
      } else {
        setStatus("error");
        setMsg(out.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMsg("Network error. Please try again.");
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {status === "ok" && <div className="ok">{msg}</div>}
      {status === "error" && <div className="err">{msg}</div>}

      <div className="field">
        <label htmlFor="name">Your name</label>
        <input id="name" name="name" required placeholder="Jane Doe" />
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required placeholder="you@example.com" />
      </div>

      <div className="field">
        <label htmlFor="subject">I'm interested in</label>
        <select id="subject" name="subject" defaultValue="General enquiry">
          <option>General enquiry</option>
          <option>Event registration</option>
          <option>Partner with us</option>
          <option>Media & press</option>
          <option>Volunteering</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required placeholder="Tell us a little about what you need…" />
      </div>

      <button className="btn btn-primary btn-block" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { adminLogin, type LoginState } from "@/lib/admin/actions";

export default function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(adminLogin, {} as LoginState);

  return (
    <form action={formAction} noValidate>
      {state.error ? <div className="err">{state.error}</div> : null}

      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required />
      </div>

      <button className="btn btn-primary btn-block" type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-on-surface-variant mb-1.5"
        >
          Passwort
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          className="w-full rounded-lg bg-surface-container px-4 py-3 text-base text-foreground outline-none ring-1 ring-outline-variant/40 focus:ring-2 focus:ring-primary transition"
        />
      </div>

      {state.error && (
        <p className="text-sm text-destructive font-medium">{state.error}</p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-6 rounded-full"
      >
        {pending ? "Anmelden…" : "Anmelden"}
      </Button>
    </form>
  );
}

"use client";

import { useActionState, useState } from "react";
import { Button, SurfaceCard, TextField } from "@/components/ui";
import { loginAction, registerAction } from "@/actions/auth-actions";

export function AuthForms() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loginState, loginFormAction, loginPending] = useActionState(loginAction, null);
  const [registerState, registerFormAction, registerPending] = useActionState(registerAction, null);

  return (
    <SurfaceCard className="w-full max-w-[560px] rounded-[28px] p-8 md:p-10">
      <div className="flex gap-2 rounded-full bg-[var(--hh-surface-muted)] p-1">
        {(["login", "register"] as const).map((mode) => {
          const active = tab === mode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => setTab(mode)}
              className={[
                "flex-1 rounded-full px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-[var(--hh-primary-action)] text-white shadow-[var(--hh-shadow-sm)]"
                  : "text-[var(--hh-text-muted)] hover:text-[var(--hh-text)]",
              ].join(" ")}
            >
              {mode === "login" ? "Entrar" : "Criar conta"}
            </button>
          );
        })}
      </div>

      {tab === "login" ? (
        <form action={loginFormAction} className="mt-8 space-y-5">
          {loginState?.error ? (
            <p className="rounded-[16px] bg-[var(--hh-status-error-bg)] px-4 py-3 text-sm text-[var(--hh-status-error-fg)]">
              {loginState.error}
            </p>
          ) : null}
          <TextField label="Email" name="email" type="email" required autoComplete="email" />
          <TextField
            label="Senha"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
          <Button type="submit" variant="primary" size="lg" className="w-full" loading={loginPending}>
            Entrar
          </Button>
        </form>
      ) : (
        <form action={registerFormAction} className="mt-8 space-y-5">
          {registerState?.error ? (
            <p className="rounded-[16px] bg-[var(--hh-status-error-bg)] px-4 py-3 text-sm text-[var(--hh-status-error-fg)]">
              {registerState.error}
            </p>
          ) : null}
          <TextField label="Nome" name="name" required autoComplete="name" />
          <TextField label="Email" name="email" type="email" required autoComplete="email" />
          <TextField
            label="Senha"
            name="password"
            type="password"
            required
            helpText="Minimo de 8 caracteres."
            autoComplete="new-password"
          />
          <TextField
            label="Telefone"
            name="phone"
            required
            placeholder="+55 11 99999-9999"
            autoComplete="tel"
          />
          <Button
            type="submit"
            variant="accentGold"
            size="lg"
            className="w-full"
            loading={registerPending}
          >
            Criar conta
          </Button>
        </form>
      )}
    </SurfaceCard>
  );
}

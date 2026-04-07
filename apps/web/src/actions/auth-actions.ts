"use server";

import { redirect } from "next/navigation";
import { ApiError, loginApi, registerApi } from "@/lib/api";
import { clearAuthToken, setAuthToken } from "@/lib/auth";

export type AuthActionState = { error?: string } | null;

export async function loginAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  try {
    const res = await loginApi(email, password);
    await setAuthToken(res.accessToken);
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      return { error: "Email ou senha inválidos." };
    }
    return { error: "Erro ao fazer login. Tente novamente." };
  }

  redirect("/");
}

export async function registerAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const phone = (formData.get("phone") as string)?.trim();

  try {
    const res = await registerApi({ name, email, password, phone });
    await setAuthToken(res.accessToken);
  } catch (e) {
    if (e instanceof ApiError && e.status === 409) {
      return { error: "Este email já está cadastrado." };
    }
    if (e instanceof ApiError && e.status === 400) {
      return { error: "Dados inválidos. Verifique os campos e tente novamente." };
    }
    return { error: "Erro ao cadastrar. Tente novamente." };
  }

  redirect("/");
}

export async function logoutAction(): Promise<void> {
  await clearAuthToken();
  redirect("/login");
}

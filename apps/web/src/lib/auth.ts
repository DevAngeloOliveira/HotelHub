import { cookies } from "next/headers";

const TOKEN_COOKIE = "hh_token";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  path: "/",
  maxAge: 3600,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export async function getAuthToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(TOKEN_COOKIE)?.value;
}

export async function setAuthToken(token: string): Promise<void> {
  const store = await cookies();
  store.set(TOKEN_COOKIE, token, COOKIE_OPTIONS);
}

export async function clearAuthToken(): Promise<void> {
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
}

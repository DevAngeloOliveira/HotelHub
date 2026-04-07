import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import { createWebCssVariables } from "@hotelhub/design-tokens";
import { PageShell } from "@/components/page-shell";
import { getAuthToken } from "@/lib/auth";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";
import type { UserProfile } from "@hotelhub/sdk";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "HotelHub",
  description: "HotelHub Web - discover destinations and book rooms",
};

const themeCss = [
  ...Object.entries(createWebCssVariables()),
  ["--hh-font-display", "var(--font-playfair)"],
  ["--hh-font-ui", "var(--font-inter)"],
]
  .map(([k, v]) => `${k}:${v}`)
  .join(";");

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  let user: UserProfile | undefined;
  try {
    const token = await getAuthToken();
    if (token) {
      // SSR user fetch removed, will use useAuth hook client-side instead
      // This keeps auth data in sync with SDK
    }
  } catch {
    // no auth or token expired
  }

  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: `:root{${themeCss}}` }} />
      <body className="min-h-full font-sans">
        <QueryProvider>
          <PageShell user={user}>{children}</PageShell>
        </QueryProvider>
      </body>
    </html>
  );
}

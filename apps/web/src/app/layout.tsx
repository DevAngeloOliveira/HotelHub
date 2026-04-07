import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import { createWebCssVariables } from "@hotelhub/design-tokens";
import { PageShell } from "@/components/page-shell";
import { getMe } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";
import type { UserProfile } from "@/lib/types";
import "./globals.css";

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

const themeStyles = {
  ...createWebCssVariables(),
  "--hh-font-display": "var(--font-playfair)",
  "--hh-font-ui": "var(--font-inter)",
} as CSSProperties;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user: UserProfile | undefined;
  try {
    const token = await getAuthToken();
    if (token) {
      user = await getMe(token);
    }
  } catch {
    // no auth or token expired
  }

  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full font-sans" style={themeStyles}>
        <PageShell user={user}>{children}</PageShell>
      </body>
    </html>
  );
}

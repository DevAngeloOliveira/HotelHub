import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "@/providers/Providers";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "HotelHub",
  description: "HotelHub — descubra destinos e reserve hotéis com luxo e estilo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="dark">
      <body className="min-h-screen bg-[#000000] text-[#f9fafb] antialiased">
        <Providers>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}

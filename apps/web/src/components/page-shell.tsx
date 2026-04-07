"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { TopNav } from "@/components/top-nav";
import { SDKInitializer } from "@/providers/sdk-initializer";
import type { UserProfile } from "@/lib/types";

const footerColumns = [
  {
    title: "PRODUTO",
    items: ["Pesquisar Hotéis", "Destinos", "Ofertas Especiais", "Aplicativo Móvel"],
  },
  {
    title: "EMPRESA",
    items: ["Sobre Nós", "Carreiras", "Imprensa", "Contato"],
  },
  {
    title: "SUPORTE",
    items: ["Central de Ajuda", "Política de Privacidade", "Termos de Serviço", "Política de Cookies"],
  },
] as const;

export function PageShell({
  children,
  user,
}: Readonly<{
  children: ReactNode;
  user?: UserProfile;
}>) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="hh-page-grid min-h-screen">
      <SDKInitializer />
      <TopNav user={user} />
      <main className={isHome ? "w-full" : "mx-auto w-full max-w-7xl px-5 py-8 md:px-8 md:py-10"}>
        {children}
      </main>
      {isHome ? <HomeFooter /> : <DefaultFooter />}
    </div>
  );
}

function DefaultFooter() {
  return (
    <footer className="mt-12 border-t border-(--hh-border)/80 bg-white/55 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-6 text-sm text-(--hh-text-muted) md:flex-row md:items-center md:justify-between md:px-8">
        <span className="hh-display text-[20px] leading-none text-(--hh-text)">HotelHub</span>
        <span>Reserva premium, feedback claro e catalogo operacional unificado.</span>
      </div>
    </footer>
  );
}

function HomeFooter() {
  return (
    <footer id="site-footer" className="bg-(--hh-neutral-900) px-5 pb-10 pt-16 text-white md:px-8 xl:px-30">
      <div className="mx-auto flex w-full max-w-360 flex-col gap-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--hh-primary-600) text-base font-bold text-white">
                H
              </div>
              <span className="hh-display text-xl leading-none text-white">HotelHub</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-(--hh-neutral-500)">
              The smarter way to discover and book premium hotels around the world.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="text-xs uppercase tracking-widest text-(--hh-neutral-600)">{column.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-(--hh-neutral-400)">
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-(--hh-neutral-800) pt-6 text-xs text-(--hh-neutral-600) md:flex-row md:items-center md:justify-between">
          <span>{"© 2024 HotelHub. All rights reserved."}</span>
          <span>{"v1.0.0 - Design System"}</span>
        </div>
      </div>
    </footer>
  );
}
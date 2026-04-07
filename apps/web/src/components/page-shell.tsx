"use client";

import { usePathname } from "next/navigation";
import { TopNav } from "@/components/top-nav";
import type { UserProfile } from "@/lib/types";

const footerColumns = [
  {
    title: "PRODUCT",
    items: ["Search Hotels", "Destinations", "Special Offers", "Mobile App"],
  },
  {
    title: "COMPANY",
    items: ["About Us", "Careers", "Press", "Contact"],
  },
  {
    title: "SUPPORT",
    items: ["Help Center", "Privacy Policy", "Terms of Service", "Cookie Policy"],
  },
] as const;

export function PageShell({
  children,
  user,
}: Readonly<{
  children: React.ReactNode;
  user?: UserProfile;
}>) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="hh-page-grid min-h-screen">
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
    <footer className="mt-12 border-t border-[var(--hh-border)]/80 bg-white/55 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-6 text-sm text-[var(--hh-text-muted)] md:flex-row md:items-center md:justify-between md:px-8">
        <span className="hh-display text-[20px] leading-none text-[var(--hh-text)]">HotelHub</span>
        <span>Reserva premium, feedback claro e catalogo operacional unificado.</span>
      </div>
    </footer>
  );
}

function HomeFooter() {
  return (
    <footer id="site-footer" className="bg-[#14181F] px-5 pb-10 pt-16 text-white md:px-8 xl:px-[120px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div className="max-w-[280px]">
            <div className="flex items-center gap-[10px]">
              <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#1F4FD6] text-[16px] font-bold text-white">
                H
              </div>
              <span className="hh-display text-[20px] leading-[30px] text-white">HotelHub</span>
            </div>
            <p className="mt-4 text-[14px] leading-[22px] text-[#7A8799]">
              The smarter way to discover and book premium hotels around the world.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="text-[12px] uppercase tracking-[1px] text-[#5C6675]">{column.title}</p>
              <ul className="mt-4 space-y-[10px] text-[14px] leading-[21px] text-[#A8B3C2]">
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-[#272C34] pt-6 text-[13px] leading-[19.5px] text-[#5C6675] md:flex-row md:items-center md:justify-between">
          <span>(c) 2024 HotelHub. All rights reserved.</span>
          <span>v1.0.0 - Design System</span>
        </div>
      </div>
    </footer>
  );
}
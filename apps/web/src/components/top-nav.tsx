"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge, buttonClassName } from "@/components/ui";
import { logoutAction } from "@/actions/auth-actions";
import { cx } from "@/lib/cx";
import type { UserProfile } from "@/lib/types";

const links = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinos" },
  { href: "/reservations", label: "Reservas" },
  { href: "/admin", label: "Admin" },
];

const homeLinks = [
  { href: "/#featured-destinations", label: "Destinations" },
  { href: "/#recommended-hotels", label: "Hotels" },
  { href: "/#home-cta", label: "Offers" },
  { href: "/#why-hotelhub", label: "About" },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function TopNav({ user }: Readonly<{ user?: UserProfile }>) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return (
      <header className="sticky top-0 z-40 border-b border-[var(--hh-border)] bg-white shadow-[var(--hh-shadow-sm)]">
        <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between gap-8 px-5 md:px-8 xl:px-[120px]">
          <Link href="/" className="flex items-center gap-[10px]">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#1F4FD6] text-[16px] font-bold text-white">
              H
            </div>
            <span className="hh-display text-[22px] leading-[33px] text-[#14181F]">HotelHub</span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {homeLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[15px] font-medium leading-[22.5px] text-[#5C6675] transition hover:text-[#14181F]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 rounded-[12px] border border-[var(--hh-border)] px-3 py-2 md:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--hh-primary-50)] text-sm font-semibold text-[var(--hh-primary-action)]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--hh-text)]">{user.name}</p>
                  <p className="truncate text-xs text-[var(--hh-text-muted)]">{user.email}</p>
                </div>
                <Badge tone={user.role === "ADMIN" ? "premium" : "info"}>{user.role}</Badge>
              </div>
              <Link
                href={user.role === "ADMIN" ? "/admin" : "/reservations"}
                className="inline-flex h-10 items-center justify-center rounded-[12px] bg-[#1F4FD6] px-5 text-[14px] font-medium leading-[21px] text-white transition hover:bg-[#173ea9]"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center rounded-[12px] border border-[#D0D7E2] px-[21px] text-[14px] font-medium leading-[21px] text-[#14181F] transition hover:border-[#BFC8D6] hover:bg-[#F8F9FB]"
              >
                Sign in
              </Link>
              <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center rounded-[12px] bg-[#1F4FD6] px-5 text-[14px] font-medium leading-[21px] text-white transition hover:bg-[#173ea9]"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--hh-border)]/80 bg-white/78 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[linear-gradient(180deg,var(--hh-primary-500),var(--hh-primary-700))] text-sm font-semibold text-white shadow-[var(--hh-shadow-sm)]">
            H
          </div>
          <div>
            <p className="hh-display text-[28px] leading-none text-[var(--hh-text)]">HotelHub</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--hh-text-subtle)]">
              Design-driven booking
            </p>
          </div>
        </Link>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <nav className="hh-scroll-hidden flex items-center gap-1 overflow-x-auto rounded-full bg-white/70 p-1">
            {links.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cx(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    active
                      ? "bg-[var(--hh-primary-action)] text-white shadow-[var(--hh-shadow-sm)]"
                      : "text-[var(--hh-text-muted)] hover:bg-[var(--hh-surface-muted)] hover:text-[var(--hh-text)]",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {user ? (
            <div className="flex items-center justify-between gap-3 rounded-full border border-[var(--hh-border)] bg-white/70 px-3 py-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--hh-primary-50)] text-sm font-semibold text-[var(--hh-primary-action)]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden min-w-0 sm:block">
                  <p className="truncate text-sm font-medium text-[var(--hh-text)]">{user.name}</p>
                  <p className="truncate text-xs text-[var(--hh-text-muted)]">{user.email}</p>
                </div>
              </div>
              <Badge tone={user.role === "ADMIN" ? "premium" : "info"}>{user.role}</Badge>
              <form action={logoutAction}>
                <button type="submit" className={buttonClassName("ghost", "sm")}>
                  Sair
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login" className={buttonClassName("primary", "md")}>
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

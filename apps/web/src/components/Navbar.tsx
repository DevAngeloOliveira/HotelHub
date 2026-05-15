"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Globe,
  Bell,
  Menu,
  X,
  ChevronDown,
  Compass,
  Building2,
  Package,
  Calendar,
  LogIn,
  Sparkles,
  LogOut,
  Settings,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";

const NAV_LINKS = [
  { label: "Destinos", href: "/destinations", icon: Compass },
  { label: "Hotéis", href: "/search", icon: Building2 },
  { label: "Pacotes", href: "/packages", icon: Package },
  { label: "Minhas Reservas", href: "/reservations", icon: Calendar },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navBg =
    scrolled || !isHome
      ? "bg-[#000]/95 backdrop-blur-xl border-b border-[#222222]"
      : "bg-transparent";

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${navBg}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6] to-[#34d399] rounded-lg rotate-6 group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute inset-0 bg-[#000] rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
                </div>
              </div>
              <span
                className="text-white hidden sm:block"
                style={{ fontSize: "1.1rem", fontWeight: 700 }}
              >
                Hotel
                <span className="bg-gradient-to-r from-[#8b5cf6] to-[#34d399] bg-clip-text text-transparent">
                  Hub
                </span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={[
                      "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm transition-all duration-200 relative",
                      active
                        ? "bg-[#8b5cf6]/15 text-[#a78bfa]"
                        : "text-[#a1a1aa] hover:text-white hover:bg-white/5",
                    ].join(" ")}
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    {link.label}
                    {link.href === "/reservations" && isAuthenticated && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] absolute top-1.5 right-1.5" />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-white/5 transition-all text-sm">
                <Globe className="w-4 h-4" />
                PT
                <ChevronDown className="w-3 h-3" />
              </button>

              {isAuthenticated && user ? (
                <>
                  <button className="relative p-2 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-white/5 transition-all">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#34d399] rounded-full" />
                  </button>

                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen((v) => !v)}
                      className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-[#222] bg-[#0a0a0a] hover:border-[#8b5cf6]/40 transition-all"
                    >
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-[#d1d5db] text-sm max-w-[90px] truncate">
                        {user.name.split(" ")[0]}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-[#555] transition-transform ${
                          userMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-60 bg-[#0f0f0f] border border-[#222] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.7)] overflow-hidden z-50"
                        >
                          <div className="px-4 py-4 bg-gradient-to-br from-[#8b5cf6]/10 to-transparent">
                            <div className="flex items-center gap-3 mb-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>{user.initials}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                                <p className="text-[#555] text-xs truncate">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 rounded-lg px-2.5 py-1.5">
                              <span className="text-[#a78bfa] text-xs font-semibold capitalize">
                                {user.role === "ADMIN" ? "Admin" : "Membro"}
                              </span>
                            </div>
                          </div>

                          <Separator />

                          <div className="py-1.5">
                            <Link
                              href="/reservations"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-[#a1a1aa] hover:text-white hover:bg-white/5 transition-all text-sm"
                            >
                              <Calendar className="w-4 h-4" />
                              Minhas Reservas
                            </Link>
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[#a1a1aa] hover:text-white hover:bg-white/5 transition-all text-sm text-left">
                              <Settings className="w-4 h-4" />
                              Configurações
                            </button>
                          </div>

                          <Separator />

                          <div className="py-1.5">
                            <button
                              onClick={() => {
                                logout();
                                setUserMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-[#ef4444]/80 hover:text-[#ef4444] hover:bg-[#ef4444]/5 transition-all text-sm text-left"
                            >
                              <LogOut className="w-4 h-4" />
                              Sair
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#2a2a2a] text-[#a1a1aa] hover:text-white hover:border-[#8b5cf6]/40 text-sm transition-all"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Entrar
                  </Link>
                  <Link
                    href="/auth?tab=register"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white text-sm hover:opacity-90 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                  >
                    Começar Grátis
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-white/5 transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed top-16 inset-x-0 z-40 bg-[#050505]/98 backdrop-blur-xl border-b border-[#222] lg:hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {isAuthenticated && user && (
                <div className="flex items-center gap-3 px-4 py-3 bg-[#0a0a0a] rounded-xl mb-2 border border-[#1a1a1a]">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-[#555] text-xs truncate">{user.email}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-[#a78bfa] text-xs bg-[#8b5cf6]/10 px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3 fill-[#a78bfa]" />
                    Gold
                  </div>
                </div>
              )}

              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={[
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all",
                      active
                        ? "bg-[#8b5cf6]/15 text-[#a78bfa]"
                        : "text-[#a1a1aa] hover:text-white hover:bg-white/5",
                    ].join(" ")}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}

              <Separator className="my-2" />

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#ef4444]/80 hover:text-[#ef4444] hover:bg-[#ef4444]/5 text-sm transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sair da conta
                </button>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    href="/auth"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#2a2a2a] text-[#a1a1aa] text-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    Entrar
                  </Link>
                  <Link
                    href="/auth?tab=register"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                  >
                    Começar Grátis
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

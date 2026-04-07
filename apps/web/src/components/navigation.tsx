import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "./buttons";
import { cx } from "@/lib/cx";

type NavbarProps = Readonly<{
  children?: ReactNode;
  className?: string;
  showAuth?: boolean;
  activeItem?: "destinations" | "hotels" | "offers" | "about";
}>;

export function Navbar({ children, className, showAuth = true, activeItem }: NavbarProps) {
  const navItems = ["Destinations", "Hotels", "Offers", "About"];

  return (
    <nav
      className={cx(
        "bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-sm",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-(--hh-primary-action) text-white rounded-lg size-9 flex items-center justify-center font-bold">
              H
            </div>
            <span className="text-2xl font-bold text-neutral-900">HotelHub</span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-8 flex-1 max-w-sm">
            {navItems.map((item) => {
              const isActive = activeItem === item.toLowerCase();
              return (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className={cx(
                    "text-sm font-medium transition-colors pb-2",
                    isActive
                      ? "text-(--hh-primary-action) border-b-2 border-(--hh-primary-action)"
                      : "text-neutral-600 hover:text-neutral-900"
                  )}
                >
                  {item}
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          {showAuth && (
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm">
                Sign in
              </Button>
              <Button size="sm">Get started</Button>
            </div>
          )}

          {children}
        </div>
      </div>
    </nav>
  );
}

type MobileHeaderProps = Readonly<{
  title?: string;
  location?: string;
  userInitial?: string;
  onProfileClick?: () => void;
}>;

export function MobileHeader({
  title,
  location,
  userInitial,
  onProfileClick,
}: MobileHeaderProps) {
  return (
    <div className="bg-linear-to-r from-(--hh-primary-700) to-(--hh-primary-900) text-white px-4 py-6 rounded-b-3xl">
      {/* Location & Greeting */}
      <div className="flex items-start justify-between mb-4">
        <div>
          {location && <p className="text-sm opacity-80">📍 {location}</p>}
          {title && <h1 className="text-2xl font-bold mt-1">{title}</h1>}
        </div>
        {userInitial && (
          <button
            type="button"
            onClick={onProfileClick}
            className="flex items-center justify-center size-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <span className="text-lg font-bold">{userInitial}</span>
          </button>
        )}
      </div>
    </div>
  );
}

type BottomTabBarProps = Readonly<{
  activeTab: "home" | "search" | "bookings" | "saved" | "profile";
  onTabChange: (tab: "home" | "search" | "bookings" | "saved" | "profile") => void;
  notificationCount?: number;
}>;

export function BottomTabBar({ activeTab, onTabChange, notificationCount }: BottomTabBarProps) {
  const tabs = [
    { id: "home" as const, icon: "🏠", label: "Home" },
    { id: "search" as const, icon: "🔍", label: "Search" },
    { id: "bookings" as const, icon: "📋", label: "Bookings", badge: notificationCount },
    { id: "saved" as const, icon: "♡", label: "Saved" },
    { id: "profile" as const, icon: "👤", label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-4 py-3 md:hidden">
      <div className="flex items-center justify-around gap-2">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cx(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors relative",
              activeTab === tab.id
                ? "text-(--hh-primary-action) bg-(--hh-primary-50)"
                : "text-neutral-500 hover:text-neutral-900"
            )}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
            {tab.badge && tab.badge > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full size-5 flex items-center justify-center font-bold">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

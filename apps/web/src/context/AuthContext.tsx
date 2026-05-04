"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { RESERVATIONS } from "../data/mock";

export interface TravelProfile {
  styles: string[];
  regions: string[];
  budget: string;
  frequency: string;
  companions: string[];
  interests: string[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  memberSince: string;
  totalTrips: number;
  points: number;
  travelProfile?: TravelProfile;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, name?: string) => Promise<void>;
  register: (email: string, password: string, name: string, profile: TravelProfile) => Promise<void>;
  logout: () => void;
  userReservations: typeof RESERVATIONS;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USER: AuthUser = {
  id: "u1",
  name: "Ângelo Oliveira",
  email: "angelo@hotelhub.com",
  initials: "AO",
  memberSince: "Jan 2024",
  totalTrips: 4,
  points: 12_400,
  travelProfile: {
    styles: ["luxury", "cultural"],
    regions: ["europe", "asia"],
    budget: "premium",
    frequency: "often",
    companions: ["couple"],
    interests: ["gastronomy", "photography"],
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = sessionStorage.getItem("hh_user");
      return stored ? (JSON.parse(stored) as AuthUser) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const persist = (u: AuthUser) => {
    setUser(u);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("hh_user", JSON.stringify(u));
    }
  };

  const login = useCallback(async (email: string, _password: string, name?: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const loggedUser: AuthUser = name
      ? {
          ...DEMO_USER,
          name,
          email,
          initials: name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase(),
        }
      : { ...DEMO_USER, email };
    persist(loggedUser);
    setIsLoading(false);
  }, []);

  const register = useCallback(
    async (email: string, _password: string, name: string, profile: TravelProfile) => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 1400));
      const newUser: AuthUser = {
        id: `u_${Date.now()}`,
        name,
        email,
        initials: name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase(),
        memberSince: new Date().toLocaleDateString("pt-BR", { month: "short", year: "numeric" }),
        totalTrips: 0,
        points: 500,
        travelProfile: profile,
      };
      persist(newUser);
      setIsLoading(false);
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("hh_user");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        userReservations: user ? RESERVATIONS : [],
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

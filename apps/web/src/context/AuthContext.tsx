"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { authModule, authInterceptor, initializeHotelHubSDK } from "@hotelhub/sdk";
import type { User } from "@hotelhub/sdk";

// TravelProfile é armazenado apenas localmente (UI-only, sem endpoint no backend ainda)
export interface TravelProfile {
  styles: string[];
  regions: string[];
  budget: string;
  frequency: string;
  companions: string[];
  interests: string[];
}

export interface AuthUser extends User {
  initials: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    phone: string,
    profile?: TravelProfile,
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function computeInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function toAuthUser(user: User): AuthUser {
  return { ...user, initials: computeInitials(user.name) };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // initializeHotelHubSDK() é chamado de forma síncrona na primeira renderização
  // para garantir que authInterceptor leia o localStorage antes de qualquer efeito
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window !== "undefined") {
      initializeHotelHubSDK();
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authInterceptor.getAccessToken()) {
      setIsLoading(false);
      return;
    }
    authModule
      .getMe()
      .then((u) => setUser(toAuthUser(u)))
      .catch(() => authInterceptor.clearTokens())
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authModule.login({ email, password });
      authInterceptor.setTokens({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
      });
      setUser(toAuthUser(res.user));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (
      email: string,
      password: string,
      name: string,
      phone: string,
      _profile?: TravelProfile,
    ) => {
      setIsLoading(true);
      try {
        const res = await authModule.register({ name, email, password, phone });
        authInterceptor.setTokens({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        });
        setUser(toAuthUser(res.user));
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    authInterceptor.clearTokens();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}
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

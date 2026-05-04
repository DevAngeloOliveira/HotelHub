"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#8b5cf6]/30 border-t-[#8b5cf6] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-md w-full text-center"
        >
          <div className="absolute inset-0 bg-[#8b5cf6]/10 blur-[80px] rounded-full -z-10" />

          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#7c3aed]/20 to-[#8b5cf6]/20 border border-[#8b5cf6]/30 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-9 h-9 text-[#8b5cf6]" />
          </div>

          <h2 className="text-white mb-2">Acesso restrito</h2>
          <p className="text-[#71717a] text-sm leading-relaxed mb-8 max-w-xs mx-auto">
            Faça login para visualizar suas reservas e gerenciar suas viagens.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() =>
                router.push(`/auth?redirect=${encodeURIComponent(pathname)}`)
              }
              className="flex items-center gap-2"
            >
              Entrar na minha conta
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                router.push(`/auth?tab=register&redirect=${encodeURIComponent(pathname)}`)
              }
            >
              Criar conta grátis
            </Button>
          </div>

          <div className="mt-10 pt-8 border-t border-[#1a1a1a]">
            <p className="text-[#555] text-xs mb-4">Com uma conta você tem acesso a:</p>
            <div className="grid grid-cols-2 gap-3 text-left">
              {[
                { icon: "📋", label: "Histórico de reservas" },
                { icon: "🔔", label: "Alertas de preço" },
                { icon: "❤️", label: "Lista de favoritos" },
                { icon: "🏆", label: "Programa de pontos" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-3 py-2.5"
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="text-[#a1a1aa] text-xs">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, ArrowRight, Sparkles, Check, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { AppleIcon, GoogleIcon } from "../components/ui/brand-icons";
import { RegisterWizard } from "../components/RegisterWizard";
import { WelcomeSplash } from "../components/WelcomeSplash";

// ── Decorative left panel ─────────────────────────────────────
function LeftPanel({ isRegister }: { isRegister: boolean }) {
  return (
    <div className="hidden lg:flex flex-1 relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={isRegister ? "reg" : "login"}
          src={
            isRegister
              ? "https://images.unsplash.com/photo-1622779536320-bb5f5b501a06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
              : "https://images.unsplash.com/photo-1612277288801-0d783ca59c42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          }
          alt="Travel"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-[#000]/90 to-[#000]/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#000]/50" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8b5cf6]/20 blur-[100px] rounded-full" />

      <div className="relative z-10 flex flex-col justify-between p-12 w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6] to-[#34d399] rounded-lg rotate-6" />
            <div className="absolute inset-0 bg-[#000] rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
            </div>
          </div>
          <span className="text-white" style={{ fontSize: "1.1rem", fontWeight: 700 }}>
            Hotel<span className="bg-gradient-to-r from-[#8b5cf6] to-[#34d399] bg-clip-text text-transparent">Hub</span>
          </span>
        </Link>

        {/* Bottom copy */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isRegister ? "reg" : "login"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {isRegister ? (
              <>
                <p className="text-[#8b5cf6] text-xs uppercase tracking-widest mb-3 font-semibold">
                  Seu perfil de viagem
                </p>
                <h2 className="text-white mb-3" style={{ fontSize: "1.9rem", fontWeight: 800, lineHeight: 1.15 }}>
                  Recomendações<br />feitas para você
                </h2>
                <p className="text-[#a1a1aa] text-sm leading-relaxed max-w-xs mb-6">
                  Responda algumas perguntas sobre seus gostos e receba sugestões personalizadas de hotéis e destinos.
                </p>
                <div className="flex flex-col gap-2.5">
                  {[
                    { icon: "✨", text: "Hotéis curados ao seu gosto" },
                    { icon: "🎯", text: "Ofertas no seu budget exato" },
                    { icon: "🗺️", text: "Destinos do seu perfil em alta" },
                    { icon: "🏆", text: "500 pontos de boas-vindas" },
                  ].map(item => (
                    <div key={item.text} className="flex items-center gap-2.5">
                      <span className="text-base">{item.icon}</span>
                      <span className="text-[#d1d5db] text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {["Paris", "Bali", "Maldivas", "Tóquio"].map(d => (
                    <span key={d} className="text-xs text-[#a1a1aa] bg-[#000]/40 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-full">
                      {d}
                    </span>
                  ))}
                </div>
                <h2 className="text-white mb-2" style={{ fontSize: "2rem", fontWeight: 700 }}>
                  O mundo espera<br />por você
                </h2>
                <p className="text-[#a1a1aa] text-sm leading-relaxed max-w-xs">
                  Acesse sua conta e continue explorando destinos incríveis com o HotelHub.
                </p>
                <div className="flex items-center gap-3 mt-6">
                  <div className="flex -space-x-2">
                    {["AO", "MC", "CM", "RB"].map((init, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-[#000] flex items-center justify-center text-white text-xs font-semibold"
                        style={{ background: i % 2 === 0 ? "linear-gradient(135deg,#7c3aed,#8b5cf6)" : "linear-gradient(135deg,#059669,#34d399)" }}>
                        {init}
                      </div>
                    ))}
                  </div>
                  <p className="text-[#a1a1aa] text-xs">
                    <span className="text-white font-semibold">12M+</span> viajantes confiam no HotelHub
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Login form ─────────────────────────────────────────────────
function LoginForm({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess]   = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const router = useRouter();
  const { login, isLoading }    = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    setSuccess(true);
    await new Promise(r => setTimeout(r, 700));
    router.push(redirect);
  };

  return (
    <motion.div
      key="login-form"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.22 }}
    >
      <div className="mb-6">
        <h2 className="text-white mb-1" style={{ fontSize: "1.3rem", fontWeight: 700 }}>
          Bem-vindo de volta
        </h2>
        <p className="text-[#71717a] text-sm">
          Entre para acessar suas reservas e ofertas exclusivas.
        </p>
      </div>

      {/* Social buttons */}
      <div className="flex gap-3 mb-5">
        <button type="button" className="flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-[#222] bg-[#0a0a0a] text-[#d1d5db] text-sm font-medium hover:border-[#333] hover:bg-[#111] hover:text-white transition-all">
          <AppleIcon className="w-4 h-4" /> Apple
        </button>
        <button type="button" className="flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-[#222] bg-[#0a0a0a] text-[#d1d5db] text-sm font-medium hover:border-[#333] hover:bg-[#111] hover:text-white transition-all">
          <GoogleIcon className="w-4 h-4" /> Google
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <Separator className="flex-1" />
        <span className="text-[#555] text-xs shrink-0">ou com e-mail</span>
        <Separator className="flex-1" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="login-email">E-mail</Label>
          <Input id="login-email" type="email" placeholder="seu@email.com" value={email}
            onChange={e => setEmail(e.target.value)} required leftIcon={<Mail className="w-4 h-4" />} />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-pass">Senha</Label>
            <button type="button" className="text-[#8b5cf6] text-xs hover:text-[#a78bfa] transition-colors">
              Esqueceu a senha?
            </button>
          </div>
          <Input id="login-pass" type={showPass ? "text" : "password"} placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)} required
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button type="button" onClick={() => setShowPass(v => !v)} className="hover:text-white transition-colors">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
        </div>

        <button type="submit" disabled={isLoading || success}
          className="flex items-center justify-center gap-2 h-11 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white text-sm font-semibold hover:opacity-90 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-60 mt-1">
          {success ? (
            <><Check className="w-4 h-4" /> Tudo certo!</>
          ) : isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>Entrar <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>

      <p className="text-center text-[#555] text-xs mt-5">
        Não tem uma conta?{" "}
        <button onClick={onSwitchToRegister} className="text-[#8b5cf6] hover:text-[#a78bfa] font-medium transition-colors">
          Criar conta grátis
        </button>
      </p>
    </motion.div>
  );
}

// ── Main AuthPage ─────────────────────────────────────────────
export function AuthPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "register" ? "register" : "login";

  // Phase: "login" | "splash" | "wizard"
  const [phase, setPhase] = useState<"login" | "splash" | "wizard">(
    initialTab === "register" ? "splash" : "login"
  );

  const isRegister = phase !== "login";

  const goToSplash = () => setPhase("splash");
  const goToWizard = () => setPhase("wizard");
  const goToLogin  = () => setPhase("login");

  return (
    <>
      {/* ── Full-screen welcome splash (appears first on register) ── */}
      <AnimatePresence>
        {phase === "splash" && (
          <WelcomeSplash onStart={goToWizard} />
        )}
      </AnimatePresence>

      {/* ── Split-screen auth layout ── */}
      <div className="min-h-screen bg-[#000] flex">
        <LeftPanel isRegister={isRegister} />

        {/* Right panel */}
        <div className="flex-1 lg:max-w-[460px] flex flex-col items-center justify-center px-6 sm:px-10 py-12 overflow-y-auto">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6] to-[#34d399] rounded-lg rotate-6" />
              <div className="absolute inset-0 bg-[#000] rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
              </div>
            </div>
            <span className="text-white" style={{ fontSize: "1.1rem", fontWeight: 700 }}>
              Hotel<span className="bg-gradient-to-r from-[#8b5cf6] to-[#34d399] bg-clip-text text-transparent">Hub</span>
            </span>
          </Link>

          {/* Tab switcher — only on login */}
          <AnimatePresence>
            {phase === "login" && (
              <motion.div
                key="tab-switcher"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-sm mb-7"
              >
                <div className="flex items-center bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-1">
                  <div className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-center bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                    Entrar
                  </div>
                  <button onClick={goToSplash}
                    className="flex-1 py-2.5 rounded-lg text-sm transition-all text-[#71717a] hover:text-[#a1a1aa]">
                    Criar conta
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full max-w-sm">
            <AnimatePresence mode="wait">
              {phase === "login" && (
                <LoginForm key="login" onSwitchToRegister={goToSplash} />
              )}

              {phase === "wizard" && (
                <motion.div
                  key="wizard"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Back to login */}
                  <button onClick={goToLogin}
                    className="flex items-center gap-1.5 text-[#555] hover:text-[#a1a1aa] text-xs mb-5 transition-colors">
                    ← Já tenho conta
                  </button>
                  <RegisterWizard />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}

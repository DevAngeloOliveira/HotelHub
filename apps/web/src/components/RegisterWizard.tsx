"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye, EyeOff, ArrowRight, ArrowLeft, Check, Sparkles,
  User, Mail, Lock, MapPin, Wallet, Plane, Users,
  Star, Camera, UtensilsCrossed, Music, Dumbbell,
  ShoppingBag, Leaf, Building2, Waves, Mountain,
  Globe, Heart, Zap, Coffee
} from "lucide-react";
import { useAuth, type TravelProfile } from "../context/AuthContext";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { AppleIcon, GoogleIcon } from "./ui/brand-icons";

// ── Data definitions ──────────────────────────────────────────────────────────

const TRAVEL_STYLES = [
  { id: "luxury",    label: "Luxo",       emoji: "✨", desc: "Hotéis 5★ e experiências premium" },
  { id: "adventure", label: "Aventura",   emoji: "🏔️", desc: "Trilhas, esportes e adrenalina" },
  { id: "cultural",  label: "Cultural",   emoji: "🎭", desc: "Museus, arte e história local" },
  { id: "beach",     label: "Praias",     emoji: "🏖️", desc: "Mar, sol e relaxamento total" },
  { id: "gastro",    label: "Gastronomia",emoji: "🍽️", desc: "Restaurantes, mercados e sabores" },
  { id: "nature",    label: "Natureza",   emoji: "🌿", desc: "Florestas, parques e fauna" },
  { id: "city",      label: "Urbano",     emoji: "🌆", desc: "Metrópoles, nightlife e compras" },
  { id: "wellness",  label: "Bem-estar",  emoji: "🧘", desc: "Spas, retiros e mindfulness" },
  { id: "roadtrip",  label: "Road trip",  emoji: "🚗", desc: "Viagens de carro e liberdade" },
];

const REGIONS = [
  { id: "europe",       label: "Europa",         emoji: "🏰", examples: "Paris · Roma · Lisboa" },
  { id: "asia",         label: "Ásia",           emoji: "⛩️", examples: "Tóquio · Bali · Tailândia" },
  { id: "americas",     label: "Américas",       emoji: "🗽", examples: "NYC · Buenos Aires · Caribe" },
  { id: "middleeast",   label: "Oriente Médio",  emoji: "🕌", examples: "Dubai · Istambul · Marrakech" },
  { id: "africa",       label: "África",         emoji: "🦁", examples: "Safari · Egito · Marrocos" },
  { id: "oceania",      label: "Oceania",        emoji: "🦘", examples: "Sydney · Nova Zelândia · Fiji" },
  { id: "latam",        label: "América Latina", emoji: "🌺", examples: "Rio · Machu Picchu · Pantanal" },
  { id: "polar",        label: "Polar",          emoji: "🧊", examples: "Islândia · Patagônia · Aurora" },
];

const BUDGETS = [
  { id: "economic", label: "Econômico",  range: "Até R$ 500/noite",    icon: "💚", color: "#34d399" },
  { id: "moderate", label: "Moderado",   range: "R$ 500–1.500/noite",  icon: "💛", color: "#f59e0b" },
  { id: "premium",  label: "Premium",    range: "R$ 1.500–5.000/noite",icon: "💜", color: "#8b5cf6" },
  { id: "ultra",    label: "Ultra luxury",range: "Acima de R$ 5.000",  icon: "💎", color: "#a855f7" },
];

const FREQUENCIES = [
  { id: "rarely",    label: "Raramente",    sub: "1 vez por ano",      icon: "🌱" },
  { id: "sometimes", label: "Às vezes",     sub: "2–3 viagens/ano",    icon: "✈️" },
  { id: "often",     label: "Frequente",    sub: "4–6 viagens/ano",    icon: "🗺️" },
  { id: "always",    label: "Todo mês",     sub: "Sempre viajando",    icon: "🌍" },
];

const COMPANIONS = [
  { id: "solo",   label: "Solo",         emoji: "🧳" },
  { id: "couple", label: "Casal",        emoji: "💑" },
  { id: "family", label: "Família",      emoji: "👨‍👩‍👧‍👦" },
  { id: "friends",label: "Amigos",       emoji: "🎉" },
  { id: "work",   label: "Trabalho",     emoji: "💼" },
];

const INTERESTS = [
  { id: "photography",  label: "Fotografia",     Icon: Camera },
  { id: "gastronomy",   label: "Gastronomia",    Icon: UtensilsCrossed },
  { id: "music",        label: "Música & Shows", Icon: Music },
  { id: "fitness",      label: "Esportes",       Icon: Dumbbell },
  { id: "shopping",     label: "Compras",        Icon: ShoppingBag },
  { id: "eco",          label: "Ecoturismo",     Icon: Leaf },
  { id: "architecture", label: "Arquitetura",    Icon: Building2 },
  { id: "diving",       label: "Mergulho",       Icon: Waves },
  { id: "hiking",       label: "Trekking",       Icon: Mountain },
  { id: "nightlife",    label: "Nightlife",      Icon: Zap },
  { id: "coffee",       label: "Cafeterias",     Icon: Coffee },
  { id: "romance",      label: "Romântico",      Icon: Heart },
];

// ── Strength meter ────────────────────────────────────────────────────────────
function getStrength(pw: string) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s += 25;
  if (/[A-Z]/.test(pw)) s += 25;
  if (/[0-9]/.test(pw)) s += 25;
  if (/[^A-Za-z0-9]/.test(pw)) s += 25;
  return s;
}
const STRENGTH_META: Record<number, { label: string; color: string; gradient: string }> = {
  0:   { label: "",         color: "",          gradient: "from-transparent to-transparent" },
  25:  { label: "Fraca",    color: "#ef4444",   gradient: "from-[#ef4444] to-[#ef4444]" },
  50:  { label: "Regular",  color: "#f59e0b",   gradient: "from-[#f59e0b] to-[#f59e0b]" },
  75:  { label: "Boa",      color: "#8b5cf6",   gradient: "from-[#7c3aed] to-[#a855f7]" },
  100: { label: "Forte",    color: "#34d399",   gradient: "from-[#059669] to-[#34d399]" },
};

// ── Multi-select helper ───────────────────────────────────────────────────────
function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
}

// ── Step indicator ────────────────────────────────────────────────────────────
const STEP_LABELS = ["Conta", "Estilo", "Regiões", "Perfil", "Interesses"];

function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center gap-1">
            <div
              className={[
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                i < current
                  ? "bg-gradient-to-br from-[#7c3aed] to-[#34d399] text-white"
                  : i === current
                  ? "bg-[#8b5cf6] text-white ring-2 ring-[#8b5cf6]/30 ring-offset-2 ring-offset-black"
                  : "bg-[#111] border border-[#2a2a2a] text-[#555]",
              ].join(" ")}
            >
              {i < current ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span
              className={[
                "hidden sm:block text-xs transition-colors",
                i === current ? "text-[#a78bfa]" : i < current ? "text-[#34d399]" : "text-[#555]",
              ].join(" ")}
            >
              {label}
            </span>
            {i < total - 1 && (
              <div
                className={[
                  "hidden sm:block h-px w-4 lg:w-8 mx-1 transition-all duration-500",
                  i < current ? "bg-gradient-to-r from-[#8b5cf6] to-[#34d399]" : "bg-[#1a1a1a]",
                ].join(" ")}
              />
            )}
          </div>
        ))}
      </div>
      <Progress value={((current) / (total - 1)) * 100} className="h-1" />
    </div>
  );
}

// ── Selectable card ───────────────────────────────────────────────────────────
function SelectCard({
  selected, onClick, children, className = "",
}: {
  selected: boolean; onClick: () => void; children: React.ReactNode; className?: string;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={[
        "relative text-left rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden",
        selected
          ? "border-[#8b5cf6] bg-[#8b5cf6]/10 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
          : "border-[#1e1e1e] bg-[#0a0a0a] hover:border-[#333] hover:bg-[#111]",
        className,
      ].join(" ")}
    >
      {selected && (
        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#8b5cf6] flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      {children}
    </motion.button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function RegisterWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { register, isLoading } = useAuth();

  const [step, setStep] = useState(0);
  const TOTAL = 5;

  // Step 0 – credentials
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const strength = getStrength(password);
  const strengthMeta = STRENGTH_META[strength];

  // Step 1 – travel styles
  const [styles, setStyles] = useState<string[]>([]);

  // Step 2 – regions
  const [regions, setRegions] = useState<string[]>([]);

  // Step 3 – budget + frequency + companions
  const [budget, setBudget]         = useState("");
  const [frequency, setFrequency]   = useState("");
  const [companions, setCompanions] = useState<string[]>([]);

  // Step 4 – interests
  const [interests, setInterests] = useState<string[]>([]);

  // Success
  const [done, setDone] = useState(false);

  const canNext = () => {
    if (step === 0) return name.trim().length >= 2 && email.includes("@") && strength >= 50;
    if (step === 1) return styles.length >= 1;
    if (step === 2) return regions.length >= 1;
    if (step === 3) return budget && frequency && companions.length >= 1;
    if (step === 4) return interests.length >= 2;
    return true;
  };

  const handleFinish = async () => {
    const profile: TravelProfile = { styles, regions, budget, frequency, companions, interests };
    await register(email, password, name, profile);
    setDone(true);
    setTimeout(() => router.push(redirect), 2200);
  };

  const variants = {
    enter:  (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit:   (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };
  const [dir, setDir] = useState(1);

  const go = (d: number) => { setDir(d); setStep(s => s + d); };

  // ── Success screen ──
  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-8 text-center"
      >
        {/* Animated check */}
        <div className="relative mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#7c3aed] to-[#34d399] flex items-center justify-center mx-auto shadow-[0_0_60px_rgba(139,92,246,0.5)]"
          >
            <Check className="w-12 h-12 text-white" strokeWidth={3} />
          </motion.div>
          {/* Sparkle particles */}
          {[0,1,2,3,4,5].map(i => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0, x: Math.cos(i * 60 * Math.PI/180) * 50, y: Math.sin(i * 60 * Math.PI/180) * 50 }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.6 }}
              className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
              style={{ background: i % 2 === 0 ? "#8b5cf6" : "#34d399" }}
            />
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-white mb-2" style={{ fontSize: "1.6rem", fontWeight: 800 }}>
            Bem-vindo, {name.split(" ")[0]}! 🎉
          </h2>
          <p className="text-[#71717a] text-sm mb-5 max-w-xs mx-auto">
            Seu perfil de viagem está pronto. Já separamos destinos exclusivos para você.
          </p>

          {/* Bonus badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8b5cf6]/20 to-[#34d399]/10 border border-[#8b5cf6]/30 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-[#f59e0b] fill-[#f59e0b]" />
            <span className="text-[#a78bfa] text-sm font-semibold">500 pontos de boas-vindas desbloqueados!</span>
          </div>

          {/* Profile summary chips */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {[...styles.slice(0,2), ...regions.slice(0,2), budget].filter(Boolean).map(tag => (
              <span key={tag} className="text-xs text-[#a1a1aa] bg-[#111] border border-[#222] px-3 py-1 rounded-full capitalize">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[#555] text-xs justify-center">
            <div className="w-4 h-4 border-2 border-[#8b5cf6]/30 border-t-[#8b5cf6] rounded-full animate-spin" />
            Redirecionando para o início…
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <StepBar current={step} total={TOTAL} />

      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={step}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.22, ease: "easeInOut" }}
        >
          {/* ── STEP 0: Credentials ─────────────────────────────── */}
          {step === 0 && (
            <div>
              <div className="mb-6">
                <h2 className="text-white mb-1" style={{ fontSize: "1.3rem", fontWeight: 700 }}>
                  Crie sua conta
                </h2>
                <p className="text-[#71717a] text-sm">
                  Rápido e seguro. Sem cartão de crédito.
                </p>
              </div>

              {/* Social auth */}
              <div className="flex gap-3 mb-5">
                <button type="button" className="flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-[#222] bg-[#0a0a0a] text-[#d1d5db] text-sm font-medium hover:border-[#333] hover:bg-[#111] hover:text-white transition-all">
                  <AppleIcon className="w-4 h-4" /> Apple
                </button>
                <button type="button" className="flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-[#222] bg-[#0a0a0a] text-[#d1d5db] text-sm font-medium hover:border-[#333] hover:bg-[#111] hover:text-white transition-all">
                  <GoogleIcon className="w-4 h-4" /> Google
                </button>
              </div>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-[#1a1a1a]" />
                <span className="text-[#555] text-xs">ou com e-mail</span>
                <div className="flex-1 h-px bg-[#1a1a1a]" />
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="reg-name">Nome completo</Label>
                  <Input id="reg-name" type="text" placeholder="Seu nome" value={name}
                    onChange={e => setName(e.target.value)} leftIcon={<User className="w-4 h-4" />} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="reg-email">E-mail</Label>
                  <Input id="reg-email" type="email" placeholder="seu@email.com" value={email}
                    onChange={e => setEmail(e.target.value)} leftIcon={<Mail className="w-4 h-4" />} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="reg-pass">Senha</Label>
                  <Input id="reg-pass" type={showPass ? "text" : "password"} placeholder="Mínimo 8 caracteres"
                    value={password} onChange={e => setPassword(e.target.value)}
                    leftIcon={<Lock className="w-4 h-4" />}
                    rightIcon={
                      <button type="button" onClick={() => setShowPass(v => !v)} className="hover:text-white transition-colors">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />
                  {password.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="flex gap-1 mt-1">
                        {[25, 50, 75, 100].map(lvl => (
                          <div key={lvl} className="flex-1 h-1 rounded-full transition-all duration-400"
                            style={{ background: strength >= lvl ? strengthMeta.color : "#1a1a1a" }} />
                        ))}
                      </div>
                      {strengthMeta.label && (
                        <p className="text-xs mt-1" style={{ color: strengthMeta.color }}>
                          Senha {strengthMeta.label}
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>
                <p className="text-[#555] text-xs">
                  Ao continuar você concorda com os{" "}
                  <a href="#" className="text-[#8b5cf6] hover:underline">Termos</a> e{" "}
                  <a href="#" className="text-[#8b5cf6] hover:underline">Privacidade</a>.
                </p>
              </div>
            </div>
          )}

          {/* ── STEP 1: Travel Styles ────────────────────────────── */}
          {step === 1 && (
            <div>
              <div className="mb-5">
                <h2 className="text-white mb-1" style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                  Qual é o seu estilo de viagem?
                </h2>
                <p className="text-[#71717a] text-sm">Escolha quantos quiser — quanto mais, melhor!</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {TRAVEL_STYLES.map(s => (
                  <SelectCard key={s.id} selected={styles.includes(s.id)} onClick={() => setStyles(t => toggle(t, s.id))}>
                    <div className="p-3 flex flex-col items-center text-center gap-1">
                      <span className="text-2xl leading-none">{s.emoji}</span>
                      <span className="text-white text-xs font-semibold leading-tight">{s.label}</span>
                    </div>
                  </SelectCard>
                ))}
              </div>
              {styles.length > 0 && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#8b5cf6] text-xs mt-3 text-center">
                  {styles.length} escolhido{styles.length > 1 ? "s" : ""} ✓
                </motion.p>
              )}
            </div>
          )}

          {/* ── STEP 2: Regions ─────────────────────────────────── */}
          {step === 2 && (
            <div>
              <div className="mb-5">
                <h2 className="text-white mb-1" style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                  Onde você quer explorar?
                </h2>
                <p className="text-[#71717a] text-sm">Selecione as regiões dos seus sonhos.</p>
              </div>
              <div className="flex flex-col gap-2">
                {REGIONS.map(r => (
                  <SelectCard key={r.id} selected={regions.includes(r.id)} onClick={() => setRegions(t => toggle(t, r.id))} className="w-full">
                    <div className="flex items-center gap-3 p-3 pr-8">
                      <span className="text-2xl leading-none shrink-0">{r.emoji}</span>
                      <div>
                        <p className="text-white text-sm font-semibold">{r.label}</p>
                        <p className="text-[#555] text-xs">{r.examples}</p>
                      </div>
                    </div>
                  </SelectCard>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 3: Budget + Frequency + Companions ──────────── */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              {/* Budget */}
              <div>
                <h2 className="text-white mb-1" style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                  Qual sua faixa de orçamento?
                </h2>
                <p className="text-[#71717a] text-xs mb-3">Médio por acomodação/noite.</p>
                <div className="grid grid-cols-2 gap-2">
                  {BUDGETS.map(b => (
                    <SelectCard key={b.id} selected={budget === b.id} onClick={() => setBudget(b.id)}>
                      <div className="p-3">
                        <span className="text-xl mb-1 block">{b.icon}</span>
                        <p className="text-white text-sm font-semibold">{b.label}</p>
                        <p className="text-[#555] text-xs">{b.range}</p>
                      </div>
                    </SelectCard>
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div>
                <p className="text-white text-sm font-semibold mb-3">Com que frequência você viaja?</p>
                <div className="grid grid-cols-2 gap-2">
                  {FREQUENCIES.map(f => (
                    <SelectCard key={f.id} selected={frequency === f.id} onClick={() => setFrequency(f.id)}>
                      <div className="flex items-center gap-2.5 p-3 pr-7">
                        <span className="text-xl leading-none">{f.icon}</span>
                        <div>
                          <p className="text-white text-xs font-semibold">{f.label}</p>
                          <p className="text-[#555] text-xs">{f.sub}</p>
                        </div>
                      </div>
                    </SelectCard>
                  ))}
                </div>
              </div>

              {/* Companions */}
              <div>
                <p className="text-white text-sm font-semibold mb-3">Com quem você costuma viajar?</p>
                <div className="flex gap-2 flex-wrap">
                  {COMPANIONS.map(c => (
                    <SelectCard key={c.id} selected={companions.includes(c.id)} onClick={() => setCompanions(t => toggle(t, c.id))}>
                      <div className="flex items-center gap-2 px-3 py-2.5 pr-7">
                        <span className="text-lg">{c.emoji}</span>
                        <span className="text-white text-xs font-medium">{c.label}</span>
                      </div>
                    </SelectCard>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: Interests ───────────────────────────────── */}
          {step === 4 && (
            <div>
              <div className="mb-5">
                <h2 className="text-white mb-1" style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                  O que você curte fazer?
                </h2>
                <p className="text-[#71717a] text-sm">Escolha pelo menos 2 para personalizar suas recomendações.</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {INTERESTS.map(({ id, label, Icon }) => (
                  <SelectCard key={id} selected={interests.includes(id)} onClick={() => setInterests(t => toggle(t, id))}>
                    <div className="flex flex-col items-center gap-1.5 p-3">
                      <div className={[
                        "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
                        interests.includes(id) ? "bg-[#8b5cf6]/30" : "bg-[#111]",
                      ].join(" ")}>
                        <Icon className={`w-4 h-4 ${interests.includes(id) ? "text-[#a78bfa]" : "text-[#555]"}`} />
                      </div>
                      <span className="text-white text-xs font-medium text-center leading-tight">{label}</span>
                    </div>
                  </SelectCard>
                ))}
              </div>
              {interests.length >= 2 && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#34d399] text-xs mt-3 text-center">
                  Perfeito! {interests.length} interesses selecionados ✓
                </motion.p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Navigation ── */}
      <div className="flex items-center justify-between mt-7 gap-3">
        {step > 0 ? (
          <button type="button" onClick={() => go(-1)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#2a2a2a] text-[#a1a1aa] text-sm hover:border-[#444] hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
        ) : <div />}

        {step < TOTAL - 1 ? (
          <button type="button" onClick={() => go(1)} disabled={!canNext()}
            className={[
              "flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
              canNext()
                ? "bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white hover:opacity-90 shadow-[0_0_20px_rgba(139,92,246,0.35)]"
                : "bg-[#1a1a1a] text-[#555] cursor-not-allowed",
            ].join(" ")}>
            Continuar <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button type="button" onClick={handleFinish} disabled={!canNext() || isLoading}
            className={[
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
              canNext() && !isLoading
                ? "bg-gradient-to-r from-[#059669] to-[#34d399] text-white hover:opacity-90 shadow-[0_0_24px_rgba(52,211,153,0.4)]"
                : "bg-[#1a1a1a] text-[#555] cursor-not-allowed",
            ].join(" ")}>
            {isLoading
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Criando...</>
              : <><Sparkles className="w-4 h-4" /> Criar meu perfil</>}
          </button>
        )}
      </div>

      {/* Step hint */}
      <p className="text-center text-[#3a3a3a] text-xs mt-4">
        Etapa {step + 1} de {TOTAL}
      </p>
    </div>
  );
}

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { Sparkles, ArrowRight, Globe, Star, MapPin, Users } from "lucide-react";

// ── Destination cards data ────────────────────────────────────────────────────
const DESTINATIONS = [
  {
    id: "santorini",
    name: "Santorini",
    country: "Grécia",
    flag: "🇬🇷",
    rating: "4.9",
    img: "https://images.unsplash.com/photo-1612277288801-0d783ca59c42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    style: { top: "8%",  left: "4%",  rotate: -6 },
  },
  {
    id: "tokyo",
    name: "Tóquio",
    country: "Japão",
    flag: "🇯🇵",
    rating: "4.8",
    img: "https://images.unsplash.com/photo-1732667318116-18131c7e1442?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    style: { top: "6%",  right: "4%", rotate: 5 },
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonésia",
    flag: "🇮🇩",
    rating: "4.9",
    img: "https://images.unsplash.com/photo-1576475706812-822620fc23ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    style: { top: "38%", left: "2%",  rotate: -4 },
  },
  {
    id: "maldives",
    name: "Maldivas",
    country: "Maldivas",
    flag: "🇲🇻",
    rating: "5.0",
    img: "https://images.unsplash.com/photo-1622779536320-bb5f5b501a06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    style: { top: "36%", right: "2%", rotate: 4 },
  },
  {
    id: "paris",
    name: "Paris",
    country: "França",
    flag: "🇫🇷",
    rating: "4.7",
    img: "https://images.unsplash.com/photo-1773225630752-68af7fcc4b39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    style: { bottom: "10%", left: "5%",  rotate: 5 },
  },
  {
    id: "machupicchu",
    name: "Machu Picchu",
    country: "Peru",
    flag: "🇵🇪",
    rating: "4.9",
    img: "https://images.unsplash.com/photo-1492693859998-63ccf2ddafd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    style: { bottom: "12%", right: "4%", rotate: -5 },
  },
];

// ── Greeting words for typewriter-style reveal ────────────────────────────────
const TAGLINE = "Estamos ansiosos para dar mais destinos à sua vida.".split(" ");

// ── Stats ─────────────────────────────────────────────────────────────────────
const STATS = [
  { icon: Users,  value: "12M+",  label: "Viajantes" },
  { icon: MapPin, value: "500+",  label: "Destinos" },
  { icon: Globe,  value: "150+",  label: "Países" },
  { icon: Star,   value: "4.9★",  label: "Avaliação" },
];

// ── Floating destination card ─────────────────────────────────────────────────
function FloatingCard({ dest, delay }: { dest: typeof DESTINATIONS[0]; delay: number }) {
  const floatY = useMotionValue(0);
  const y = useSpring(floatY, { stiffness: 30, damping: 10 });

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const amplitude = 10 + Math.random() * 6;
    const period    = 3000 + Math.random() * 2000;
    const phase     = Math.random() * Math.PI * 2;

    const tick = (ts: number) => {
      if (!start) start = ts;
      floatY.set(Math.sin(((ts - start) / period) * Math.PI * 2 + phase) * amplitude);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [floatY]);

  // Separate position from rotate to avoid CSS transform conflicts
  const { rotate, ...posStyle } = dest.style;

  return (
    <motion.div
      className="absolute w-[160px] pointer-events-none select-none"
      style={{ ...posStyle as React.CSSProperties, y }}
      initial={{ opacity: 0, scale: 0.7, rotate: (rotate ?? 0) - 12 }}
      animate={{ opacity: 1, scale: 1, rotate: rotate ?? 0 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-sm bg-black/30">
        <img
          src={dest.img}
          alt={dest.name}
          className="w-full h-24 object-cover"
          loading="eager"
        />
        <div className="px-2.5 py-2 bg-[#0a0a0a]/90">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-xs font-semibold leading-tight">{dest.flag} {dest.name}</p>
              <p className="text-[#555] text-[10px]">{dest.country}</p>
            </div>
            <div className="flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 text-[#f59e0b] fill-[#f59e0b]" />
              <span className="text-[#f59e0b] text-[10px] font-semibold">{dest.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface WelcomeSplashProps {
  onStart: () => void;
}

export function WelcomeSplash({ onStart }: WelcomeSplashProps) {
  const [phase, setPhase] = useState<"in" | "ready" | "out">("in");
  const [showTagline, setShowTagline] = useState(false);
  const [showStats, setShowStats]     = useState(false);
  const [showCTA, setShowCTA]         = useState(false);
  const [wordIndex, setWordIndex]     = useState(0);
  const [exiting, setExiting]         = useState(false);

  // Sequence timings
  useEffect(() => {
    const t1 = setTimeout(() => setShowTagline(true),  1600);
    const t2 = setTimeout(() => setShowStats(true),    4000);
    const t3 = setTimeout(() => { setShowCTA(true); setPhase("ready"); }, 4800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Word-by-word reveal for tagline
  useEffect(() => {
    if (!showTagline) return;
    if (wordIndex >= TAGLINE.length) return;
    const t = setTimeout(() => setWordIndex(i => i + 1), 90);
    return () => clearTimeout(t);
  }, [showTagline, wordIndex]);

  const handleStart = () => {
    setExiting(true);
    setTimeout(onStart, 600);
  };

  // Mouse parallax for glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX  = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const glowY  = useSpring(mouseY, { stiffness: 40, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const cx = e.clientX - window.innerWidth  / 2;
    const cy = e.clientY - window.innerHeight / 2;
    mouseX.set(cx * 0.04);
    mouseY.set(cy * 0.04);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#000]"
      initial={{ opacity: 0 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: exiting ? 0.55 : 0.4, ease: "easeInOut" }}
      onMouseMove={handleMouseMove}
    >
      {/* ── Background grid ── */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139,92,246,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Radial glows ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ x: glowX, y: glowY }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)" }} />
      </motion.div>

      {/* ── Floating star particles ── */}
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width:  1 + (i % 3),
            height: 1 + (i % 3),
            left: `${(i * 37 + 11) % 100}%`,
            top:  `${(i * 53 + 7)  % 100}%`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4 + (i % 4) * 0.15, 0] }}
          transition={{ delay: i * 0.15, duration: 3 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* ── Floating destination cards ── */}
      {DESTINATIONS.map((dest, i) => (
        <FloatingCard key={dest.id} dest={dest} delay={0.3 + i * 0.12} />
      ))}

      {/* ── Center vignette (masks cards behind content) ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 55% 65% at 50% 50%, transparent 30%, #000 100%)" }} />

      {/* ── Central content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">

        {/* Logo badge */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 180, damping: 16 }}
          className="flex items-center gap-2.5 mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-6px] rounded-xl"
              style={{ background: "conic-gradient(from 0deg, #8b5cf6, #34d399, #8b5cf6)" }}
            />
            <div className="relative w-12 h-12 rounded-xl bg-[#000] flex items-center justify-center z-10">
              <Sparkles className="w-6 h-6 text-[#8b5cf6]" />
            </div>
          </div>
          <span className="text-white" style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Hotel<span className="bg-gradient-to-r from-[#8b5cf6] to-[#34d399] bg-clip-text text-transparent">Hub</span>
          </span>
        </motion.div>

        {/* Greeting badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full border border-[#8b5cf6]/30 bg-[#8b5cf6]/8"
        >
          <span className="text-base">👋</span>
          <span className="text-[#a78bfa] text-xs font-semibold tracking-wide uppercase">
            Olá, explorador
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="text-[#555] mb-1"
            style={{ fontSize: "1rem", fontWeight: 500 }}
          >
            Bem-vindo ao
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 1.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-white"
            style={{ fontSize: "clamp(2.6rem, 6vw, 4rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em" }}
          >
            Hotel
            <span className="bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#34d399] bg-clip-text text-transparent"
              style={{ WebkitTextStroke: "0px" }}>
              Hub
            </span>
          </motion.h1>
        </motion.div>

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: showTagline ? 1 : 0, opacity: showTagline ? 1 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-16 h-px mb-6 rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, #8b5cf6, #34d399, transparent)" }}
        />

        {/* Tagline — word by word */}
        <div className="min-h-[3.5rem] mb-8 px-4" style={{ maxWidth: 380 }}>
          <AnimatePresence>
            {showTagline && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[#a1a1aa] leading-relaxed"
                style={{ fontSize: "1rem" }}
              >
                {TAGLINE.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                    animate={i < wordIndex ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="inline-block mr-1"
                    style={{ color: i === TAGLINE.length - 1 ? "#c4b5fd" : undefined }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Stats */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex items-center gap-0 mb-8 bg-[#0a0a0a]/80 border border-[#1a1a1a] rounded-2xl overflow-hidden divide-x divide-[#1a1a1a] backdrop-blur-sm"
            >
              {STATS.map(({ icon: Icon, value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="flex flex-col items-center px-4 py-3 gap-0.5"
                >
                  <Icon className="w-3.5 h-3.5 text-[#8b5cf6] mb-1" />
                  <span className="text-white text-sm font-bold" style={{ letterSpacing: "-0.02em" }}>{value}</span>
                  <span className="text-[#555] text-[10px]">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Button */}
        <AnimatePresence>
          {showCTA && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="flex flex-col items-center gap-3"
            >
              <motion.button
                onClick={handleStart}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="relative group flex items-center gap-3 px-8 py-4 rounded-2xl overflow-hidden text-white"
                style={{ fontSize: "1rem", fontWeight: 700 }}
              >
                {/* Animated gradient background */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #8b5cf6, #a855f7, #34d399, #8b5cf6, #7c3aed)",
                    backgroundSize: "300% 300%",
                  }}
                />
                {/* Shimmer overlay */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)" }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-2xl shadow-[0_0_40px_rgba(139,92,246,0.6)] group-hover:shadow-[0_0_60px_rgba(139,92,246,0.8)] transition-shadow duration-300" />

                <span className="relative z-10">Começar minha jornada</span>
                <motion.div
                  className="relative z-10"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[#3a3a3a] text-xs"
              >
                Leva menos de 2 minutos · Grátis para sempre
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Skip link ── */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "ready" ? 1 : 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        onClick={handleStart}
        className="absolute bottom-6 right-6 text-[#333] hover:text-[#555] text-xs transition-colors"
      >
        Pular apresentação →
      </motion.button>

      {/* ── Progress dots ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
        {[0,1,2,3].map(i => (
          <motion.div
            key={i}
            className="h-1 rounded-full bg-[#222]"
            initial={{ width: 6 }}
            animate={{
              width: showCTA ? 6 : showStats ? (i <= 2 ? 20 : 6) : showTagline ? (i <= 1 ? 20 : 6) : (i === 0 ? 20 : 6),
              background: showCTA ? "#8b5cf6" : "#222",
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        ))}
      </div>
    </motion.div>
  );
}
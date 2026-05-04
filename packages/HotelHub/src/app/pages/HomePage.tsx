import { useRef, useState } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import {
  ArrowRight, Star, TrendingUp, Shield, HeadphonesIcon,
  ChevronLeft, ChevronRight, Users, MapPin, Building2, Quote
} from "lucide-react";
import { SearchBar } from "../components/SearchBar";
import { DestinationCard } from "../components/DestinationCard";
import { HotelCard } from "../components/HotelCard";
import { PackageCard } from "../components/PackageCard";
import { DESTINATIONS, HOTELS, PACKAGES, REVIEWS, STATS } from "../data/mock";

const HERO_BG = "https://images.unsplash.com/photo-1635752807994-212f7d1e678b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHBvb2wlMjBuaWdodCUyMGRhcmt8ZW58MXx8fHwxNzc3MTA4NjAzfDA&ixlib=rb-4.1.0&q=80&w=1920";

export function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ["0%", "30%"]);
  const textY = useTransform(scrollY, [0, 600], ["0%", "60%"]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const [activeReview, setActiveReview] = useState(0);

  return (
    <div className="min-h-screen bg-[#000000]">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden" style={{ position: "relative" }}>
        {/* Background */}
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-0 z-0"
        >
          <img
            src={HERO_BG}
            alt="Hero"
            className="w-full h-full object-cover"
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#000]/70 via-[#000]/50 to-[#000]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#000]/80 via-transparent to-transparent" />
          {/* Purple glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#8b5cf6]/15 blur-[120px] rounded-full" />
        </motion.div>

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#8b5cf6]/40"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}

        {/* Hero Content */}
        <motion.div
          style={{ y: textY, opacity }}
          className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16"
        >
          <div className="max-w-4xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 text-[#a78bfa] text-sm mb-6"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12 milhões de viajantes satisfeitos</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white mb-6"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em" }}
            >
              Descubra o mundo com{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#34d399] bg-clip-text text-transparent">
                  luxo e estilo
                </span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-[#8b5cf6] to-[#34d399]"
                />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-[#a1a1aa] mb-10 max-w-2xl"
              style={{ fontSize: "1.1rem", lineHeight: 1.7 }}
            >
              Hotéis premium, pacotes exclusivos e destinos inesquecíveis em um só lugar.
              Sua próxima aventura começa aqui.
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <SearchBar variant="hero" />
            </motion.div>

            {/* Quick links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-3 mt-5 flex-wrap"
            >
              <span className="text-[#555] text-xs">Popular:</span>
              {["Paris", "Bali", "Maldivas", "Tóquio", "Santorini"].map((dest) => (
                <Link
                  key={dest}
                  to={`/search?destination=${dest}`}
                  className="text-xs text-[#71717a] hover:text-[#a78bfa] transition-colors border-b border-[#333] hover:border-[#8b5cf6]/50 pb-0.5"
                >
                  {dest}
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-0 right-0 hidden lg:flex items-center gap-6 bg-[#0a0a0a]/80 backdrop-blur-xl border border-[#222222] rounded-2xl p-5"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="bg-gradient-to-r from-[#8b5cf6] to-[#34d399] bg-clip-text text-transparent" style={{ fontSize: "1.5rem", fontWeight: 800 }}>
                  {stat.value}
                </p>
                <p className="text-[#71717a] text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Mobile stats */}
      <div className="lg:hidden grid grid-cols-2 gap-3 px-4 py-6 bg-[#050505] border-y border-[#1a1a1a]">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center py-3 bg-[#0a0a0a] rounded-xl border border-[#1a1a1a]">
            <p className="bg-gradient-to-r from-[#8b5cf6] to-[#34d399] bg-clip-text text-transparent" style={{ fontSize: "1.4rem", fontWeight: 800 }}>
              {stat.value}
            </p>
            <p className="text-[#71717a] text-xs mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── DESTINATIONS ─────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-px bg-gradient-to-r from-[#8b5cf6] to-[#34d399]" />
              <span className="text-[#8b5cf6] text-xs uppercase tracking-widest">Explorar</span>
            </div>
            <h2 className="text-white">Destinos em Alta</h2>
            <p className="text-[#71717a] text-sm mt-1">Os lugares mais procurados pelos viajantes este mês</p>
          </div>
          <Link
            to="/destinations"
            className="hidden sm:flex items-center gap-2 text-[#8b5cf6] hover:text-[#a78bfa] text-sm transition-colors group"
          >
            Ver todos
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Masonry-like grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="col-span-2 row-span-2">
            <DestinationCard destination={DESTINATIONS[0]} index={0} size="lg" />
          </div>
          <DestinationCard destination={DESTINATIONS[1]} index={1} size="md" />
          <DestinationCard destination={DESTINATIONS[2]} index={2} size="md" />
          <DestinationCard destination={DESTINATIONS[3]} index={3} size="md" />
          <DestinationCard destination={DESTINATIONS[4]} index={4} size="md" />
        </div>

        {/* Mobile link */}
        <div className="flex justify-center mt-6 sm:hidden">
          <Link
            to="/destinations"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#333333] text-[#a1a1aa] text-sm"
          >
            Ver todos os destinos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── FEATURED PACKAGE ─────────────────────────────────── */}
      <section className="py-16 bg-[#050505] border-y border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-px bg-gradient-to-r from-[#34d399] to-[#8b5cf6]" />
                <span className="text-[#34d399] text-xs uppercase tracking-widest">Destaque da semana</span>
              </div>
              <h2 className="text-white">Pacote mais reservado</h2>
              <p className="text-[#71717a] text-sm mt-1">Oferta por tempo limitado</p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 bg-[#34d399]/10 border border-[#34d399]/30 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
              <span className="text-[#34d399] text-xs">Oferta limitada</span>
            </div>
          </div>
          <PackageCard pkg={PACKAGES[0]} featured={true} />
        </div>
      </section>

      {/* ── POPULAR HOTELS ───────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-px bg-gradient-to-r from-[#8b5cf6] to-transparent" />
              <span className="text-[#8b5cf6] text-xs uppercase tracking-widest">Escolhas Premiadas</span>
            </div>
            <h2 className="text-white">Hotéis mais amados</h2>
            <p className="text-[#71717a] text-sm mt-1">Avaliados com 9+ pelos nossos viajantes</p>
          </div>
          <Link
            to="/search"
            className="hidden sm:flex items-center gap-2 text-[#8b5cf6] hover:text-[#a78bfa] text-sm transition-colors group"
          >
            Ver todos
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {HOTELS.slice(0, 6).map((hotel, i) => (
            <HotelCard key={hotel.id} hotel={hotel} index={i} />
          ))}
        </div>
      </section>

      {/* ── ALL PACKAGES ─────────────────────────────────────── */}
      <section className="py-16 bg-[#050505] border-y border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-px bg-gradient-to-r from-[#34d399] to-transparent" />
                <span className="text-[#34d399] text-xs uppercase tracking-widest">Pacotes</span>
              </div>
              <h2 className="text-white">Viagens completas</h2>
              <p className="text-[#71717a] text-sm mt-1">Voo + Hotel + Experiências em um só lugar</p>
            </div>
            <Link to="/packages" className="hidden sm:flex items-center gap-2 text-[#34d399] hover:text-[#6ee7b7] text-sm transition-colors group">
              Ver todos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PACKAGES.slice(1).map((pkg, i) => (
              <PackageCard key={pkg.id} pkg={pkg} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY HOTELHUB ─────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-px bg-gradient-to-r from-transparent to-[#8b5cf6]" />
            <span className="text-[#8b5cf6] text-xs uppercase tracking-widest">Por que nós</span>
            <div className="w-6 h-px bg-gradient-to-l from-transparent to-[#8b5cf6]" />
          </div>
          <h2 className="text-white mb-2">A experiência que você merece</h2>
          <p className="text-[#71717a] text-sm">Construída para viajantes que exigem o melhor</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              color: "#8b5cf6",
              bg: "rgba(139,92,246,0.1)",
              title: "Preço Garantido",
              desc: "Encontrou mais barato? Reembolsamos a diferença. Sempre.",
            },
            {
              icon: HeadphonesIcon,
              color: "#34d399",
              bg: "rgba(52,211,153,0.1)",
              title: "Suporte 24/7",
              desc: "Nossa equipe está disponível a qualquer hora, em qualquer fuso horário.",
            },
            {
              icon: Star,
              color: "#f59e0b",
              bg: "rgba(245,158,11,0.1)",
              title: "Hotéis Verificados",
              desc: "Todos os parceiros passam por uma curadoria rigorosa de qualidade.",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-7 hover:border-[#8b5cf6]/30 transition-all group"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: feature.bg }}
              >
                <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
              </div>
              <h3 className="text-white mb-2">{feature.title}</h3>
              <p className="text-[#71717a] text-sm leading-relaxed">{feature.desc}</p>
              <div
                className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(to right, transparent, ${feature.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── REVIEWS ──────────────────────────────────────────── */}
      <section className="py-16 bg-[#050505] border-y border-[#1a1a1a] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-px bg-gradient-to-r from-[#8b5cf6] to-transparent" />
                <span className="text-[#8b5cf6] text-xs uppercase tracking-widest">Depoimentos</span>
              </div>
              <h2 className="text-white">O que nossos viajantes dizem</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveReview((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length)}
                className="p-2 rounded-xl border border-[#333] text-[#71717a] hover:text-white hover:border-[#8b5cf6]/50 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveReview((prev) => (prev + 1) % REVIEWS.length)}
                className="p-2 rounded-xl border border-[#333] text-[#71717a] hover:text-white hover:border-[#8b5cf6]/50 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REVIEWS.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-[#0a0a0a] border rounded-2xl p-6 transition-all ${
                  i === activeReview
                    ? "border-[#8b5cf6]/50 shadow-[0_0_30px_rgba(139,92,246,0.15)]"
                    : "border-[#1a1a1a]"
                }`}
              >
                <Quote className="w-6 h-6 text-[#8b5cf6]/50 mb-4" />
                <p className="text-[#d1d5db] text-sm leading-relaxed mb-5">{review.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#1a1a1a]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#8b5cf6] flex items-center justify-center text-white text-sm" style={{ fontWeight: 700 }}>
                    {review.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm" style={{ fontWeight: 600 }}>
                      {review.author} {review.country}
                    </p>
                    <p className="text-[#555] text-xs">{review.hotel} · {review.date}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1 bg-[#8b5cf6]/10 px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3 fill-[#8b5cf6] text-[#8b5cf6]" />
                    <span className="text-[#a78bfa] text-xs" style={{ fontWeight: 600 }}>{review.rating}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APP PROMO ────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-[#0f0a1e] via-[#0a0a0a] to-[#051910] border border-[#222222] rounded-3xl overflow-hidden p-10 lg:p-16">
          {/* Glow effects */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-[#8b5cf6]/15 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#34d399]/10 blur-[100px] rounded-full" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 text-[#a78bfa] text-xs mb-6">
                📱 App disponível
              </div>
              <h2 className="text-white mb-4" style={{ fontSize: "2rem" }}>
                Leve o HotelHub no seu bolso
              </h2>
              <p className="text-[#71717a] text-sm leading-relaxed mb-8 max-w-md">
                Gerencie suas reservas, descubra novos destinos e receba notificações exclusivas de promoções diretamente no seu smartphone.
              </p>

              <div className="flex items-center gap-3 mb-8">
                {[
                  { label: "Check-in Mobile", icon: "📲" },
                  { label: "Alertas de preço", icon: "🔔" },
                  { label: "Maps offline", icon: "🗺️" },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-2 bg-[#111111] border border-[#222222] rounded-xl px-3 py-2">
                    <span>{f.icon}</span>
                    <span className="text-[#a1a1aa] text-xs">{f.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-3 bg-[#111111] border border-[#333] hover:border-[#8b5cf6]/50 rounded-xl px-5 py-3 transition-all group">
                  <span className="text-2xl">🍎</span>
                  <div className="text-left">
                    <p className="text-[#555] text-xs">Disponível na</p>
                    <p className="text-white text-sm" style={{ fontWeight: 600 }}>App Store</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 bg-[#111111] border border-[#333] hover:border-[#34d399]/50 rounded-xl px-5 py-3 transition-all group">
                  <span className="text-2xl">▶️</span>
                  <div className="text-left">
                    <p className="text-[#555] text-xs">Disponível no</p>
                    <p className="text-white text-sm" style={{ fontWeight: 600 }}>Google Play</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Mobile Mockup */}
            <div className="relative shrink-0">
              <div className="w-[260px] h-[520px] bg-[#0a0a0a] border-2 border-[#2a2a2a] rounded-[40px] overflow-hidden relative shadow-[0_0_80px_rgba(139,92,246,0.3)]">
                {/* Phone screen */}
                <div className="absolute inset-0 bg-[#000]">
                  {/* Status bar */}
                  <div className="flex items-center justify-between px-5 pt-4 pb-2">
                    <span className="text-white text-xs" style={{ fontWeight: 600 }}>9:41</span>
                    <div className="w-20 h-5 bg-[#0a0a0a] rounded-full border border-[#2a2a2a]" />
                    <div className="flex items-center gap-1">
                      <div className="flex gap-0.5">
                        {[3, 4, 5, 6].map(h => <div key={h} className="w-0.5 bg-white rounded-full" style={{ height: h }} />)}
                      </div>
                      <div className="w-4 h-2 border border-white rounded-sm relative">
                        <div className="absolute inset-0.5 right-1 bg-white rounded-sm" />
                      </div>
                    </div>
                  </div>

                  {/* App content */}
                  <div className="px-4 pt-2">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-[#71717a] text-xs">Bem-vindo de volta</p>
                        <p className="text-white text-sm" style={{ fontWeight: 700 }}>Ângelo 👋</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#34d399]" />
                    </div>

                    {/* Search mini */}
                    <div className="flex items-center gap-2 bg-[#111111] rounded-xl px-3 py-2.5 mb-4">
                      <MapPin className="w-3.5 h-3.5 text-[#8b5cf6]" />
                      <span className="text-[#555] text-xs">Para onde você vai?</span>
                    </div>

                    {/* Upcoming booking */}
                    <div className="bg-gradient-to-br from-[#1a0a2e] to-[#0a1a1a] border border-[#2a2a2a] rounded-2xl p-3 mb-4">
                      <p className="text-[#8b5cf6] text-xs mb-1.5" style={{ fontWeight: 600 }}>Próxima viagem</p>
                      <div className="flex items-center gap-2">
                        <img src="https://images.unsplash.com/photo-1480843669328-3f7e37d196ae?w=60&q=80" alt="Paris" className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <p className="text-white text-xs" style={{ fontWeight: 600 }}>Paris, França</p>
                          <p className="text-[#71717a] text-xs">15–22 Jun · 2 hóspedes</p>
                        </div>
                        <div className="ml-auto">
                          <span className="text-[#34d399] text-xs bg-[#34d399]/10 px-2 py-0.5 rounded-full">Confirmado</span>
                        </div>
                      </div>
                    </div>

                    {/* Destinations row */}
                    <p className="text-white text-xs mb-2" style={{ fontWeight: 600 }}>Em alta</p>
                    <div className="flex gap-2 overflow-hidden">
                      {DESTINATIONS.slice(0, 3).map(dest => (
                        <div key={dest.id} className="shrink-0 w-20">
                          <div className="h-16 rounded-xl overflow-hidden mb-1">
                            <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                          </div>
                          <p className="text-white text-xs truncate" style={{ fontWeight: 500 }}>{dest.name}</p>
                          <p className="text-[#34d399] text-xs">R${dest.priceFrom}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom nav */}
                  <div className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-[#1a1a1a] flex items-center justify-around px-4 py-3">
                    {["🏠", "🔍", "❤️", "📋", "👤"].map((icon, i) => (
                      <button key={i} className={`flex flex-col items-center gap-0.5 ${i === 0 ? "text-[#8b5cf6]" : "text-[#555]"}`}>
                        <span className="text-sm">{icon}</span>
                        <div className={`w-1 h-1 rounded-full ${i === 0 ? "bg-[#8b5cf6]" : "bg-transparent"}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Glow */}
              <div className="absolute inset-0 -z-10 bg-[#8b5cf6]/20 blur-[50px] rounded-full scale-75" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#6d28d9] rounded-3xl p-10 lg:p-14 text-center overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20"
            style={{ background: "radial-gradient(circle at 30% 50%, #34d399, transparent 60%), radial-gradient(circle at 70% 50%, #a855f7, transparent 60%)" }}
          />
          <div className="relative z-10">
            <h2 className="text-white mb-3" style={{ fontSize: "2rem" }}>
              Pronto para sua próxima aventura?
            </h2>
            <p className="text-[#c4b5fd] mb-8 text-sm max-w-md mx-auto">
              Junte-se a mais de 12 milhões de viajantes e descubra o mundo com o HotelHub.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                to="/destinations"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#7c3aed] text-sm hover:bg-[#f3f4f6] transition-all shadow-lg"
                style={{ fontWeight: 600 }}
              >
                Explorar Destinos
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/packages"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 text-white text-sm hover:bg-white/10 transition-all"
              >
                Ver Pacotes
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
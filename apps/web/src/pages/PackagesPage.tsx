"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Search, SlidersHorizontal, Clock, Plane, Star, Check, ArrowRight, Sparkles, X } from "lucide-react";
import { PackageCard } from "../components/PackageCard";
import { PACKAGES } from "../data/mock";

const DURATIONS = ["Qualquer duração", "Até 7 dias", "8-14 dias", "15+ dias"];
const PRICE_RANGES = ["Qualquer preço", "Até R$ 2.000", "R$ 2.000–5.000", "R$ 5.000–10.000", "R$ 10.000+"];

export function PackagesPage() {
  const [search, setSearch] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("Qualquer duração");
  const [selectedPrice, setSelectedPrice] = useState("Qualquer preço");
  const [sortBy, setSortBy] = useState("popular");

  const filtered = PACKAGES.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#000] pt-16">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1609444074316-85c2478a6346?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMGx1eHVyeSUyMGhvdGVsJTIwaW50ZXJpb3IlMjBtb2Rlcm58ZW58MXx8fHwxNzc3MTA4NjA0fDA&ixlib=rb-4.1.0&q=80&w=1920"
            alt="Packages"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#000]/80 via-[#000]/60 to-[#000]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-[#8b5cf6]/15 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#34d399]/15 border border-[#34d399]/30 text-[#34d399] text-xs mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              Tudo incluído — Voo + Hotel + Experiências
            </div>
            <h1 className="text-white mb-3" style={{ fontSize: "3rem" }}>
              Pacotes de{" "}
              <span className="bg-gradient-to-r from-[#34d399] to-[#8b5cf6] bg-clip-text text-transparent">
                Viagem Completa
              </span>
            </h1>
            <p className="text-[#a1a1aa] text-sm max-w-lg mx-auto mb-8">
              Economize até 35% combinando passagem aérea, hotel e experiências exclusivas em um único pacote.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto flex items-center gap-3 bg-[#0a0a0a]/90 backdrop-blur-xl border border-[#2a2a2a] rounded-2xl px-4 py-3.5">
              <Search className="w-4 h-4 text-[#8b5cf6]" />
              <input
                type="text"
                placeholder="Buscar pacote ou destino..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent text-white placeholder-[#555] outline-none flex-1 text-sm"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters bar */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          <SlidersHorizontal className="w-4 h-4 text-[#555] shrink-0" />

          <select
            value={selectedDuration}
            onChange={e => setSelectedDuration(e.target.value)}
            className="bg-[#0a0a0a] border border-[#222] rounded-xl px-3 py-2 text-[#a1a1aa] text-sm outline-none cursor-pointer whitespace-nowrap"
          >
            {DURATIONS.map(d => <option key={d}>{d}</option>)}
          </select>

          <select
            value={selectedPrice}
            onChange={e => setSelectedPrice(e.target.value)}
            className="bg-[#0a0a0a] border border-[#222] rounded-xl px-3 py-2 text-[#a1a1aa] text-sm outline-none cursor-pointer whitespace-nowrap"
          >
            {PRICE_RANGES.map(p => <option key={p}>{p}</option>)}
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-[#0a0a0a] border border-[#222] rounded-xl px-3 py-2 text-[#a1a1aa] text-sm outline-none cursor-pointer whitespace-nowrap"
          >
            <option value="popular">Mais populares</option>
            <option value="price_asc">Menor preço</option>
            <option value="price_desc">Maior preço</option>
            <option value="discount">Maior desconto</option>
          </select>
        </div>

        {/* Why packages banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
          {[
            { icon: "✈️", title: "Passagem + Hotel", desc: "Melhor preço quando combinados" },
            { icon: "🎫", title: "Experiências incluídas", desc: "Tours, transfers e atrações" },
            { icon: "🔒", title: "Preço bloqueado", desc: "Sem surpresas no checkout" },
          ].map(item => (
            <div key={item.title} className="flex items-center gap-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3">
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="text-white text-sm" style={{ fontWeight: 600 }}>{item.title}</p>
                <p className="text-[#555] text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Packages grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            {filtered.map((pkg, i) => (
              <PackageCard key={pkg.id} pkg={pkg} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-20 text-center">
            <Plane className="w-12 h-12 text-[#333] mb-4" />
            <p className="text-[#555] text-sm">Nenhum pacote encontrado para "{search}"</p>
            <button onClick={() => setSearch("")} className="mt-3 text-[#8b5cf6] text-sm">Limpar busca</button>
          </div>
        )}

        {/* Custom package CTA */}
        <div className="mt-12 relative bg-gradient-to-br from-[#0f0a1e] to-[#050505] border border-[#222] rounded-2xl p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 20% 50%, #8b5cf6, transparent 50%)" }} />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-[#8b5cf6] text-xs uppercase tracking-widest mb-2">Não encontrou o que procurava?</p>
              <h3 className="text-white mb-2">Crie seu pacote personalizado</h3>
              <p className="text-[#71717a] text-sm max-w-md">
                Nossos especialistas em viagens montam um itinerário sob medida para você, com os melhores hotéis e experiências.
              </p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white text-sm hover:opacity-90 transition-all shadow-[0_0_30px_rgba(139,92,246,0.4)] whitespace-nowrap" style={{ fontWeight: 600 }}>
              Falar com especialista
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

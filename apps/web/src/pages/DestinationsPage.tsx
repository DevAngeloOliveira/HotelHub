"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Search, MapPin, TrendingUp, Globe } from "lucide-react";
import { DestinationCard } from "../components/DestinationCard";
import { DESTINATIONS } from "../data/mock";

const REGIONS = ["Todos", "Europa", "Ásia", "Américas", "Oceania", "Oriente Médio"];

const DESTINATION_REGIONS: Record<string, string> = {
  "1": "Europa",
  "2": "Ásia",
  "3": "Américas",
  "4": "Ásia",
  "5": "Oceania",
  "6": "Europa",
  "7": "Europa",
  "8": "Europa",
};

export function DestinationsPage() {
  const [search, setSearch] = useState("");
  const [activeRegion, setActiveRegion] = useState("Todos");

  const filtered = DESTINATIONS.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
                       d.country.toLowerCase().includes(search.toLowerCase());
    const matchRegion = activeRegion === "Todos" || DESTINATION_REGIONS[d.id] === activeRegion;
    return matchSearch && matchRegion;
  });

  return (
    <div className="min-h-screen bg-[#000] pt-16">
      {/* Hero */}
      <div className="relative bg-[#050505] border-b border-[#1a1a1a] py-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-[#8b5cf6]/8 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#34d399]/6 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 text-[#a78bfa] text-xs mb-4">
              <Globe className="w-3.5 h-3.5" />
              850+ destinos disponíveis
            </div>
            <h1 className="text-white mb-3">
              Explore o{" "}
              <span className="bg-gradient-to-r from-[#8b5cf6] to-[#34d399] bg-clip-text text-transparent">
                mundo inteiro
              </span>
            </h1>
            <p className="text-[#71717a] text-sm max-w-lg mx-auto">
              De metrópoles vibrantes a paraísos escondidos, encontre o destino perfeito para sua próxima aventura.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="flex items-center gap-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl px-4 py-3.5">
              <Search className="w-4 h-4 text-[#8b5cf6]" />
              <input
                type="text"
                placeholder="Buscar destino ou país..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent text-white placeholder-[#555] outline-none flex-1 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Region tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {REGIONS.map(region => (
            <button
              key={region}
              onClick={() => setActiveRegion(region)}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                activeRegion === region
                  ? "bg-[#8b5cf6]/20 border border-[#8b5cf6]/50 text-[#a78bfa]"
                  : "border border-[#1a1a1a] text-[#71717a] hover:text-[#a1a1aa] hover:border-[#333]"
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-4 h-4 text-[#8b5cf6]" />
          <p className="text-[#71717a] text-sm">
            <span className="text-white" style={{ fontWeight: 600 }}>{filtered.length}</span> destinos encontrados
          </p>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((dest, i) => (
              <DestinationCard key={dest.id} destination={dest} index={i} size="lg" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-20 text-center">
            <MapPin className="w-12 h-12 text-[#333] mb-4" />
            <p className="text-[#555] text-sm">Nenhum destino encontrado para "{search}"</p>
            <button onClick={() => setSearch("")} className="mt-3 text-[#8b5cf6] text-sm hover:text-[#a78bfa]">
              Limpar busca
            </button>
          </div>
        )}

        {/* Popular tags */}
        <div className="mt-16 p-6 bg-[#050505] border border-[#1a1a1a] rounded-2xl">
          <h3 className="text-white mb-4">Busca por experiência</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { tag: "Praia & Mar", emoji: "🏖️" },
              { tag: "Cultura & Arte", emoji: "🎭" },
              { tag: "Aventura", emoji: "🏔️" },
              { tag: "Gastronomia", emoji: "🍽️" },
              { tag: "Lua de mel", emoji: "💑" },
              { tag: "Família", emoji: "👨‍👩‍👧‍👦" },
              { tag: "Mochilão", emoji: "🎒" },
              { tag: "Negócios", emoji: "💼" },
              { tag: "Spa & Bem-estar", emoji: "🧘" },
              { tag: "Natureza", emoji: "🌿" },
            ].map(item => (
              <button
                key={item.tag}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#8b5cf6]/40 hover:text-[#a78bfa] text-[#71717a] text-sm transition-all"
              >
                <span>{item.emoji}</span>
                {item.tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

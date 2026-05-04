"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  SlidersHorizontal, Map, List, Grid3X3, X,
  Star, ChevronDown, ChevronUp, Wifi, Waves,
  Sparkles, Coffee, Car, Utensils, Search
} from "lucide-react";
import { HotelCard } from "../components/HotelCard";
import { SearchBar } from "../components/SearchBar";
import { HOTELS } from "../data/mock";

const AMENITY_FILTERS = [
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "pool", label: "Piscina", icon: Waves },
  { id: "spa", label: "Spa", icon: Sparkles },
  { id: "breakfast", label: "Café da manhã", icon: Coffee },
  { id: "parking", label: "Estacionamento", icon: Car },
  { id: "restaurant", label: "Restaurante", icon: Utensils },
];

const SORT_OPTIONS = [
  { value: "recommended", label: "Recomendados" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "rating", label: "Melhor avaliação" },
];

export function SearchPage() {
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination") || "Todos os destinos";
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("recommended");
  const [freeCancel, setFreeCancel] = useState(false);

  const toggleStar = (star: number) => {
    setSelectedStars(prev =>
      prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]
    );
  };

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const filteredHotels = [...HOTELS]
    .filter(h => {
      if (selectedStars.length > 0 && !selectedStars.includes(h.stars)) return false;
      if (h.pricePerNight < priceRange[0] || h.pricePerNight > priceRange[1]) return false;
      if (h.rating < minRating) return false;
      if (freeCancel && !h.freeCancel) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.pricePerNight - b.pricePerNight;
      if (sortBy === "price_desc") return b.pricePerNight - a.pricePerNight;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const activeFiltersCount =
    selectedStars.length +
    selectedAmenities.length +
    (minRating > 0 ? 1 : 0) +
    (freeCancel ? 1 : 0);

  const clearFilters = () => {
    setSelectedStars([]);
    setSelectedAmenities([]);
    setMinRating(0);
    setFreeCancel(false);
    setPriceRange([0, 2000]);
  };

  return (
    <div className="min-h-screen bg-[#000000] pt-16">
      {/* Top bar with search */}
      <div className="bg-[#050505] border-b border-[#1a1a1a] sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <SearchBar variant="compact" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* ── SIDEBAR FILTERS ── */}
          <AnimatePresence>
            {(filtersOpen || window.innerWidth >= 1024) && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-72 shrink-0 hidden lg:block"
              >
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 sticky top-36">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-white" style={{ fontSize: "0.9rem", fontWeight: 600 }}>Filtros</h3>
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 text-xs text-[#8b5cf6] hover:text-[#a78bfa] transition-colors"
                      >
                        <X className="w-3 h-3" />
                        Limpar ({activeFiltersCount})
                      </button>
                    )}
                  </div>

                  {/* Price range */}
                  <div className="mb-5 pb-5 border-b border-[#1a1a1a]">
                    <p className="text-[#a1a1aa] text-xs mb-3" style={{ fontWeight: 500 }}>Preço por noite</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#34d399] text-sm">R$ {priceRange[0]}</span>
                      <span className="text-[#34d399] text-sm">R$ {priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={2000}
                      value={priceRange[1]}
                      onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-[#8b5cf6]"
                    />
                  </div>

                  {/* Stars */}
                  <div className="mb-5 pb-5 border-b border-[#1a1a1a]">
                    <p className="text-[#a1a1aa] text-xs mb-3" style={{ fontWeight: 500 }}>Categoria do hotel</p>
                    <div className="flex flex-col gap-2">
                      {[5, 4, 3].map(star => (
                        <label key={star} className="flex items-center gap-2 cursor-pointer group">
                          <div
                            onClick={() => toggleStar(star)}
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${
                              selectedStars.includes(star)
                                ? "bg-[#8b5cf6] border-[#8b5cf6]"
                                : "border-[#333] group-hover:border-[#8b5cf6]/50"
                            }`}
                          >
                            {selectedStars.includes(star) && (
                              <div className="w-2 h-2 bg-white rounded-sm" />
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: star }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-[#f59e0b] text-[#f59e0b]" />
                            ))}
                          </div>
                          <span className="text-[#71717a] text-xs">{star} estrelas</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="mb-5 pb-5 border-b border-[#1a1a1a]">
                    <p className="text-[#a1a1aa] text-xs mb-3" style={{ fontWeight: 500 }}>Avaliação mínima</p>
                    <div className="flex gap-2">
                      {[7, 8, 9].map(rating => (
                        <button
                          key={rating}
                          onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                          className={`flex-1 py-2 rounded-xl text-xs transition-all border ${
                            minRating === rating
                              ? "bg-[#8b5cf6]/20 border-[#8b5cf6] text-[#a78bfa]"
                              : "border-[#222] text-[#71717a] hover:border-[#333]"
                          }`}
                        >
                          {rating}+
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mb-5 pb-5 border-b border-[#1a1a1a]">
                    <p className="text-[#a1a1aa] text-xs mb-3" style={{ fontWeight: 500 }}>Comodidades</p>
                    <div className="flex flex-col gap-2">
                      {AMENITY_FILTERS.map(amenity => (
                        <label key={amenity.id} className="flex items-center gap-2 cursor-pointer group">
                          <div
                            onClick={() => toggleAmenity(amenity.id)}
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${
                              selectedAmenities.includes(amenity.id)
                                ? "bg-[#8b5cf6] border-[#8b5cf6]"
                                : "border-[#333] group-hover:border-[#8b5cf6]/50"
                            }`}
                          >
                            {selectedAmenities.includes(amenity.id) && (
                              <div className="w-2 h-2 bg-white rounded-sm" />
                            )}
                          </div>
                          <amenity.icon className="w-3 h-3 text-[#555]" />
                          <span className="text-[#71717a] text-xs">{amenity.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Free cancel */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div
                        onClick={() => setFreeCancel(!freeCancel)}
                        className={`w-9 h-5 rounded-full transition-all relative cursor-pointer ${freeCancel ? "bg-[#8b5cf6]" : "bg-[#222]"}`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all ${freeCancel ? "left-4.5" : "left-0.5"}`}
                          style={{ left: freeCancel ? "calc(100% - 18px)" : "2px" }}
                        />
                      </div>
                      <span className="text-[#a1a1aa] text-xs">Cancelamento grátis</span>
                    </label>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* ── RESULTS ── */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h1 className="text-white" style={{ fontSize: "1.4rem", fontWeight: 700 }}>
                  Hotéis em{" "}
                  <span className="bg-gradient-to-r from-[#8b5cf6] to-[#34d399] bg-clip-text text-transparent">
                    {destination}
                  </span>
                </h1>
                <p className="text-[#71717a] text-sm">
                  {filteredHotels.length} propriedades encontradas
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl border border-[#333] text-[#a1a1aa] text-sm"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtros
                  {activeFiltersCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#8b5cf6] text-white text-xs flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-[#0a0a0a] border border-[#222] rounded-xl px-3 py-2 text-[#a1a1aa] text-sm outline-none cursor-pointer"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>

                {/* View toggle */}
                <div className="flex items-center bg-[#0a0a0a] border border-[#222] rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-[#8b5cf6]/20 text-[#a78bfa]" : "text-[#555] hover:text-[#a1a1aa]"}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-[#8b5cf6]/20 text-[#a78bfa]" : "text-[#555] hover:text-[#a1a1aa]"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filters chips */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {selectedStars.map(star => (
                  <span key={star} className="flex items-center gap-1.5 bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 text-[#a78bfa] text-xs px-3 py-1.5 rounded-full">
                    {star}★
                    <button onClick={() => toggleStar(star)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
                {minRating > 0 && (
                  <span className="flex items-center gap-1.5 bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 text-[#a78bfa] text-xs px-3 py-1.5 rounded-full">
                    Nota {minRating}+
                    <button onClick={() => setMinRating(0)}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {freeCancel && (
                  <span className="flex items-center gap-1.5 bg-[#34d399]/15 border border-[#34d399]/30 text-[#34d399] text-xs px-3 py-1.5 rounded-full">
                    Cancelamento grátis
                    <button onClick={() => setFreeCancel(false)}><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}

            {/* Hotel list */}
            {filteredHotels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-[#333]" />
                </div>
                <p className="text-[#71717a] text-sm">Nenhum hotel encontrado com esses filtros.</p>
                <button onClick={clearFilters} className="mt-4 text-[#8b5cf6] text-sm hover:text-[#a78bfa]">
                  Limpar filtros
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredHotels.map((hotel, i) => (
                  <HotelCard key={hotel.id} hotel={hotel} index={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredHotels.map((hotel, i) => (
                  <HotelCard key={hotel.id} hotel={hotel} variant="list" index={i} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredHotels.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button className="w-9 h-9 rounded-xl border border-[#222] text-[#555] hover:border-[#333] hover:text-[#a1a1aa] transition-all flex items-center justify-center">
                  ←
                </button>
                {[1, 2, 3, 4, 5].map(page => (
                  <button
                    key={page}
                    className={`w-9 h-9 rounded-xl border text-sm transition-all flex items-center justify-center ${
                      page === 1
                        ? "bg-[#8b5cf6]/20 border-[#8b5cf6] text-[#a78bfa]"
                        : "border-[#222] text-[#555] hover:border-[#333] hover:text-[#a1a1aa]"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <span className="text-[#555] text-sm">...</span>
                <button className="w-9 h-9 rounded-xl border border-[#222] text-[#555] hover:border-[#333] hover:text-[#a1a1aa] transition-all flex items-center justify-center">
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

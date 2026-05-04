"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { MapPin, Calendar, Users, Search, Hotel, Plane, Package, Car, ChevronDown } from "lucide-react";

const TABS = [
  { id: "hotels", label: "Hotéis", icon: Hotel },
  { id: "flights", label: "Voos", icon: Plane },
  { id: "packages", label: "Pacotes", icon: Package },
  { id: "cars", label: "Carros", icon: Car },
];

const POPULAR_DESTINATIONS = [
  "Paris, França",
  "Bali, Indonésia",
  "Nova York, EUA",
  "Tóquio, Japão",
  "Maldivas",
  "Santorini, Grécia",
  "Roma, Itália",
  "Amsterdam, Holanda",
];

interface SearchBarProps {
  variant?: "hero" | "compact";
}

export function SearchBar({ variant = "hero" }: SearchBarProps) {
  const [activeTab, setActiveTab] = useState("hotels");
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams({
      destination: destination || "Paris",
      checkIn: checkIn || "2026-06-15",
      checkOut: checkOut || "2026-06-22",
      guests: guests.toString(),
    });
    if (activeTab === "packages") {
      router.push("/packages");
    } else {
      router.push(`/search?${params.toString()}`);
    }
  };

  const filteredDests =
    destination.length > 0
      ? POPULAR_DESTINATIONS.filter((d) => d.toLowerCase().includes(destination.toLowerCase()))
      : POPULAR_DESTINATIONS;

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2 bg-[#111111] border border-[#333333] rounded-2xl p-2">
        <div className="flex items-center gap-2 flex-1 px-3">
          <MapPin className="w-4 h-4 text-[#8b5cf6] shrink-0" />
          <input
            type="text"
            placeholder="Para onde?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="bg-transparent text-white placeholder-[#555] outline-none w-full text-sm"
          />
        </div>
        <div className="w-px h-6 bg-[#333333]" />
        <div className="flex items-center gap-2 px-3">
          <Calendar className="w-4 h-4 text-[#8b5cf6] shrink-0" />
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="bg-transparent text-[#a1a1aa] outline-none text-sm"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white text-sm hover:opacity-90 transition-all flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          Buscar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center gap-1 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all relative ${
              activeTab === tab.id ? "text-white" : "text-[#71717a] hover:text-[#a1a1aa]"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 bg-[#111111] border border-[#333333] rounded-xl"
              />
            )}
            <tab.icon className="w-4 h-4 relative z-10" />
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      <motion.div
        layout
        className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-[#2a2a2a] rounded-2xl p-2 shadow-[0_8px_60px_rgba(0,0,0,0.6)] relative"
      >
        <div className="flex flex-col lg:flex-row gap-2">
          <div className="relative flex-1">
            <div
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-[#111111] transition-colors cursor-text group"
              onClick={() => setShowDestSuggestions(true)}
            >
              <div className="p-2 rounded-lg bg-[#8b5cf6]/15 shrink-0">
                <MapPin className="w-4 h-4 text-[#8b5cf6]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#71717a] text-xs mb-0.5">Destino</p>
                <input
                  type="text"
                  placeholder="Para onde você vai?"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setShowDestSuggestions(true);
                  }}
                  onFocus={() => setShowDestSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowDestSuggestions(false), 200)}
                  className="bg-transparent text-white placeholder-[#555] outline-none w-full text-sm"
                />
              </div>
            </div>

            {showDestSuggestions && filteredDests.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden z-50 shadow-[0_8px_40px_rgba(0,0,0,0.8)]"
              >
                {filteredDests.slice(0, 6).map((dest) => (
                  <button
                    key={dest}
                    onMouseDown={() => {
                      setDestination(dest);
                      setShowDestSuggestions(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1a1a1a] transition-colors text-left"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#8b5cf6] shrink-0" />
                    <span className="text-sm text-[#d1d5db]">{dest}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          <div className="hidden lg:block w-px bg-[#222222] my-2" />

          <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-[#111111] transition-colors flex-1">
            <div className="p-2 rounded-lg bg-[#34d399]/10 shrink-0">
              <Calendar className="w-4 h-4 text-[#34d399]" />
            </div>
            <div className="flex-1">
              <p className="text-[#71717a] text-xs mb-0.5">Check-in</p>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="bg-transparent text-sm outline-none w-full"
                style={{ colorScheme: "dark" }}
              />
            </div>
          </div>

          <div className="hidden lg:block w-px bg-[#222222] my-2" />

          <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-[#111111] transition-colors flex-1">
            <div className="p-2 rounded-lg bg-[#34d399]/10 shrink-0">
              <Calendar className="w-4 h-4 text-[#34d399]" />
            </div>
            <div className="flex-1">
              <p className="text-[#71717a] text-xs mb-0.5">Check-out</p>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="bg-transparent text-sm outline-none w-full"
                style={{ colorScheme: "dark" }}
              />
            </div>
          </div>

          <div className="hidden lg:block w-px bg-[#222222] my-2" />

          <div className="relative">
            <button
              onClick={() => setShowGuestPicker(!showGuestPicker)}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-[#111111] transition-colors w-full"
            >
              <div className="p-2 rounded-lg bg-[#8b5cf6]/15 shrink-0">
                <Users className="w-4 h-4 text-[#8b5cf6]" />
              </div>
              <div className="text-left">
                <p className="text-[#71717a] text-xs mb-0.5">Hóspedes</p>
                <p className="text-sm text-white">
                  {guests} {guests === 1 ? "hóspede" : "hóspedes"}
                </p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#71717a] ml-auto transition-transform ${
                  showGuestPicker ? "rotate-180" : ""
                }`}
              />
            </button>

            {showGuestPicker && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full right-0 mt-2 bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 z-50 shadow-[0_8px_40px_rgba(0,0,0,0.8)] min-w-[200px]"
              >
                {[
                  { label: "Adultos", sub: "+18 anos", key: "adults" },
                  { label: "Crianças", sub: "2-17 anos", key: "children" },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-3 border-b border-[#222222] last:border-0"
                  >
                    <div>
                      <p className="text-sm text-white">{item.label}</p>
                      <p className="text-xs text-[#71717a]">{item.sub}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-8 h-8 rounded-full border border-[#333333] text-white hover:border-[#8b5cf6] transition-colors flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="text-white text-sm w-4 text-center">{guests}</span>
                      <button
                        onClick={() => setGuests(Math.min(10, guests + 1))}
                        className="w-8 h-8 rounded-full border border-[#333333] text-white hover:border-[#8b5cf6] transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          <button
            onClick={handleSearch}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white hover:opacity-90 active:scale-95 transition-all shadow-[0_0_30px_rgba(139,92,246,0.4)] shrink-0 min-w-[130px]"
          >
            <Search className="w-4 h-4" />
            <span className="text-sm">Buscar</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

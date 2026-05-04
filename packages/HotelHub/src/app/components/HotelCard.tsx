import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { MapPin, Star, Heart, Wifi, Waves, Sparkles, Coffee, ArrowRight, ShieldCheck, Utensils } from "lucide-react";

interface Hotel {
  id: string;
  name: string;
  destination: string;
  image: string;
  stars: number;
  rating: number;
  reviews: number;
  pricePerNight: number;
  originalPrice?: number;
  amenities: string[];
  freeCancel: boolean;
  breakfast: boolean;
  badge?: string;
}

interface HotelCardProps {
  hotel: Hotel;
  variant?: "grid" | "list";
  index?: number;
}

const AMENITY_ICONS: Record<string, typeof Wifi> = {
  "Wi-Fi": Wifi,
  "Piscina": Waves,
  "Piscina Infinita": Waves,
  "Spa": Sparkles,
  "Restaurante": Utensils,
  "Café da Manhã": Coffee,
};

export function HotelCard({ hotel, variant = "grid", index = 0 }: HotelCardProps) {
  const [saved, setSaved] = useState(false);
  const discount = hotel.originalPrice
    ? Math.round((1 - hotel.pricePerNight / hotel.originalPrice) * 100)
    : 0;

  if (variant === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group flex gap-0 bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl overflow-hidden hover:border-[#8b5cf6]/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]"
      >
        {/* Image */}
        <div className="relative w-64 shrink-0 overflow-hidden">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0f0f0f]/30" />
          {hotel.badge && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#8b5cf6] text-white text-xs">
              {hotel.badge}
            </div>
          )}
          {discount > 0 && (
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-[#34d399] text-black text-xs" style={{ fontWeight: 700 }}>
              -{discount}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: hotel.stars }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#f59e0b] text-[#f59e0b]" />
                  ))}
                </div>
                <h3 className="text-white" style={{ fontSize: "1rem", fontWeight: 600 }}>{hotel.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-[#8b5cf6]" />
                  <span className="text-[#71717a] text-xs">{hotel.destination}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[#8b5cf6]/10 px-3 py-1.5 rounded-xl shrink-0">
                <span className="text-[#a78bfa]" style={{ fontSize: "1.1rem", fontWeight: 700 }}>{hotel.rating}</span>
                <div className="text-right">
                  <p className="text-[#a1a1aa] text-xs leading-none">Excelente</p>
                  <p className="text-[#555] text-xs">{hotel.reviews.toLocaleString()} avaliações</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex items-center gap-2 flex-wrap mt-3">
              {hotel.freeCancel && (
                <span className="flex items-center gap-1 text-xs text-[#34d399] bg-[#34d399]/10 px-2 py-1 rounded-lg">
                  <ShieldCheck className="w-3 h-3" />
                  Cancelamento grátis
                </span>
              )}
              {hotel.breakfast && (
                <span className="flex items-center gap-1 text-xs text-[#a78bfa] bg-[#8b5cf6]/10 px-2 py-1 rounded-lg">
                  <Coffee className="w-3 h-3" />
                  Café da manhã
                </span>
              )}
            </div>
          </div>

          <div className="flex items-end justify-between mt-4">
            <div>
              {hotel.originalPrice && (
                <p className="text-[#555] text-xs line-through">R$ {hotel.originalPrice}/noite</p>
              )}
              <div className="flex items-baseline gap-1">
                <span className="text-[#34d399]" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                  R$ {hotel.pricePerNight}
                </span>
                <span className="text-[#555] text-xs">/noite</span>
              </div>
              <p className="text-[#555] text-xs mt-0.5">Impostos incluídos</p>
            </div>
            <Link
              to={`/hotels/${hotel.id}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white text-sm hover:opacity-90 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              Ver Hotel
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="group bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl overflow-hidden hover:border-[#8b5cf6]/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.12)] hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
          style={{ transform: "scale(1)" }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          {hotel.badge && (
            <span className="px-2.5 py-1 rounded-lg bg-[#8b5cf6]/90 backdrop-blur-sm text-white text-xs">
              {hotel.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-[#34d399]/90 backdrop-blur-sm text-black text-xs ml-auto" style={{ fontWeight: 700 }}>
              -{discount}%
            </span>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={() => setSaved(!saved)}
          className="absolute top-3 right-3 p-2 rounded-full bg-[#000]/40 backdrop-blur-sm hover:bg-[#000]/60 transition-all"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${saved ? "fill-[#f43f5e] text-[#f43f5e]" : "text-white"}`}
          />
        </button>

        {/* Rating overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-[#000]/50 backdrop-blur-sm px-2.5 py-1.5 rounded-xl">
          <Star className="w-3 h-3 fill-[#f59e0b] text-[#f59e0b]" />
          <span className="text-white text-xs" style={{ fontWeight: 600 }}>{hotel.rating}</span>
          <span className="text-[#a1a1aa] text-xs">({hotel.reviews.toLocaleString()})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-1.5">
          {Array.from({ length: hotel.stars }).map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-[#f59e0b] text-[#f59e0b]" />
          ))}
        </div>

        <h3 className="text-white mb-1" style={{ fontSize: "0.95rem", fontWeight: 600 }}>
          {hotel.name}
        </h3>

        <div className="flex items-center gap-1 mb-3">
          <MapPin className="w-3 h-3 text-[#8b5cf6]" />
          <span className="text-[#71717a] text-xs">{hotel.destination}</span>
        </div>

        {/* Perks */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {hotel.freeCancel && (
            <span className="text-xs text-[#34d399] bg-[#34d399]/10 px-2 py-0.5 rounded-md flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5" />
              Cancelamento grátis
            </span>
          )}
          {hotel.breakfast && (
            <span className="text-xs text-[#a78bfa] bg-[#8b5cf6]/10 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Coffee className="w-2.5 h-2.5" />
              Café incluído
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between">
          <div>
            {hotel.originalPrice && (
              <p className="text-[#555] text-xs line-through">R$ {hotel.originalPrice}</p>
            )}
            <div className="flex items-baseline gap-0.5">
              <span className="text-[#34d399]" style={{ fontSize: "1.3rem", fontWeight: 700 }}>
                R$ {hotel.pricePerNight}
              </span>
              <span className="text-[#555] text-xs">/noite</span>
            </div>
          </div>
          <Link
            to={`/hotels/${hotel.id}`}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white text-xs hover:opacity-90 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          >
            Reservar
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

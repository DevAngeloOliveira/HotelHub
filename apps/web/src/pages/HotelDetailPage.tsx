"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Star, MapPin, Heart, Share2, Wifi, Waves, Sparkles, Coffee,
  ShieldCheck, ChevronLeft, ChevronRight, X, Users, Calendar,
  Check, ArrowRight, Building2, Clock, Award
} from "lucide-react";
import { HOTELS, ROOM_TYPES, REVIEWS } from "../data/mock";

export function HotelDetailPage() {
  const { id } = useParams();
  const hotel = HOTELS.find(h => h.id === id) || HOTELS[0];
  const [activePhoto, setActivePhoto] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState("2026-06-15");
  const [checkOut, setCheckOut] = useState("2026-06-22");
  const [guests, setGuests] = useState(2);
  const [bookingStep, setBookingStep] = useState<"idle" | "selecting" | "confirm" | "success">("idle");
  const [saved, setSaved] = useState(false);

  const nights = 7;
  const selectedRoomData = ROOM_TYPES.find(r => r.id === selectedRoom);
  const totalPrice = selectedRoomData ? selectedRoomData.price * nights : null;

  const AMENITY_ICONS: Record<string, typeof Wifi> = {
    "Wi-Fi": Wifi,
    "Piscina": Waves,
    "Spa": Sparkles,
    "Café da manhã": Coffee,
    "Academia": Award,
    "Estacionamento": Building2,
  };

  return (
    <div className="min-h-screen bg-[#000] pt-16">
      {/* ── PHOTO GALLERY ── */}
      <div className="relative">
        <div className="grid grid-cols-4 grid-rows-2 gap-1.5 h-[420px] px-0">
          {/* Main image */}
          <div
            className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden"
            onClick={() => { setActivePhoto(0); setLightboxOpen(true); }}
          >
            <img
              src={hotel.images?.[0] || hotel.image}
              alt={hotel.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-[#000]/20 hover:bg-[#000]/10 transition-colors" />
          </div>

          {/* Secondary images */}
          {(hotel.images || [hotel.image]).slice(1, 5).map((img, i) => (
            <div
              key={i}
              className="relative cursor-pointer overflow-hidden"
              onClick={() => { setActivePhoto(i + 1); setLightboxOpen(true); }}
            >
              <img
                src={img}
                alt={`${hotel.name} ${i + 2}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[#000]/20 hover:bg-[#000]/10 transition-colors" />
              {i === 3 && (hotel.images?.length || 1) > 5 && (
                <div className="absolute inset-0 bg-[#000]/60 flex items-center justify-center cursor-pointer">
                  <span className="text-white text-sm" style={{ fontWeight: 600 }}>+{(hotel.images?.length || 4) - 4} fotos</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Controls overlay */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={() => setSaved(!saved)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#000]/60 backdrop-blur-sm border border-white/10 text-sm text-white hover:bg-[#000]/80 transition-all"
          >
            <Heart className={`w-4 h-4 ${saved ? "fill-[#f43f5e] text-[#f43f5e]" : ""}`} />
            {saved ? "Salvo" : "Salvar"}
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#000]/60 backdrop-blur-sm border border-white/10 text-sm text-white hover:bg-[#000]/80 transition-all">
            <Share2 className="w-4 h-4" />
            Compartilhar
          </button>
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#000]/95 z-[100] flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button className="absolute top-4 right-4 p-2 rounded-xl bg-[#111] border border-[#333] text-white">
              <X className="w-5 h-5" />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-[#111] border border-[#333] text-white"
              onClick={e => { e.stopPropagation(); setActivePhoto(prev => (prev - 1 + (hotel.images?.length || 1)) % (hotel.images?.length || 1)); }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-[#111] border border-[#333] text-white"
              onClick={e => { e.stopPropagation(); setActivePhoto(prev => (prev + 1) % (hotel.images?.length || 1)); }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <img
              src={(hotel.images || [hotel.image])[activePhoto]}
              alt={hotel.name}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl"
              onClick={e => e.stopPropagation()}
            />
            <div className="absolute bottom-4 flex items-center gap-2">
              {(hotel.images || [hotel.image]).map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setActivePhoto(i); }}
                  className={`w-2 h-2 rounded-full transition-all ${i === activePhoto ? "bg-[#8b5cf6] scale-125" : "bg-[#555]"}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left column */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: hotel.stars }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                    ))}
                  </div>
                  {hotel.badge && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#8b5cf6]/20 border border-[#8b5cf6]/30 text-[#a78bfa] text-xs">
                      {hotel.badge}
                    </span>
                  )}
                </div>
                <h1 className="text-white mb-2">{hotel.name}</h1>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#8b5cf6]" />
                  <span className="text-[#a1a1aa] text-sm">{hotel.destination}</span>
                  <span className="text-[#333] mx-1">·</span>
                  <a href="#map" className="text-[#8b5cf6] text-sm hover:underline">Ver no mapa</a>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-center gap-2 justify-end mb-1">
                  <span className="text-white" style={{ fontSize: "1.4rem", fontWeight: 800 }}>{hotel.rating}</span>
                  <div className="bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 rounded-xl px-2 py-1">
                    <span className="text-[#a78bfa] text-xs">Excelente</span>
                  </div>
                </div>
                <p className="text-[#555] text-xs">{hotel.reviews.toLocaleString()} avaliações</p>
              </div>
            </div>

            {/* Perks */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              {hotel.freeCancel && (
                <div className="flex items-center gap-1.5 bg-[#34d399]/10 border border-[#34d399]/20 rounded-xl px-3 py-2">
                  <ShieldCheck className="w-4 h-4 text-[#34d399]" />
                  <span className="text-[#34d399] text-sm">Cancelamento gratuito</span>
                </div>
              )}
              {hotel.breakfast && (
                <div className="flex items-center gap-1.5 bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 rounded-xl px-3 py-2">
                  <Coffee className="w-4 h-4 text-[#a78bfa]" />
                  <span className="text-[#a78bfa] text-sm">Café da manhã incluído</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 mb-6">
              <h3 className="text-white mb-3">Sobre este hotel</h3>
              <p className="text-[#a1a1aa] text-sm leading-relaxed">{hotel.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 mb-6">
              <h3 className="text-white mb-4">Comodidades</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {hotel.amenities.map((amenity) => {
                  const Icon = AMENITY_ICONS[amenity] || Check;
                  return (
                    <div key={amenity} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#111111] border border-[#222] flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 text-[#8b5cf6]" />
                      </div>
                      <span className="text-[#a1a1aa] text-sm">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Room selection */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 mb-6" id="rooms">
              <h3 className="text-white mb-4">Tipos de Quarto</h3>
              <div className="flex flex-col gap-3">
                {ROOM_TYPES.map((room) => (
                  <motion.div
                    key={room.id}
                    whileHover={{ scale: 1.01 }}
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${
                      selectedRoom === room.id
                        ? "border-[#8b5cf6] bg-[#8b5cf6]/10"
                        : room.available
                        ? "border-[#1e1e1e] hover:border-[#333]"
                        : "border-[#1a1a1a] opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() => room.available && setSelectedRoom(room.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white" style={{ fontSize: "0.9rem" }}>{room.name}</h4>
                          {!room.available && (
                            <span className="text-xs text-[#555] bg-[#111] px-2 py-0.5 rounded">Indisponível</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#71717a] mb-2">
                          <span>{room.size}</span>
                          <span>·</span>
                          <span>{room.bed}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {room.guests} hóspedes
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {room.amenities.slice(0, 4).map(a => (
                            <span key={a} className="text-xs text-[#555] bg-[#111] border border-[#1a1a1a] px-2 py-0.5 rounded-lg">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[#34d399]" style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                          R$ {room.price}
                        </p>
                        <p className="text-[#555] text-xs">/noite</p>
                        {selectedRoom === room.id && (
                          <div className="mt-2 flex items-center gap-1 text-[#8b5cf6] text-xs">
                            <Check className="w-3 h-3" />
                            Selecionado
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white">Avaliações dos hóspedes</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[#a78bfa]" style={{ fontSize: "1.5rem", fontWeight: 800 }}>{hotel.rating}</span>
                  <div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(hotel.rating / 2) ? "fill-[#8b5cf6] text-[#8b5cf6]" : "text-[#333]"}`} />
                      ))}
                    </div>
                    <p className="text-[#555] text-xs">{hotel.reviews.toLocaleString()} avaliações</p>
                  </div>
                </div>
              </div>

              {/* Rating bars */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-6">
                {[
                  { label: "Limpeza", value: 9.8 },
                  { label: "Conforto", value: 9.5 },
                  { label: "Localização", value: 9.7 },
                  { label: "Atendimento", value: 9.6 },
                  { label: "Instalações", value: 9.4 },
                  { label: "Custo-benefício", value: 9.2 },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-[#71717a] text-xs w-24 shrink-0">{item.label}</span>
                    <div className="flex-1 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#34d399] rounded-full"
                        style={{ width: `${item.value * 10}%` }}
                      />
                    </div>
                    <span className="text-[#a78bfa] text-xs w-6 shrink-0">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Review cards */}
              <div className="flex flex-col gap-4">
                {REVIEWS.slice(0, 2).map(review => (
                  <div key={review.id} className="flex gap-4 p-4 bg-[#111111] rounded-xl border border-[#1a1a1a]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#8b5cf6] flex items-center justify-center text-white text-sm shrink-0" style={{ fontWeight: 700 }}>
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-sm" style={{ fontWeight: 600 }}>{review.author} {review.country}</span>
                        <span className="text-[#555] text-xs">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#8b5cf6] text-[#8b5cf6]" />
                        ))}
                        <span className="text-[#a78bfa] text-xs ml-1">{review.rating}</span>
                      </div>
                      <p className="text-[#a1a1aa] text-sm leading-relaxed">{review.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── BOOKING WIDGET ── */}
          <div className="w-80 shrink-0 hidden lg:block">
            <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-2xl p-6 sticky top-24 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              {/* Price */}
              <div className="mb-5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[#34d399]" style={{ fontSize: "1.8rem", fontWeight: 800 }}>
                    R$ {selectedRoomData?.price || hotel.pricePerNight}
                  </span>
                  <span className="text-[#555] text-sm">/noite</span>
                </div>
                {hotel.originalPrice && (
                  <p className="text-[#555] text-xs">
                    Era{" "}
                    <span className="line-through">R$ {hotel.originalPrice}</span>
                    <span className="text-[#34d399] ml-1">-{Math.round((1 - hotel.pricePerNight / hotel.originalPrice) * 100)}%</span>
                  </p>
                )}
              </div>

              {/* Date fields */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-[#111111] border border-[#222] rounded-xl p-3">
                  <p className="text-[#555] text-xs mb-1">Check-in</p>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={e => setCheckIn(e.target.value)}
                    className="bg-transparent text-white text-sm outline-none w-full"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
                <div className="bg-[#111111] border border-[#222] rounded-xl p-3">
                  <p className="text-[#555] text-xs mb-1">Check-out</p>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={e => setCheckOut(e.target.value)}
                    className="bg-transparent text-white text-sm outline-none w-full"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
              </div>

              <div className="bg-[#111111] border border-[#222] rounded-xl p-3 mb-4">
                <p className="text-[#555] text-xs mb-1">Hóspedes</p>
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">{guests} hóspede{guests > 1 ? "s" : ""}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-6 h-6 rounded-full border border-[#333] text-white text-xs flex items-center justify-center hover:border-[#8b5cf6] transition-colors">−</button>
                    <button onClick={() => setGuests(Math.min(8, guests + 1))} className="w-6 h-6 rounded-full border border-[#333] text-white text-xs flex items-center justify-center hover:border-[#8b5cf6] transition-colors">+</button>
                  </div>
                </div>
              </div>

              {/* Select room prompt */}
              {!selectedRoom && (
                <p className="text-[#71717a] text-xs text-center mb-4">
                  ↑ Selecione um tipo de quarto acima
                </p>
              )}

              {/* Price breakdown */}
              {totalPrice && (
                <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-3 mb-4">
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="text-[#71717a]">R$ {selectedRoomData?.price} × {nights} noites</span>
                    <span className="text-[#a1a1aa]">R$ {selectedRoomData!.price * nights}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="text-[#71717a]">Taxas e impostos</span>
                    <span className="text-[#a1a1aa]">R$ {Math.round(totalPrice * 0.1)}</span>
                  </div>
                  <div className="border-t border-[#222] pt-2 flex items-center justify-between">
                    <span className="text-white text-sm" style={{ fontWeight: 600 }}>Total</span>
                    <span className="text-[#34d399] text-sm" style={{ fontWeight: 700 }}>R$ {Math.round(totalPrice * 1.1)}</span>
                  </div>
                </div>
              )}

              {/* CTA */}
              <button
                onClick={() => selectedRoom && setBookingStep("success")}
                disabled={!selectedRoom}
                className={`w-full py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 ${
                  selectedRoom
                    ? "bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white hover:opacity-90 shadow-[0_0_30px_rgba(139,92,246,0.4)]"
                    : "bg-[#1a1a1a] text-[#555] cursor-not-allowed"
                }`}
                style={{ fontWeight: 600 }}
              >
                {selectedRoom ? "Reservar Agora" : "Selecione um Quarto"}
                {selectedRoom && <ArrowRight className="w-4 h-4" />}
              </button>

              {hotel.freeCancel && (
                <p className="text-center text-[#34d399] text-xs mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Cancelamento grátis até 48h antes
                </p>
              )}

              <p className="text-center text-[#555] text-xs mt-2">Nenhuma cobrança adicional</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success toast */}
      <AnimatePresence>
        {bookingStep === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0a0a0a] border border-[#34d399]/50 rounded-2xl px-6 py-4 shadow-[0_0_40px_rgba(52,211,153,0.2)] flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-[#34d399]/15 flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 text-[#34d399]" />
            </div>
            <div>
              <p className="text-white text-sm" style={{ fontWeight: 600 }}>Reserva confirmada! 🎉</p>
              <p className="text-[#71717a] text-xs">Redirecionando para suas reservas...</p>
            </div>
            <button onClick={() => setBookingStep("idle")}>
              <X className="w-4 h-4 text-[#555]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

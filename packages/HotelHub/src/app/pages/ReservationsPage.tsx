import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar, MapPin, Users, ChevronRight, Clock,
  CheckCircle2, XCircle, AlertCircle, ArrowUpRight,
  Download, MessageCircle, Star, X, Check, Compass
} from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";

const STATUS_CONFIG = {
  CONFIRMED: {
    label: "Confirmado",
    color: "text-[#34d399]",
    bg: "bg-[#34d399]/10 border-[#34d399]/20",
    icon: CheckCircle2,
    dot: "bg-[#34d399]",
  },
  PENDING: {
    label: "Pendente",
    color: "text-[#f59e0b]",
    bg: "bg-[#f59e0b]/10 border-[#f59e0b]/20",
    icon: AlertCircle,
    dot: "bg-[#f59e0b]",
  },
  CHECKED_IN: {
    label: "Check-in feito",
    color: "text-[#8b5cf6]",
    bg: "bg-[#8b5cf6]/10 border-[#8b5cf6]/20",
    icon: CheckCircle2,
    dot: "bg-[#8b5cf6]",
  },
  CHECKED_OUT: {
    label: "Concluído",
    color: "text-[#71717a]",
    bg: "bg-[#71717a]/10 border-[#71717a]/20",
    icon: CheckCircle2,
    dot: "bg-[#71717a]",
  },
  CANCELLED: {
    label: "Cancelado",
    color: "text-[#ef4444]",
    bg: "bg-[#ef4444]/10 border-[#ef4444]/20",
    icon: XCircle,
    dot: "bg-[#ef4444]",
  },
};

const TABS = ["todas", "ativas", "concluídas", "canceladas"];

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function getNights(checkIn: string, checkOut: string) {
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export function ReservationsPage() {
  const { user, userReservations } = useAuth();
  const [activeTab, setActiveTab] = useState("todas");
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const filtered = userReservations.filter(r => {
    if (activeTab === "ativas") return ["CONFIRMED", "PENDING", "CHECKED_IN"].includes(r.status);
    if (activeTab === "concluídas") return r.status === "CHECKED_OUT";
    if (activeTab === "canceladas") return r.status === "CANCELLED";
    return true;
  });

  const detail = userReservations.find(r => r.id === selectedReservation);

  const handleSubmitReview = () => {
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewOpen(false);
      setReviewSubmitted(false);
      setRating(0);
      setReviewText("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#000] pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white mb-1">Minhas Reservas</h1>
          <p className="text-[#71717a] text-sm">
            Gerencie todas as suas reservas em um só lugar
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total de viagens", value: userReservations.length, color: "#8b5cf6" },
            { label: "Ativas", value: userReservations.filter(r => ["CONFIRMED", "PENDING"].includes(r.status)).length, color: "#34d399" },
            { label: "Concluídas", value: userReservations.filter(r => r.status === "CHECKED_OUT").length, color: "#71717a" },
            { label: "Canceladas", value: userReservations.filter(r => r.status === "CANCELLED").length, color: "#ef4444" },
          ].map(stat => (
            <div key={stat.label} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4">
              <p className="text-2xl" style={{ color: stat.color, fontWeight: 800 }}>{stat.value}</p>
              <p className="text-[#71717a] text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-fit mb-6">
          <TabsList>
            {TABS.map(tab => (
              <TabsTrigger key={tab} value={tab}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Reservations list */}
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <Calendar className="w-12 h-12 text-[#333] mx-auto mb-4" />
                <p className="text-[#555] text-sm">Nenhuma reserva nesta categoria.</p>
                <Link to="/search" className="mt-4 inline-flex items-center gap-2 text-[#8b5cf6] text-sm hover:text-[#a78bfa]">
                  Explorar hotéis
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              filtered.map((res, i) => {
                const status = STATUS_CONFIG[res.status as keyof typeof STATUS_CONFIG];
                const nights = getNights(res.checkIn, res.checkOut);
                const StatusIcon = status.icon;
                const isSelected = selectedReservation === res.id;

                return (
                  <motion.div
                    key={res.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.05 }}
                    className={`bg-[#0a0a0a] border rounded-2xl overflow-hidden transition-all ${
                      isSelected
                        ? "border-[#8b5cf6]/50 shadow-[0_0_30px_rgba(139,92,246,0.1)]"
                        : "border-[#1a1a1a] hover:border-[#2a2a2a]"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="relative w-full md:w-48 h-40 md:h-auto shrink-0 overflow-hidden">
                        <img
                          src={res.hotelImage}
                          alt={res.hotelName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]/30 hidden md:block" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-5">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="text-white mb-1" style={{ fontSize: "1rem" }}>{res.hotelName}</h3>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-[#8b5cf6]" />
                              <span className="text-[#71717a] text-xs">{res.destination}</span>
                            </div>
                          </div>
                          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs ${status.color} ${status.bg}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-[#555]" />
                            <div>
                              <p className="text-[#555] text-xs">Check-in</p>
                              <p className="text-[#a1a1aa] text-xs">{formatDate(res.checkIn)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-[#555]" />
                            <div>
                              <p className="text-[#555] text-xs">Check-out</p>
                              <p className="text-[#a1a1aa] text-xs">{formatDate(res.checkOut)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-[#555]" />
                            <div>
                              <p className="text-[#555] text-xs">Duração</p>
                              <p className="text-[#a1a1aa] text-xs">{nights} noites</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-[#555]" />
                            <div>
                              <p className="text-[#555] text-xs">Hóspedes</p>
                              <p className="text-[#a1a1aa] text-xs">{res.guests} pessoa{res.guests > 1 ? "s" : ""}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div>
                            <p className="text-[#555] text-xs">{res.roomType}</p>
                            <div className="flex items-baseline gap-1">
                              <span className="text-[#34d399]" style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                                R$ {res.total.toLocaleString()}
                              </span>
                              <span className="text-[#555] text-xs">total</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[#555] text-xs font-mono bg-[#111] border border-[#1a1a1a] px-2 py-1 rounded-lg">
                              #{res.bookingCode}
                            </span>

                            {res.status === "CHECKED_OUT" && (
                              <button
                                onClick={() => setReviewOpen(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#8b5cf6]/30 text-[#a78bfa] text-xs hover:bg-[#8b5cf6]/10 transition-all"
                              >
                                <Star className="w-3 h-3" />
                                Avaliar
                              </button>
                            )}

                            {["CONFIRMED", "PENDING"].includes(res.status) && (
                              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#333] text-[#71717a] text-xs hover:text-[#ef4444] hover:border-[#ef4444]/30 transition-all">
                                Cancelar
                              </button>
                            )}

                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#333] text-[#71717a] text-xs hover:text-[#a1a1aa] transition-all">
                              <Download className="w-3 h-3" />
                              Voucher
                            </button>

                            <button
                              onClick={() => setSelectedReservation(isSelected ? null : res.id)}
                              className="p-1.5 rounded-xl border border-[#333] text-[#71717a] hover:text-[#a1a1aa] transition-all"
                            >
                              <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? "rotate-90" : ""}`} />
                            </button>
                          </div>
                        </div>

                        {/* Expanded details */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-[#1a1a1a] mt-4 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <p className="text-[#555] text-xs mb-1">Acompanhe sua reserva</p>
                                  <div className="flex flex-col gap-1">
                                    {["Reserva criada", "Pagamento confirmado", "Hotel notificado", res.status === "CHECKED_IN" ? "Check-in realizado" : "Aguardando check-in"].map((step, i) => (
                                      <div key={step} className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${i < 3 ? "bg-[#34d399]/20" : "bg-[#1a1a1a]"}`}>
                                          {i < 3 ? <Check className="w-2.5 h-2.5 text-[#34d399]" /> : <div className="w-1.5 h-1.5 rounded-full bg-[#333]" />}
                                        </div>
                                        <span className={`text-xs ${i < 3 ? "text-[#a1a1aa]" : "text-[#555]"}`}>{step}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-[#555] text-xs mb-2">Breakdown de preço</p>
                                  <div className="flex flex-col gap-1">
                                    <div className="flex justify-between text-xs">
                                      <span className="text-[#71717a]">Quarto ({nights} noites)</span>
                                      <span className="text-[#a1a1aa]">R$ {Math.round(res.total * 0.85).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span className="text-[#71717a]">Taxas</span>
                                      <span className="text-[#a1a1aa]">R$ {Math.round(res.total * 0.15).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs border-t border-[#1a1a1a] pt-1 mt-1">
                                      <span className="text-white" style={{ fontWeight: 600 }}>Total</span>
                                      <span className="text-[#34d399]" style={{ fontWeight: 600 }}>R$ {res.total.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-[#555] text-xs mb-2">Ações rápidas</p>
                                  <div className="flex flex-col gap-2">
                                    <button className="flex items-center gap-2 text-xs text-[#a1a1aa] hover:text-[#8b5cf6] transition-colors">
                                      <MessageCircle className="w-3 h-3" />
                                      Falar com suporte
                                    </button>
                                    <button className="flex items-center gap-2 text-xs text-[#a1a1aa] hover:text-[#8b5cf6] transition-colors">
                                      <Download className="w-3 h-3" />
                                      Baixar voucher PDF
                                    </button>
                                    <Link to={`/hotels/h1`} className="flex items-center gap-2 text-xs text-[#a1a1aa] hover:text-[#8b5cf6] transition-colors">
                                      <ArrowUpRight className="w-3 h-3" />
                                      Ver detalhes do hotel
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Review modal */}
      <AnimatePresence>
        {reviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#000]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setReviewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-md shadow-[0_0_60px_rgba(0,0,0,0.8)]"
            >
              {reviewSubmitted ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-[#34d399]/15 border border-[#34d399]/30 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-7 h-7 text-[#34d399]" />
                  </div>
                  <h3 className="text-white mb-1">Avaliação enviada!</h3>
                  <p className="text-[#71717a] text-sm">Obrigado pelo seu feedback.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-white">Avaliar sua estadia</h3>
                    <button onClick={() => setReviewOpen(false)} className="p-1.5 rounded-xl text-[#555] hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[#71717a] text-sm mb-4">Como foi sua experiência?</p>

                  <div className="flex items-center gap-2 mb-5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setRating(star)}>
                        <Star className={`w-8 h-8 transition-colors ${star <= rating ? "fill-[#f59e0b] text-[#f59e0b]" : "text-[#333]"}`} />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="text-[#f59e0b] text-sm ml-2">
                        {["", "Ruim", "Regular", "Bom", "Muito bom", "Excelente"][rating]}
                      </span>
                    )}
                  </div>

                  <textarea
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    placeholder="Conte sua experiência para outros viajantes..."
                    rows={4}
                    className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-white placeholder-[#555] text-sm outline-none resize-none focus:border-[#8b5cf6]/50 transition-colors mb-4"
                  />

                  <button
                    onClick={handleSubmitReview}
                    disabled={rating === 0}
                    className={`w-full py-3 rounded-xl text-sm transition-all ${
                      rating > 0
                        ? "bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white hover:opacity-90 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                        : "bg-[#1a1a1a] text-[#555] cursor-not-allowed"
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    Enviar avaliação
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
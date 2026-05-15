"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Check, ArrowRight, Clock, Tag } from "lucide-react";
import type { TravelPackage } from "@hotelhub/sdk";

function formatDuration(validFrom: string, validTo: string): string {
  const from = new Date(validFrom);
  const to = new Date(validTo);
  const nights = Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
  if (nights <= 0) return "Consulte datas";
  return `${nights} noite${nights > 1 ? "s" : ""}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

interface PackageCardProps {
  pkg: TravelPackage;
  index?: number;
  featured?: boolean;
}

export function PackageCard({ pkg, index = 0, featured = false }: PackageCardProps) {
  const duration = formatDuration(pkg.validFrom, pkg.validTo);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`group bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl overflow-hidden hover:border-[#8b5cf6]/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.12)] ${
        featured ? "lg:flex" : ""
      }`}
    >
      {/* Visual header — gradient em vez de imagem (sem campo image no backend) */}
      <div
        className={`relative overflow-hidden ${featured ? "lg:w-80 h-56 lg:h-auto" : "h-40"} flex items-center justify-center`}
        style={{
          background:
            "linear-gradient(135deg, #1a0a2e 0%, #0f0f1f 40%, #051910 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-30"
          style={{ background: "radial-gradient(circle at 30% 50%, #8b5cf6, transparent 60%), radial-gradient(circle at 70% 60%, #34d399, transparent 60%)" }}
        />

        <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
          {pkg.discountPercentage > 0 && (
            <span
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#34d399] to-[#10b981] text-black text-sm"
              style={{ fontWeight: 700 }}
            >
              -{pkg.discountPercentage}% OFF
            </span>
          )}
          {featured && (
            <span className="px-2.5 py-1 rounded-xl bg-[#8b5cf6]/30 border border-[#8b5cf6]/50 text-[#a78bfa] text-xs">
              ⭐ Destaque
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-[#000]/60 backdrop-blur-sm px-2.5 py-1.5 rounded-lg">
          <Clock className="w-3 h-3 text-[#a78bfa]" />
          <span className="text-white text-xs">{duration}</span>
        </div>
      </div>

      <div className={`p-5 flex flex-col ${featured ? "flex-1 justify-between" : ""}`}>
        <div>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0 pr-2">
              <h3 className="text-white" style={{ fontSize: "1rem", fontWeight: 700 }}>
                {pkg.name}
              </h3>
              {pkg.description && (
                <p className="text-[#71717a] text-xs mt-1 line-clamp-2">{pkg.description}</p>
              )}
            </div>
            {pkg.discountPercentage > 0 && (
              <div className="flex items-center gap-1 bg-[#34d399]/10 border border-[#34d399]/20 px-2 py-1 rounded-lg shrink-0">
                <Tag className="w-3 h-3 text-[#34d399]" />
                <span className="text-[#34d399] text-xs" style={{ fontWeight: 600 }}>
                  -{pkg.discountPercentage}%
                </span>
              </div>
            )}
          </div>

          {pkg.highlightedServices && pkg.highlightedServices.length > 0 && (
            <div className="grid grid-cols-1 gap-1.5 mb-4 mt-3">
              {pkg.highlightedServices
                .slice(0, featured ? pkg.highlightedServices.length : 3)
                .map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#34d399]/15 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-[#34d399]" />
                    </div>
                    <span className="text-xs text-[#a1a1aa]">{item}</span>
                  </div>
                ))}
              {!featured &&
                pkg.highlightedServices.length > 3 && (
                  <p className="text-xs text-[#8b5cf6]">
                    +{pkg.highlightedServices.length - 3} itens incluídos
                  </p>
                )}
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-[#555] mt-2">
            <span>
              {formatDate(pkg.validFrom)} → {formatDate(pkg.validTo)}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between mt-4">
          <div />
          <Link
            href={`/packages/${pkg.id}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white text-sm hover:opacity-90 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]"
          >
            Ver Pacote
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

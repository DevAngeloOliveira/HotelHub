"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { MapPin, Heart, ArrowRight, Tag } from "lucide-react";
import type { Hotel } from "@hotelhub/sdk";

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1635752807994-212f7d1e678b?w=800&q=80";

interface HotelCardProps {
  hotel: Hotel;
  variant?: "grid" | "list";
  index?: number;
}

export function HotelCard({ hotel, variant = "grid", index = 0 }: HotelCardProps) {
  const [saved, setSaved] = useState(false);
  const coverImage = hotel.imageUrls?.[0] ?? PLACEHOLDER_IMG;

  if (variant === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group flex gap-0 bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl overflow-hidden hover:border-[#8b5cf6]/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]"
      >
        <div className="relative w-64 shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0f0f0f]/30" />
          {hotel.category && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#8b5cf6] text-white text-xs">
              {hotel.category}
            </div>
          )}
        </div>

        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="text-white" style={{ fontSize: "1rem", fontWeight: 600 }}>
                  {hotel.name}
                </h3>
                {hotel.address && (
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-[#8b5cf6]" />
                    <span className="text-[#71717a] text-xs">{hotel.address}</span>
                  </div>
                )}
              </div>
            </div>

            {hotel.amenities && hotel.amenities.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mt-3">
                {hotel.amenities.slice(0, 4).map((amenity) => (
                  <span
                    key={amenity}
                    className="text-xs text-[#a1a1aa] bg-[#1a1a1a] border border-[#2a2a2a] px-2 py-1 rounded-lg"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-end justify-between mt-4">
            <div />
            <Link
              href={`/hotels/${hotel.id}`}
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="group bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl overflow-hidden hover:border-[#8b5cf6]/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.12)] hover:-translate-y-1"
    >
      <div className="relative h-52 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImage}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ transform: "scale(1)" }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />

        {hotel.category && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-lg bg-[#8b5cf6]/90 backdrop-blur-sm text-white text-xs">
              {hotel.category}
            </span>
          </div>
        )}

        <button
          onClick={() => setSaved(!saved)}
          className="absolute top-3 right-3 p-2 rounded-full bg-[#000]/40 backdrop-blur-sm hover:bg-[#000]/60 transition-all"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              saved ? "fill-[#f43f5e] text-[#f43f5e]" : "text-white"
            }`}
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-white mb-1" style={{ fontSize: "0.95rem", fontWeight: 600 }}>
          {hotel.name}
        </h3>

        {hotel.address && (
          <div className="flex items-center gap-1 mb-3">
            <MapPin className="w-3 h-3 text-[#8b5cf6]" />
            <span className="text-[#71717a] text-xs">{hotel.address}</span>
          </div>
        )}

        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {hotel.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="text-xs text-[#a1a1aa] bg-[#1a1a1a] border border-[#222] px-2 py-0.5 rounded-md flex items-center gap-1"
              >
                <Tag className="w-2.5 h-2.5 text-[#8b5cf6]" />
                {amenity}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-end justify-between">
          <div />
          <Link
            href={`/hotels/${hotel.id}`}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white text-xs hover:opacity-90 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          >
            Ver hotel
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

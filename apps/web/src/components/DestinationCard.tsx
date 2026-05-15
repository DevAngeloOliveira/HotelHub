"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Destination } from "@hotelhub/sdk";

interface DestinationCardProps {
  destination: Destination;
  index?: number;
  size?: "sm" | "md" | "lg";
}

export function DestinationCard({ destination, index = 0, size = "md" }: DestinationCardProps) {
  const heights = { sm: "h-44", md: "h-60", lg: "h-80" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl cursor-pointer"
    >
      <Link href={`/search?destination=${encodeURIComponent(destination.name)}`}>
        <div className={`relative ${heights[size]} overflow-hidden`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={destination.featuredImageUrl}
            alt={destination.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

          <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/0 to-[#8b5cf6]/0 group-hover:from-[#8b5cf6]/10 group-hover:to-transparent transition-all duration-500" />

          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-lg bg-[#111111]/80 backdrop-blur-sm border border-[#333333]/80 text-[#a78bfa] text-xs">
              {destination.category}
            </span>
          </div>

          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#000]/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-end justify-between">
              <div>
                <h3
                  className="text-white"
                  style={{ fontSize: "1.2rem", fontWeight: 700, letterSpacing: "-0.01em" }}
                >
                  {destination.name}
                </h3>
                <p className="text-[#a1a1aa] text-xs mt-0.5">{destination.country}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/10">
              <MapPin className="w-3 h-3 text-[#8b5cf6]" />
              <span className="text-[#a1a1aa] text-xs">
                {destination.city}, {destination.state}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

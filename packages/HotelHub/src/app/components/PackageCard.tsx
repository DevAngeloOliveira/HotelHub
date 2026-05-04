import { Link } from "react-router";
import { motion } from "motion/react";
import { Calendar, Star, Check, ArrowRight, Clock, Plane } from "lucide-react";

interface Package {
  id: string;
  title: string;
  destination: string;
  image: string;
  duration: string;
  hotel: string;
  stars: number;
  includes: string[];
  originalPrice: number;
  price: number;
  discount: number;
  rating: number;
  departures: string[];
}

interface PackageCardProps {
  pkg: Package;
  index?: number;
  featured?: boolean;
}

export function PackageCard({ pkg, index = 0, featured = false }: PackageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`group bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl overflow-hidden hover:border-[#8b5cf6]/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.12)] ${featured ? "lg:flex" : ""}`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${featured ? "lg:w-96 h-64 lg:h-auto" : "h-52"}`}>
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />

        {/* Discount badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#34d399] to-[#10b981] text-black text-xs" style={{ fontWeight: 700 }}>
            -{pkg.discount}% OFF
          </span>
          {featured && (
            <span className="px-2.5 py-1.5 rounded-xl bg-[#8b5cf6]/90 backdrop-blur-sm text-white text-xs">
              ⭐ Destaque
            </span>
          )}
        </div>

        {/* Duration overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-[#000]/60 backdrop-blur-sm px-2.5 py-1.5 rounded-lg">
          <Clock className="w-3 h-3 text-[#a78bfa]" />
          <span className="text-white text-xs">{pkg.duration}</span>
        </div>
      </div>

      {/* Content */}
      <div className={`p-5 flex flex-col ${featured ? "flex-1 justify-between" : ""}`}>
        <div>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-white" style={{ fontSize: "1rem", fontWeight: 700 }}>{pkg.title}</h3>
              <p className="text-[#71717a] text-xs mt-0.5">{pkg.destination}</p>
            </div>
            <div className="flex items-center gap-1 bg-[#8b5cf6]/10 px-2 py-1 rounded-lg">
              <Star className="w-3 h-3 fill-[#8b5cf6] text-[#8b5cf6]" />
              <span className="text-[#a78bfa] text-xs" style={{ fontWeight: 600 }}>{pkg.rating}</span>
            </div>
          </div>

          {/* Hotel */}
          <div className="flex items-center gap-1.5 mb-4 bg-[#111111] px-3 py-2 rounded-xl">
            <span className="text-xs text-[#71717a]">Hotel:</span>
            <span className="text-xs text-[#a78bfa]">{pkg.hotel}</span>
            <div className="flex items-center gap-0.5 ml-auto">
              {Array.from({ length: pkg.stars }).map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 fill-[#f59e0b] text-[#f59e0b]" />
              ))}
            </div>
          </div>

          {/* Includes */}
          <div className="grid grid-cols-1 gap-1.5 mb-4">
            {pkg.includes.slice(0, featured ? pkg.includes.length : 3).map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#34d399]/15 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-[#34d399]" />
                </div>
                <span className="text-xs text-[#a1a1aa]">{item}</span>
              </div>
            ))}
            {!featured && pkg.includes.length > 3 && (
              <p className="text-xs text-[#8b5cf6]">+{pkg.includes.length - 3} itens incluídos</p>
            )}
          </div>

          {/* Next departures */}
          {featured && (
            <div className="mb-4">
              <p className="text-xs text-[#71717a] mb-2 flex items-center gap-1.5">
                <Plane className="w-3 h-3" />
                Próximas saídas:
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {pkg.departures.map((dep) => (
                  <span key={dep} className="text-xs text-white bg-[#111111] border border-[#333333] px-2 py-1 rounded-lg">
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between mt-4">
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-[#555] text-xs">Era</p>
              <p className="text-[#555] text-xs line-through">R$ {pkg.originalPrice.toLocaleString()}</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[#34d399]" style={{ fontSize: "1.4rem", fontWeight: 700 }}>
                R$ {pkg.price.toLocaleString()}
              </span>
            </div>
            <p className="text-[#71717a] text-xs">por pessoa</p>
          </div>
          <Link
            to={`/packages`}
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

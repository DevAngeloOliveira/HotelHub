import Link from "next/link";
import {
  Sparkles,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const LINKS = {
  Empresa: [
    { label: "Sobre nós", href: "#" },
    { label: "Carreiras", href: "#" },
    { label: "Imprensa", href: "#" },
    { label: "Parceiros", href: "#" },
    { label: "Investidores", href: "#" },
  ],
  Produtos: [
    { label: "Hotéis", href: "/search" },
    { label: "Pacotes de Viagem", href: "/packages" },
    { label: "Destinos", href: "/destinations" },
    { label: "Programa de Fidelidade", href: "#" },
    { label: "App Mobile", href: "#" },
  ],
  Suporte: [
    { label: "Central de Ajuda", href: "#" },
    { label: "Cancelamentos", href: "#" },
    { label: "Fale Conosco", href: "#" },
    { label: "Termos de Uso", href: "#" },
    { label: "Privacidade", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-[#1a1a1a] mt-20">
      <div className="border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-white mb-1" style={{ fontSize: "1.3rem", fontWeight: 700 }}>
                Ofertas exclusivas para você
              </h3>
              <p className="text-[#71717a] text-sm">
                Receba promoções, novidades e destinos em alta na sua caixa de entrada.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full lg:w-auto max-w-md">
              <div className="flex-1 flex items-center gap-2 bg-[#111111] border border-[#222222] rounded-xl px-4 py-3">
                <Mail className="w-4 h-4 text-[#8b5cf6] shrink-0" />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="bg-transparent text-white placeholder-[#555] outline-none flex-1 text-sm"
                />
              </div>
              <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white text-sm hover:opacity-90 transition-all whitespace-nowrap shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                Inscrever
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6] to-[#34d399] rounded-lg rotate-6" />
                <div className="absolute inset-0 bg-[#000000] rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
                </div>
              </div>
              <span className="text-white" style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                Hotel
                <span className="bg-gradient-to-r from-[#8b5cf6] to-[#34d399] bg-clip-text text-transparent">
                  Hub
                </span>
              </span>
            </Link>
            <p className="text-[#71717a] text-sm leading-relaxed mb-6 max-w-xs">
              A plataforma de viagens mais moderna do Brasil. Descubra hotéis, destinos e pacotes
              inesquecíveis.
            </p>

            <div className="flex flex-col gap-2 mb-6">
              <a
                href="tel:+551140020022"
                className="flex items-center gap-2 text-[#71717a] hover:text-[#a78bfa] transition-colors text-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                0800 400 2002
              </a>
              <a
                href="mailto:suporte@hotelhub.com"
                className="flex items-center gap-2 text-[#71717a] hover:text-[#a78bfa] transition-colors text-sm"
              >
                <Mail className="w-3.5 h-3.5" />
                suporte@hotelhub.com
              </a>
              <div className="flex items-center gap-2 text-[#71717a] text-sm">
                <MapPin className="w-3.5 h-3.5" />
                São Paulo, Brasil
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[Instagram, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-[#111111] border border-[#222222] flex items-center justify-center text-[#71717a] hover:text-[#a78bfa] hover:border-[#8b5cf6]/50 transition-all"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white text-sm mb-4" style={{ fontWeight: 600 }}>
                {title}
              </h4>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[#71717a] hover:text-[#a78bfa] transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#555] text-xs">© 2026 HotelHub. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            {["Visa", "Mastercard", "Pix", "Apple Pay"].map((method) => (
              <span
                key={method}
                className="text-[#555] text-xs bg-[#111111] border border-[#222222] px-2 py-1 rounded"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

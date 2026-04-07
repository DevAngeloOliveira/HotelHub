import { AuthForms } from "@/components/auth-forms";

export const metadata = { title: "HotelHub - Entrar" };

export default function LoginPage() {
  return (
    <div className="grid min-h-[72vh] gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <section className="space-y-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-(--hh-text-subtle)">
          Acesso autenticado
        </p>
        <h1 className="hh-display max-w-2xl text-[52px] leading-14.5 text-(--hh-text)">
          Entre para acompanhar reservas, perfil e operação do catálogo.
        </h1>
        <p className="max-w-xl text-[18px] leading-7.5 text-(--hh-text-muted)">
          O fluxo de autenticação da API segue o mesmo contrato do produto: acesso por
          email e senha, sem expor detalhes internos da sessão.
        </p>
      </section>

      <div className="flex justify-center lg:justify-end">
        <AuthForms />
      </div>
    </div>
  );
}

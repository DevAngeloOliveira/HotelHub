import { createBrowserRouter } from "react-router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import { HotelDetailPage } from "./pages/HotelDetailPage";
import { DestinationsPage } from "./pages/DestinationsPage";
import { PackagesPage } from "./pages/PackagesPage";
import { ReservationsPage } from "./pages/ReservationsPage";
import { AuthPage } from "./pages/AuthPage";

function Layout({
  children,
  hideFooter = false,
}: {
  children: React.ReactNode;
  hideFooter?: boolean;
}) {
  return (
    <div className="min-h-screen bg-[#000000] flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <HomePage />
      </Layout>
    ),
  },
  {
    path: "/search",
    element: (
      <Layout>
        <SearchPage />
      </Layout>
    ),
  },
  {
    path: "/hotels/:id",
    element: (
      <Layout>
        <HotelDetailPage />
      </Layout>
    ),
  },
  {
    path: "/destinations",
    element: (
      <Layout>
        <DestinationsPage />
      </Layout>
    ),
  },
  {
    path: "/packages",
    element: (
      <Layout>
        <PackagesPage />
      </Layout>
    ),
  },
  {
    path: "/reservations",
    element: (
      <Layout>
        <ProtectedRoute>
          <ReservationsPage />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: "/auth",
    element: (
      <Layout hideFooter>
        <AuthPage />
      </Layout>
    ),
  },
  {
    path: "*",
    element: (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white mb-2">404</h1>
          <p className="text-[#71717a] text-sm mb-6">Página não encontrada.</p>
          <a
            href="/"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white text-sm hover:opacity-90 transition-all"
          >
            Voltar ao início
          </a>
        </div>
      </Layout>
    ),
  },
]);

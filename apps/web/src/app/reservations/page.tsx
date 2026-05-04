import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ReservationsPage } from "@/pages/ReservationsPage";

export default function Page() {
  return (
    <ProtectedRoute>
      <ReservationsPage />
    </ProtectedRoute>
  );
}

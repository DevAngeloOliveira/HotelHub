"use client";

import { useTransition } from "react";
import { buttonClassName } from "@/components/ui";
import { cancelReservationAction } from "@/actions/reservation-actions";

export function CancelButton({ reservationId }: { reservationId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleCancel() {
    startTransition(async () => {
      const result = await cancelReservationAction(reservationId);
      if (result?.error) {
        alert(result.error);
      }
    });
  }

  return (
    <button
      onClick={handleCancel}
      disabled={isPending}
      className={buttonClassName("destructive", "sm")}
    >
      {isPending ? "Cancelando..." : "Cancelar reserva"}
    </button>
  );
}

import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { getFriendlyErrorMessage, useHotelHub } from "../state/hotelhub-provider";
import { ReservationCard } from "../components/content-cards";
import { EmptyState, Modal, ScreenContainer, SectionHeader } from "../components/primitives";
import { spacing } from "../theme/tokens";

export function ReservationsScreen() {
  const { reservations, cancelReservation } = useHotelHub();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedReservation = useMemo(
    () => reservations.find((reservation) => reservation.id === pendingId) ?? null,
    [pendingId, reservations],
  );

  return (
    <>
      <ScreenContainer>
        <SectionHeader
          eyebrow="Historico"
          title="Minhas reservas"
          subtitle="Lista consolidada das reservas do usuario autenticado ou do fallback local quando a API protegida nao estiver configurada."
        />

        <View style={styles.listWrap}>
          {reservations.length > 0 ? (
            reservations.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} onCancel={reservation.status === "CONFIRMED" ? () => setPendingId(reservation.id) : undefined} />
            ))
          ) : (
            <EmptyState
              title="Nenhuma reserva ainda"
              message="Suas reservas confirmadas aparecerao aqui assim que o checkout for concluido."
            />
          )}
        </View>
      </ScreenContainer>

      <Modal
        visible={Boolean(selectedReservation)}
        title="Cancelar reserva"
        message={error ?? "O cancelamento e permitido apenas antes da data de check-in. Deseja continuar?"}
        confirmLabel="Confirmar cancelamento"
        onCancel={() => {
          setPendingId(null);
          setError(null);
        }}
        onConfirm={async () => {
          if (!selectedReservation) return;
          try {
            await cancelReservation(selectedReservation.id);
            setPendingId(null);
            setError(null);
          } catch (requestError) {
            setError(getFriendlyErrorMessage(requestError));
          }
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  listWrap: {
    gap: spacing.md,
  },
});

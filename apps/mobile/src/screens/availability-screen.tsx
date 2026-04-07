import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { addDaysToToday, type AvailableRoom, validateReservationWindow } from "../domain/hotelhub";
import { getHotelAvailability, getHotelDetails, MobileApiError } from "../lib/api";
import { getFriendlyErrorMessage, useHotelHub } from "../state/hotelhub-provider";
import { RoomCard } from "../components/content-cards";
import { AlertBanner, Button, DateRangeField, EmptyState, ScreenContainer, SectionHeader, SkeletonCard } from "../components/primitives";
import { spacing } from "../theme/tokens";

export function AvailabilityScreen() {
  const { id, checkInDate: qpCheckIn, checkOutDate: qpCheckOut, guestCount: qpGuestCount } = useLocalSearchParams<{
    id: string;
    checkInDate?: string;
    checkOutDate?: string;
    guestCount?: string;
  }>();
  const { allReservations } = useHotelHub();

  const [title, setTitle] = useState("");
  const [checkInDate, setCheckInDate] = useState(qpCheckIn ?? addDaysToToday(7));
  const [checkOutDate, setCheckOutDate] = useState(qpCheckOut ?? addDaysToToday(10));
  const [guestCount, setGuestCount] = useState(qpGuestCount ?? "2");
  const [rooms, setRooms] = useState<AvailableRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const validationError = useMemo(
    () => validateReservationWindow(checkInDate, checkOutDate),
    [checkInDate, checkOutDate],
  );
  const guestCountNumber = Math.max(1, Number.parseInt(guestCount, 10) || 1);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const hotel = await getHotelDetails(id);
        if (active) setTitle(hotel.name);
      } catch (requestError) {
        if (active && requestError instanceof MobileApiError && requestError.status === 404) {
          setError("Hotel nao encontrado.");
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (validationError) {
      setRooms([]);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const result = await getHotelAvailability(
          id,
          { checkInDate, checkOutDate, guestCount: guestCountNumber },
          allReservations,
        );
        if (active) setRooms(result);
      } catch (requestError) {
        if (active) {
          setRooms([]);
          setError(getFriendlyErrorMessage(requestError));
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [allReservations, checkInDate, checkOutDate, guestCountNumber, id, validationError]);

  return (
    <ScreenContainer>
      <SectionHeader
        eyebrow="Disponibilidade"
        title={title || "Consultar quartos"}
        subtitle="Retornamos apenas categorias reservaveis para o periodo. Reservas confirmadas sobrepostas reduzem o saldo disponivel."
      />

      <View style={styles.filterWrap}>
        <DateRangeField
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          guestCount={guestCount}
          onCheckInChange={setCheckInDate}
          onCheckOutChange={setCheckOutDate}
          onGuestCountChange={setGuestCount}
        />
        <Button
          label="Aplicar periodo"
          variant="secondary"
          onPress={() =>
            router.setParams({
              checkInDate,
              checkOutDate,
              guestCount,
            })
          }
        />
      </View>

      {validationError ? (
        <AlertBanner tone="error" title="Periodo invalido" message={validationError} />
      ) : null}
      {error ? <AlertBanner tone="warning" title="Nao foi possivel atualizar" message={error} /> : null}

      <View style={styles.listWrap}>
        {loading ? (
          Array.from({ length: 2 }).map((_, index) => <SkeletonCard key={index} />)
        ) : rooms.length > 0 ? (
          rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onPress={() =>
                router.push({
                  pathname: "/reservations/create",
                  params: {
                    hotelId: id,
                    roomId: room.id,
                    checkInDate,
                    checkOutDate,
                    guestCount: String(guestCountNumber),
                  },
                })
              }
            />
          ))
        ) : (
          <EmptyState
            title="Sem disponibilidade"
            message="Nenhum quarto atende o periodo e a ocupacao informados."
            primaryLabel="Tentar novas datas"
            onPrimaryPress={() => {
              setCheckInDate(addDaysToToday(14));
              setCheckOutDate(addDaysToToday(17));
              setGuestCount("2");
            }}
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  filterWrap: {
    gap: spacing.md,
  },
  listWrap: {
    gap: spacing.md,
  },
});

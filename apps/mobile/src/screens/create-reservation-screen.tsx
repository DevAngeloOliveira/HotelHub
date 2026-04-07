import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { daysBetween, type Hotel, type Room } from "../domain/hotelhub";
import { getHotelDetails, MobileApiError } from "../lib/api";
import { formatCurrency, summarizeDateRange } from "../lib/format";
import { BottomSheet, Button, EmptyState, ScreenContainer } from "../components/primitives";
import { getFriendlyErrorMessage, useHotelHub } from "../state/hotelhub-provider";
import { colors, fontFamilies, spacing, typeScale } from "../theme/tokens";

export function CreateReservationScreen() {
  const params = useLocalSearchParams<{
    hotelId: string;
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    guestCount: string;
  }>();
  const { createReservation } = useHotelHub();
  const [hotel, setHotel] = useState<(Hotel & { rooms: Room[] }) | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const result = await getHotelDetails(params.hotelId);
        const selectedRoom = result.rooms.find((candidate) => candidate.id === params.roomId) ?? null;
        if (active) {
          setHotel(result);
          setRoom(selectedRoom);
        }
      } catch (requestError) {
        if (active && requestError instanceof MobileApiError) {
          setError(requestError.message);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [params.hotelId, params.roomId]);

  const nights = useMemo(() => daysBetween(params.checkInDate, params.checkOutDate), [params.checkInDate, params.checkOutDate]);
  const total = useMemo(() => (room ? room.pricePerNight * nights : 0), [nights, room]);

  if (!hotel || !room) {
    return (
      <ScreenContainer contentStyle={styles.fullHeight}>
        <EmptyState
          title="Resumo indisponivel"
          message={error ?? "Nao foi possivel montar a confirmacao desta reserva."}
          primaryLabel="Voltar"
          onPrimaryPress={() => router.back()}
        />
      </ScreenContainer>
    );
  }

  return (
    <View style={styles.fullScreen}>
      <BottomSheet
        title="Confirmar reserva"
        subtitle="Resumo da estadia em formato de bottom sheet, conforme o design system mobile."
      >
        <View style={styles.group}>
          <Text style={styles.hotelName}>{hotel.name}</Text>
          <Text style={styles.address}>{hotel.address}</Text>
        </View>

        <View style={styles.summaryCard}>
          <SummaryRow label="Quarto" value={room.name} />
          <SummaryRow label="Tipo" value={room.type} />
          <SummaryRow label="Periodo" value={summarizeDateRange(params.checkInDate, params.checkOutDate)} />
          <SummaryRow label="Hospedes" value={params.guestCount} />
          <SummaryRow label="Noites" value={String(nights)} />
        </View>

        <View style={styles.summaryCard}>
          <SummaryRow label={`${formatCurrency(room.pricePerNight)} x ${nights} noite${nights === 1 ? "" : "s"}`} value={formatCurrency(total)} />
          <SummaryRow label="Politica" value="Cancelamento antes do check-in" />
        </View>

        <View style={styles.totalWrap}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.actions}>
          <Button label="Voltar" variant="secondary" onPress={() => router.back()} style={styles.flexFill} />
          <Button
            label="Confirmar"
            loading={submitting}
            onPress={async () => {
              try {
                setSubmitting(true);
                setError(null);
                await createReservation({
                  hotelId: params.hotelId,
                  roomId: params.roomId,
                  checkInDate: params.checkInDate,
                  checkOutDate: params.checkOutDate,
                  guestCount: Number(params.guestCount),
                });
                router.replace("/(tabs)/reservations");
              } catch (requestError) {
                setError(getFriendlyErrorMessage(requestError));
              } finally {
                setSubmitting(false);
              }
            }}
            style={styles.flexFill}
          />
        </View>
      </BottomSheet>
    </View>
  );
}

function SummaryRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <View style={styles.rowBetween}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  fullHeight: {
    minHeight: "100%",
    justifyContent: "center",
  },
  group: {
    gap: 4,
  },
  hotelName: {
    ...typeScale.displayMd,
    color: colors.text,
  },
  address: {
    ...typeScale.bodySm,
    color: colors.textMuted,
  },
  summaryCard: {
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.md,
    gap: spacing.sm,
  },
  totalWrap: {
    gap: 4,
  },
  totalLabel: {
    ...typeScale.labelSm,
    color: colors.textMuted,
    textTransform: "uppercase",
  },
  totalValue: {
    fontSize: 34,
    lineHeight: 40,
    fontFamily: fontFamilies.uiBold,
    color: colors.primaryAction,
  },
  errorText: {
    ...typeScale.bodySm,
    color: colors.statusErrorFg,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  rowLabel: {
    ...typeScale.bodySm,
    color: colors.textMuted,
    flex: 1,
  },
  rowValue: {
    ...typeScale.labelMd,
    color: colors.text,
    flex: 1,
    textAlign: "right",
  },
  flexFill: {
    flex: 1,
  },
});

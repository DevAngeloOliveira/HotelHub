import React from "react";
import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import type { AvailableRoom, Destination, Hotel, Reservation, Room } from "../domain/hotelhub";
import { formatCurrency, summarizeDateRange } from "../lib/format";
import { Badge, Button, Card, AmenityPill } from "./primitives";
import { colors, fontFamilies, radius, spacing, typeScale } from "../theme/tokens";

export function DestinationCard({
  destination,
  onPress,
}: Readonly<{
  destination: Destination;
  onPress: () => void;
}>) {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.contentCard}>
        <ImageBackground source={{ uri: destination.imageUrl }} style={styles.imageHero} imageStyle={styles.imageHeroStyle}>
          <View style={styles.imageOverlay}>
            <Badge label={destination.category} tone="premium" />
            <Badge label={destination.country} tone="new" />
          </View>
        </ImageBackground>
        <View style={styles.gapSm}>
          <Text style={styles.cardTitle}>{destination.name}</Text>
          <Text style={styles.cardSubtitle}>{destination.city}, {destination.state}</Text>
          <Text style={styles.bodyText}>{destination.description}</Text>
        </View>
        <Button label="Ver destino" variant="secondary" onPress={onPress} />
      </Card>
    </Pressable>
  );
}

export function HotelCard({
  hotel,
  onPress,
}: Readonly<{
  hotel: Hotel;
  onPress: () => void;
}>) {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.contentCard}>
        <View style={styles.rowBetween}>
          <View style={styles.flexFill}>
            <Text style={styles.cardTitle}>{hotel.name}</Text>
            <Text style={styles.cardSubtitle}>{hotel.address}</Text>
          </View>
          <Badge label={hotel.category} tone="success" />
        </View>
        <Text style={styles.bodyText}>{hotel.description}</Text>
        <View style={styles.wrap}>
          {hotel.amenities.map((amenity) => (
            <AmenityPill key={amenity} label={amenity} />
          ))}
        </View>
        <Button label="Ver hotel" onPress={onPress} />
      </Card>
    </Pressable>
  );
}

export function RoomCard({
  room,
  onPress,
}: Readonly<{
  room: Room | AvailableRoom;
  onPress?: () => void;
}>) {
  const availabilityLabel = typeof (room as AvailableRoom).availableUnits === "number"
    ? (room as AvailableRoom).availableUnits! > 0
      ? `${(room as AvailableRoom).availableUnits} disponiveis`
      : "Sem estoque"
    : `Estoque ${room.quantity}`;

  return (
    <Card style={styles.contentCard}>
      <View style={styles.rowBetween}>
        <View style={styles.flexFill}>
          <Text style={styles.cardTitle}>{room.name}</Text>
          <Text style={styles.cardSubtitle}>{room.type}</Text>
        </View>
        <Text style={styles.priceText}>{formatCurrency(room.pricePerNight)}</Text>
      </View>
      <Text style={styles.bodyText}>{room.description}</Text>
      <View style={styles.wrap}>
        <Badge label={`Capacidade ${room.capacity}`} tone="new" />
        <Badge label={availabilityLabel} tone={availabilityLabel === "Sem estoque" ? "fullyBooked" : "success"} />
      </View>
      {onPress ? <Button label="Reservar" onPress={onPress} /> : null}
    </Card>
  );
}

export function ReservationCard({
  reservation,
  onCancel,
}: Readonly<{
  reservation: Reservation;
  onCancel?: () => void;
}>) {
  const isCancelled = reservation.status === "CANCELLED";
  return (
    <Card style={styles.contentCard}>
      <View style={styles.rowBetween}>
        <View style={styles.flexFill}>
          <Text style={styles.cardTitle}>{reservation.id}</Text>
          <Text style={styles.cardSubtitle}>{summarizeDateRange(reservation.checkInDate, reservation.checkOutDate)}</Text>
        </View>
        <Badge label={reservation.status} tone={isCancelled ? "error" : "success"} />
      </View>
      <View style={styles.reservationGrid}>
        <InfoTile label="Hotel" value={reservation.hotelId} />
        <InfoTile label="Quarto" value={reservation.roomId} />
        <InfoTile label="Hospedes" value={String(reservation.guestCount)} />
        <InfoTile label="Total" value={formatCurrency(reservation.totalAmount)} />
      </View>
      {onCancel && !isCancelled ? <Button label="Cancelar reserva" variant="destructive" onPress={onCancel} /> : null}
    </Card>
  );
}

export function MetricTile({ title, value }: Readonly<{ title: string; value: string | number }>) {
  return (
    <Card style={styles.metricCard}>
      <Text style={styles.metricLabel}>{title}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </Card>
  );
}

function InfoTile({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <View style={styles.infoTile}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contentCard: {
    gap: spacing.md,
  },
  imageHero: {
    minHeight: 180,
    justifyContent: "flex-end",
  },
  imageHeroStyle: {
    borderRadius: radius.xl,
  },
  imageOverlay: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: spacing.md,
    backgroundColor: "rgba(15,23,42,0.18)",
    borderRadius: radius.xl,
  },
  gapSm: {
    gap: spacing.xs,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  flexFill: {
    flex: 1,
  },
  cardTitle: {
    ...typeScale.h3,
    color: colors.text,
  },
  cardSubtitle: {
    ...typeScale.bodySm,
    color: colors.textMuted,
  },
  bodyText: {
    ...typeScale.bodySm,
    color: colors.textMuted,
  },
  priceText: {
    fontFamily: fontFamilies.uiBold,
    fontSize: 22,
    color: colors.primaryAction,
  },
  reservationGrid: {
    gap: spacing.sm,
  },
  infoTile: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.sm,
    gap: 4,
  },
  infoLabel: {
    ...typeScale.labelSm,
    color: colors.textSubtle,
    textTransform: "uppercase",
  },
  infoValue: {
    ...typeScale.bodySm,
    color: colors.text,
  },
  metricCard: {
    gap: spacing.xs,
  },
  metricLabel: {
    ...typeScale.bodySm,
    color: colors.textMuted,
  },
  metricValue: {
    fontFamily: fontFamilies.uiBold,
    fontSize: 36,
    color: colors.primaryAction,
  },
});

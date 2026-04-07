import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Hotel, Room } from "../domain/hotelhub";
import { getHotelDetails, MobileApiError } from "../lib/api";
import { addDaysToToday } from "../domain/hotelhub";
import { RoomCard } from "../components/content-cards";
import { AlertBanner, AmenityPill, Badge, Button, EmptyState, ScreenContainer, SectionHeader, SkeletonCard } from "../components/primitives";
import { colors, spacing, typeScale } from "../theme/tokens";

export function HotelDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [hotel, setHotel] = useState<(Hotel & { rooms: Room[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const result = await getHotelDetails(id);
        if (active) setHotel(result);
      } catch (error) {
        if (active && error instanceof MobileApiError && error.status === 404) {
          setNotFound(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <ScreenContainer>
        <SkeletonCard />
        <SkeletonCard />
      </ScreenContainer>
    );
  }

  if (notFound || !hotel) {
    return (
      <ScreenContainer>
        <EmptyState
          title="Hotel indisponivel"
          message="Este hotel nao esta mais visivel no catalogo publico."
          primaryLabel="Voltar para destinos"
          onPrimaryPress={() => router.replace("/destinations")}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.heroWrap}>
        <Badge label={hotel.category} tone="success" />
        <Text style={styles.heroTitle}>{hotel.name}</Text>
        <Text style={styles.heroSubtitle}>{hotel.address}</Text>
        <Text style={styles.heroBody}>{hotel.description}</Text>
        <Button
          label="Ver disponibilidade"
          variant="accentGold"
          onPress={() =>
            router.push({
              pathname: `/hotels/${hotel.id}/availability`,
              params: {
                checkInDate: addDaysToToday(7),
                checkOutDate: addDaysToToday(10),
                guestCount: "2",
              },
            })
          }
        />
      </View>

      <SectionHeader
        eyebrow="Amenidades"
        title="Estrutura do hotel"
        subtitle="Itens operacionais e comodidades publicas vinculadas a este hotel."
      />

      <View style={styles.wrap}>
        {hotel.amenities.map((amenity) => (
          <AmenityPill key={amenity} label={amenity} />
        ))}
      </View>

      <AlertBanner
        tone="info"
        title="Consulta em tempo real"
        message="A tela de disponibilidade leva em conta conflitos de reserva e quantidade do tipo de quarto."
      />

      <SectionHeader
        eyebrow="Quartos"
        title="Inventario do hotel"
        subtitle="Tipos de quarto e tarifa base por noite antes da consulta de periodo."
      />

      <View style={styles.listWrap}>
        {hotel.rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onPress={() =>
              router.push({
                pathname: `/hotels/${hotel.id}/availability`,
                params: {
                  checkInDate: addDaysToToday(7),
                  checkOutDate: addDaysToToday(10),
                  guestCount: String(Math.min(2, room.capacity)),
                },
              })
            }
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroWrap: {
    gap: spacing.sm,
  },
  heroTitle: {
    ...typeScale.displayLg,
    color: colors.text,
  },
  heroSubtitle: {
    ...typeScale.bodySm,
    color: colors.textMuted,
  },
  heroBody: {
    ...typeScale.bodyMd,
    color: colors.textMuted,
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  listWrap: {
    gap: spacing.md,
  },
});

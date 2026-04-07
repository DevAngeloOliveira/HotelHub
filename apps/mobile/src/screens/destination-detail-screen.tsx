import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import type { Destination, Hotel } from "../domain/hotelhub";
import { getDestinationDetails, MobileApiError } from "../lib/api";
import { HotelCard } from "../components/content-cards";
import { Badge, EmptyState, ScreenContainer, SectionHeader, SkeletonCard } from "../components/primitives";
import { colors, radius, spacing, typeScale } from "../theme/tokens";

export function DestinationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [destination, setDestination] = useState<(Destination & { hotels: Hotel[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const result = await getDestinationDetails(id);
        if (active) setDestination(result);
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

  if (notFound || !destination) {
    return (
      <ScreenContainer>
        <EmptyState
          title="Destino indisponivel"
          message="Este destino nao esta mais acessivel no catalogo publico."
          primaryLabel="Voltar para destinos"
          onPrimaryPress={() => router.replace("/destinations")}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ImageBackground source={{ uri: destination.imageUrl }} style={styles.hero} imageStyle={styles.heroImage}>
        <View style={styles.heroOverlay}>
          <Badge label={destination.category} tone="premium" />
          <Text style={styles.heroTitle}>{destination.name}</Text>
          <Text style={styles.heroText}>{destination.city}, {destination.state} - {destination.country}</Text>
        </View>
      </ImageBackground>

      <View style={styles.metaCard}>
        <InfoLine label="Cidade" value={destination.city} />
        <InfoLine label="Estado" value={destination.state} />
        <InfoLine label="Pais" value={destination.country} />
      </View>

      <SectionHeader
        eyebrow="Sobre o destino"
        title="Contexto editorial"
        subtitle={destination.description}
      />

      <SectionHeader
        eyebrow="Hoteis vinculados"
        title="Escolha sua estadia"
        subtitle="Todos os hoteis ativos abaixo podem seguir para consulta de quartos e disponibilidade."
      />

      <View style={styles.listWrap}>
        {destination.hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} onPress={() => router.push(`/hotels/${hotel.id}`)} />
        ))}
      </View>
    </ScreenContainer>
  );
}

function InfoLine({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <View style={styles.infoLine}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    minHeight: 260,
    justifyContent: "flex-end",
  },
  heroImage: {
    borderRadius: radius.xxl,
  },
  heroOverlay: {
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    backgroundColor: "rgba(15,23,42,0.34)",
  },
  heroTitle: {
    ...typeScale.displayLg,
    color: colors.textInverse,
  },
  heroText: {
    ...typeScale.bodyMd,
    color: "rgba(255,255,255,0.84)",
  },
  metaCard: {
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.md,
    gap: spacing.sm,
  },
  infoLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
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
  listWrap: {
    gap: spacing.md,
  },
});

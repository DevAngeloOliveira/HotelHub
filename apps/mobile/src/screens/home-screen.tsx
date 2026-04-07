import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import type { Destination } from "../domain/hotelhub";
import { listDestinations } from "../lib/api";
import { DestinationCard } from "../components/content-cards";
import { Button, HeroCard, ScreenContainer, SectionHeader, SkeletonCard, TextField } from "../components/primitives";
import { spacing } from "../theme/tokens";

export function HomeScreen() {
  const [query, setQuery] = useState("");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const result = await listDestinations({ size: 4 });
        if (active) setDestinations(result.filter((destination) => destination.featured).slice(0, 3));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <ScreenContainer>
      <HeroCard
        eyebrow="HotelHub mobile"
        title="Descubra destinos e reserve sem ruido operacional."
        message="O fluxo mobile segue o mesmo contrato da API: catalogo publico, disponibilidade e reserva confirmada sem overbooking."
      >
        <TextField label="Destino ou cidade" value={query} onChangeText={setQuery} placeholder="Ex.: Porto Seguro" />
        <Button
          label="Buscar destinos"
          onPress={() =>
            router.push(query ? { pathname: "/destinations", params: { name: query } } : "/destinations")
          }
        />
        <Button label="Minhas reservas" variant="secondary" onPress={() => router.push("/(tabs)/reservations")} />
      </HeroCard>

      <SectionHeader
        eyebrow="Destaques"
        title="Destinos em foco"
        subtitle="Cartoes editoriais alinhados ao design system do Figma para acelerar descoberta e entrada no fluxo de reserva."
      />

      <View style={styles.listWrap}>
        {loading
          ? Array.from({ length: 2 }).map((_, index) => <SkeletonCard key={index} />)
          : destinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} onPress={() => router.push(`/destinations/${destination.id}`)} />
            ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listWrap: {
    gap: spacing.md,
  },
});

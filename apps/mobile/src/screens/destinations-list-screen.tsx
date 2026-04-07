import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import type { Destination } from "../domain/hotelhub";
import { listDestinations } from "../lib/api";
import { DestinationCard } from "../components/content-cards";
import { Button, EmptyState, ScreenContainer, SectionHeader, SkeletonCard, TextField } from "../components/primitives";
import { spacing } from "../theme/tokens";

export function DestinationsListScreen() {
  const params = useLocalSearchParams<{ name?: string; city?: string; category?: string; state?: string; country?: string }>();
  const [name, setName] = useState(params.name ?? "");
  const [city, setCity] = useState(params.city ?? "");
  const [state, setState] = useState(params.state ?? "");
  const [country, setCountry] = useState(params.country ?? "");
  const [category, setCategory] = useState(params.category ?? "");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDestinations = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listDestinations({ name, city, state, country, category, size: 24 });
      setDestinations(result);
    } finally {
      setLoading(false);
    }
  }, [category, city, country, name, state]);

  useEffect(() => {
    void loadDestinations();
  }, [loadDestinations]);

  return (
    <ScreenContainer>
      <SectionHeader
        eyebrow="Busca"
        title="Encontre o destino certo"
        subtitle="Filtros por nome, localizacao e categoria. A consulta mobile reusa os mesmos endpoints publicos da API."
      />

      <View style={styles.formGrid}>
        <TextField label="Nome" value={name} onChangeText={setName} placeholder="Buscar por nome" />
        <TextField label="Cidade" value={city} onChangeText={setCity} placeholder="Buscar por cidade" />
        <TextField label="Estado" value={state} onChangeText={setState} placeholder="UF" />
        <TextField label="Pais" value={country} onChangeText={setCountry} placeholder="Brasil" />
        <TextField label="Categoria" value={category} onChangeText={setCategory} placeholder="Praia, serra..." />
        <Button label="Aplicar filtros" onPress={() => void loadDestinations()} />
      </View>

      <View style={styles.listWrap}>
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
        ) : destinations.length > 0 ? (
          destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} onPress={() => router.push(`/destinations/${destination.id}`)} />
          ))
        ) : (
          <EmptyState
            title="Nenhum destino encontrado"
            message="Ajuste os filtros para abrir novas combinacoes de resultado."
            primaryLabel="Limpar filtros"
            onPrimaryPress={() => {
              setName("");
              setCity("");
              setState("");
              setCountry("");
              setCategory("");
              void loadDestinations();
            }}
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  formGrid: {
    gap: spacing.sm,
  },
  listWrap: {
    gap: spacing.md,
  },
});

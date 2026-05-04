import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { Destination } from "../domain/hotelhub";
import { listDestinations } from "../lib/api";
import { EmptyState, SkeletonCard } from "../components/primitives";
import { colors, fontFamilies, radius, shadows, spacing } from "../theme/tokens";

const categoryChips = [
  { id: "", label: "Todos" },
  { id: "beach", label: "Praia" },
  { id: "city", label: "Cidade" },
  { id: "mountain", label: "Serra" },
  { id: "romantic", label: "Romântico" },
  { id: "family", label: "Família" },
  { id: "business", label: "Negócios" },
];

export function DestinationsListScreen() {
  const params = useLocalSearchParams<{
    name?: string;
    city?: string;
    category?: string;
    state?: string;
    country?: string;
  }>();
  const [name, setName] = useState(params.name ?? "");
  const [city, setCity] = useState(params.city ?? "");
  const [state, setState] = useState(params.state ?? "");
  const [country, setCountry] = useState(params.country ?? "");
  const [category, setCategory] = useState(params.category ?? "");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

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

  const clearFilters = () => {
    setName("");
    setCity("");
    setState("");
    setCountry("");
    setCategory("");
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>‹</Text>
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerEyebrow}>BUSCA</Text>
            <Text style={styles.headerTitle}>Encontre seu destino</Text>
          </View>
        </View>

        <View style={styles.searchBar}>
          <View style={styles.searchGlyph}>
            <Text style={styles.searchGlyphText}>L</Text>
          </View>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Buscar por nome ou cidade"
            placeholderTextColor={colors.textSubtle}
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={() => void loadDestinations()}
          />
          <Pressable
            style={styles.filterButton}
            onPress={() => setShowFilters((value) => !value)}
          >
            <Text style={styles.filterButtonText}>{showFilters ? "✕" : "☰"}</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipScroll}
          style={styles.chipScrollContainer}
        >
          {categoryChips.map((chip) => {
            const isActive = category === chip.id;
            return (
              <Pressable
                key={chip.label}
                onPress={() => setCategory(chip.id)}
                style={[styles.chip, isActive && styles.chipActive]}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {chip.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {showFilters ? (
          <View style={styles.filterPanel}>
            <View style={styles.filterRow}>
              <FilterField label="Cidade" value={city} onChange={setCity} placeholder="Ex.: São Paulo" />
              <FilterField label="Estado" value={state} onChange={setState} placeholder="UF" />
            </View>
            <FilterField label="País" value={country} onChange={setCountry} placeholder="Brasil" />
            <View style={styles.filterActions}>
              <Pressable style={styles.filterClearButton} onPress={clearFilters}>
                <Text style={styles.filterClearText}>Limpar</Text>
              </Pressable>
              <Pressable
                style={styles.filterApplyButton}
                onPress={() => {
                  setShowFilters(false);
                  void loadDestinations();
                }}
              >
                <Text style={styles.filterApplyText}>Aplicar filtros</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resultsHeader}>
          <View>
            <Text style={styles.resultsCount}>
              {destinations.length} resultado{destinations.length === 1 ? "" : "s"}
            </Text>
            <Text style={styles.resultsHint}>Cancelamento grátis · Melhor preço</Text>
          </View>
          <View style={styles.sortPill}>
            <Text style={styles.sortPillText}>Recomendados</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.gap}>
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </View>
        ) : destinations.length > 0 ? (
          <View style={styles.gap}>
            {destinations.map((destination) => (
              <DestinationResultCard
                key={destination.id}
                destination={destination}
                onPress={() => router.push(`/destinations/${destination.id}`)}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            title="Nenhum destino encontrado"
            message="Ajuste os filtros para abrir novas combinações de resultado."
            primaryLabel="Limpar filtros"
            onPrimaryPress={clearFilters}
          />
        )}
      </ScrollView>
    </View>
  );
}

function FilterField({
  label,
  value,
  onChange,
  placeholder,
}: Readonly<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}>) {
  return (
    <View style={styles.filterField}>
      <Text style={styles.filterLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textSubtle}
        style={styles.filterInput}
      />
    </View>
  );
}

function DestinationResultCard({
  destination,
  onPress,
}: Readonly<{ destination: Destination; onPress: () => void }>) {
  return (
    <Pressable onPress={onPress} style={styles.resultCard}>
      <ImageBackground
        source={{ uri: destination.imageUrl }}
        style={styles.resultImage}
        imageStyle={styles.resultImageStyle}
      >
        <View style={styles.resultImageOverlay} />
        {destination.category ? (
          <View style={styles.resultCategoryPill}>
            <Text style={styles.resultCategoryText}>{destination.category}</Text>
          </View>
        ) : null}
        <View style={styles.resultScoreBadge}>
          <Text style={styles.resultScoreStar}>★</Text>
          <Text style={styles.resultScoreText}>9.{(destination.id.length % 9) + 1}</Text>
        </View>
        <View style={styles.resultImageBottom}>
          <Text style={styles.resultCountry}>{destination.country}</Text>
          <Text style={styles.resultCity}>{destination.name}</Text>
        </View>
      </ImageBackground>
      <View style={styles.resultBody}>
        <View style={styles.resultLocationRow}>
          <Text style={styles.resultLocationDot}>◉</Text>
          <Text style={styles.resultLocation} numberOfLines={1}>
            {[destination.city, destination.state].filter(Boolean).join(", ")}
          </Text>
        </View>
        {destination.description ? (
          <Text style={styles.resultDescription} numberOfLines={2}>
            {destination.description}
          </Text>
        ) : null}
        <View style={styles.resultFooter}>
          <View>
            <Text style={styles.resultFromLabel}>A partir de</Text>
            <Text style={styles.resultPrice}>
              R$ 590<Text style={styles.resultPerNight}> /noite</Text>
            </Text>
          </View>
          <View style={styles.resultCta}>
            <Text style={styles.resultCtaText}>Ver hotéis →</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F1F3F7",
  },
  header: {
    backgroundColor: "#0E2157",
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
    borderBottomLeftRadius: radius.xxl,
    borderBottomRightRadius: radius.xxl,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: colors.white,
    fontSize: 24,
    fontFamily: fontFamilies.uiBold,
    marginTop: -2,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerEyebrow: {
    fontFamily: fontFamilies.uiSemiBold,
    color: "rgba(255,255,255,0.65)",
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  headerTitle: {
    fontFamily: fontFamilies.display,
    color: colors.white,
    fontSize: 22,
    lineHeight: 28,
    marginTop: 2,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
    marginTop: spacing.sm,
  },
  searchGlyph: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
  },
  searchGlyphText: {
    fontFamily: fontFamilies.uiBold,
    color: "#1F4FD6",
    fontSize: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamilies.uiMedium,
    fontSize: 14,
    color: "#14181F",
    padding: 0,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: "#E6B93A",
    alignItems: "center",
    justifyContent: "center",
  },
  filterButtonText: {
    fontFamily: fontFamilies.uiBold,
    color: "#0E2157",
    fontSize: 16,
  },

  chipScrollContainer: {
    marginTop: 6,
  },
  chipScroll: {
    gap: 8,
    paddingRight: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  chipActive: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  chipText: {
    fontFamily: fontFamilies.uiMedium,
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
  },
  chipTextActive: {
    color: "#0E2157",
    fontFamily: fontFamilies.uiBold,
  },

  filterPanel: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  filterRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  filterField: {
    flex: 1,
    gap: 4,
  },
  filterLabel: {
    fontFamily: fontFamilies.uiSemiBold,
    color: "#7A8799",
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  filterInput: {
    minHeight: 42,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "#E4E8EF",
    backgroundColor: "#F8F9FB",
    paddingHorizontal: spacing.sm,
    fontFamily: fontFamilies.uiMedium,
    fontSize: 13,
    color: "#14181F",
  },
  filterActions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: 4,
  },
  filterClearButton: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "#E4E8EF",
    paddingVertical: 12,
    alignItems: "center",
  },
  filterClearText: {
    fontFamily: fontFamilies.uiSemiBold,
    color: "#5C6675",
    fontSize: 13,
  },
  filterApplyButton: {
    flex: 1.5,
    borderRadius: radius.md,
    backgroundColor: "#1F4FD6",
    paddingVertical: 12,
    alignItems: "center",
  },
  filterApplyText: {
    fontFamily: fontFamilies.uiBold,
    color: colors.white,
    fontSize: 13,
  },

  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  resultsCount: {
    fontFamily: fontFamilies.uiBold,
    color: "#14181F",
    fontSize: 16,
  },
  resultsHint: {
    fontFamily: fontFamilies.uiRegular,
    color: "#7A8799",
    fontSize: 11,
    marginTop: 2,
  },
  sortPill: {
    backgroundColor: colors.white,
    borderColor: "#E4E8EF",
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderRadius: radius.md,
  },
  sortPillText: {
    fontFamily: fontFamilies.uiSemiBold,
    color: "#14181F",
    fontSize: 12,
  },

  gap: {
    gap: spacing.md,
  },

  resultCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    overflow: "hidden",
    shadowColor: shadows.sm.shadowColor,
    shadowOffset: shadows.sm.shadowOffset,
    shadowOpacity: shadows.sm.shadowOpacity,
    shadowRadius: shadows.sm.shadowRadius,
    elevation: shadows.sm.elevation,
  },
  resultImage: {
    height: 180,
    width: "100%",
    justifyContent: "flex-end",
  },
  resultImageStyle: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  resultImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(14,33,87,0.30)",
  },
  resultCategoryPill: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#E6B93A",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  resultCategoryText: {
    fontFamily: fontFamilies.uiBold,
    color: "#0E2157",
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  resultScoreBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(14,33,87,0.85)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  resultScoreStar: {
    color: "#F4CB57",
    fontFamily: fontFamilies.uiBold,
    fontSize: 11,
  },
  resultScoreText: {
    color: colors.white,
    fontFamily: fontFamilies.uiBold,
    fontSize: 12,
  },
  resultImageBottom: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  resultCountry: {
    fontFamily: fontFamilies.uiSemiBold,
    color: "rgba(255,255,255,0.85)",
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  resultCity: {
    fontFamily: fontFamilies.uiBold,
    color: colors.white,
    fontSize: 20,
    lineHeight: 26,
    marginTop: 2,
  },
  resultBody: {
    padding: spacing.md,
    gap: 8,
  },
  resultLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  resultLocationDot: {
    color: "#1F4FD6",
    fontSize: 11,
  },
  resultLocation: {
    fontFamily: fontFamilies.uiMedium,
    color: "#7A8799",
    fontSize: 12,
    flex: 1,
  },
  resultDescription: {
    fontFamily: fontFamilies.uiRegular,
    color: "#5C6675",
    fontSize: 13,
    lineHeight: 18,
  },
  resultFooter: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E4E8EF",
    paddingTop: spacing.sm,
    marginTop: 4,
  },
  resultFromLabel: {
    fontFamily: fontFamilies.uiMedium,
    color: "#7A8799",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  resultPrice: {
    fontFamily: fontFamilies.uiBold,
    color: "#1F4FD6",
    fontSize: 18,
  },
  resultPerNight: {
    fontFamily: fontFamilies.uiRegular,
    color: "#7A8799",
    fontSize: 11,
  },
  resultCta: {
    backgroundColor: "#EEF4FF",
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderRadius: radius.md,
  },
  resultCtaText: {
    fontFamily: fontFamilies.uiBold,
    color: "#1F4FD6",
    fontSize: 12,
  },
});

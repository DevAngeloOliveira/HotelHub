import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { colors, fontFamilies, radius, shadows, spacing, typeScale } from "../theme/tokens";

const searchTabs = [
  { id: "stays", label: "Hospedagens", glyph: "H" },
  { id: "packages", label: "Pacotes", glyph: "P" },
  { id: "experiences", label: "Experiências", glyph: "E" },
];

const categories = [
  { id: "beach", label: "Praia", glyph: "BE" },
  { id: "city", label: "Cidade", glyph: "CI" },
  { id: "mountain", label: "Serra", glyph: "MT" },
  { id: "romantic", label: "Romântico", glyph: "RO" },
  { id: "family", label: "Família", glyph: "FA" },
  { id: "business", label: "Negócios", glyph: "BU" },
];

const trustItems = [
  { glyph: "%", title: "Cancelamento grátis" },
  { glyph: "$", title: "Melhor preço" },
  { glyph: "P", title: "Pague no hotel" },
  { glyph: "24", title: "Suporte 24h" },
];

export function HomeScreen() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("stays");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const result = await listDestinations({ size: 6 });
        if (active) setDestinations(result.slice(0, 5));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const onSearch = () => {
    router.push(query ? { pathname: "/destinations", params: { name: query } } : "/destinations");
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
        }}
        style={styles.heroImage}
        imageStyle={styles.heroImageStyle}
      >
        <View style={styles.heroOverlay} />
        <View style={styles.heroInner}>
          <View style={styles.greetingRow}>
            <View>
              <Text style={styles.greetingHello}>Olá, viajante</Text>
              <Text style={styles.greetingTitle}>Para onde vamos hoje?</Text>
            </View>
            <Pressable
              style={styles.notifButton}
              onPress={() => router.push("/(tabs)/profile")}
              accessibilityRole="button"
            >
              <Text style={styles.notifText}>P</Text>
            </Pressable>
          </View>

          <View style={styles.eyebrowPill}>
            <View style={styles.eyebrowDot} />
            <Text style={styles.eyebrowText}>Mais de 2M de viajantes confiam</Text>
          </View>

          <Text style={styles.heroHeadline}>
            Sua próxima viagem começa <Text style={styles.heroHeadlineAccent}>aqui</Text>.
          </Text>

          <View style={styles.tabsRow}>
            {searchTabs.map((tab) => {
              const active = tab.id === activeTab;
              return (
                <Pressable
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  style={[styles.tab, active && styles.tabActive]}
                >
                  <View style={[styles.tabGlyph, active && styles.tabGlyphActive]}>
                    <Text style={[styles.tabGlyphText, active && styles.tabGlyphTextActive]}>
                      {tab.glyph}
                    </Text>
                  </View>
                  <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ImageBackground>

      <View style={styles.searchCardWrap}>
        <View style={styles.searchCard}>
          <View style={styles.searchInputRow}>
            <View style={styles.searchGlyph}>
              <Text style={styles.searchGlyphText}>L</Text>
            </View>
            <View style={styles.flex1}>
              <Text style={styles.searchLabel}>DESTINO</Text>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Para onde você vai?"
                placeholderTextColor={colors.textSubtle}
                style={styles.searchInput}
                returnKeyType="search"
                onSubmitEditing={onSearch}
              />
            </View>
          </View>

          <View style={styles.searchDivider} />

          <View style={styles.searchInputRow}>
            <View style={styles.searchGlyph}>
              <Text style={styles.searchGlyphText}>D</Text>
            </View>
            <View style={styles.flex1}>
              <Text style={styles.searchLabel}>DATAS · HÓSPEDES</Text>
              <Text style={styles.searchInputDisplay}>Selecione no destino</Text>
            </View>
          </View>

          <Pressable style={styles.ctaButton} onPress={onSearch}>
            <Text style={styles.ctaButtonText}>Buscar hospedagens</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.trustBar}>
        {trustItems.map((item) => (
          <View key={item.title} style={styles.trustItem}>
            <View style={styles.trustGlyph}>
              <Text style={styles.trustGlyphText}>{item.glyph}</Text>
            </View>
            <Text style={styles.trustLabel}>{item.title}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>ESCOLHA SEU ESTILO</Text>
            <Text style={styles.sectionTitle}>Categorias em destaque</Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((category) => (
            <Pressable
              key={category.id}
              style={styles.categoryChip}
              onPress={() =>
                router.push({ pathname: "/destinations", params: { category: category.id } })
              }
            >
              <View style={styles.categoryGlyph}>
                <Text style={styles.categoryGlyphText}>{category.glyph}</Text>
              </View>
              <Text style={styles.categoryLabel}>{category.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>EXPLORE O MUNDO</Text>
            <Text style={styles.sectionTitle}>Destinos em destaque</Text>
          </View>
          <Pressable onPress={() => router.push("/destinations")}>
            <Text style={styles.sectionLink}>Ver todos →</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.featuredScrollContent}>
            <View style={[styles.featuredCard, styles.skeletonCard]} />
            <View style={[styles.featuredCard, styles.skeletonCard]} />
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScrollContent}
          >
            {destinations.map((destination) => (
              <Pressable
                key={destination.id}
                style={styles.featuredCard}
                onPress={() => router.push(`/destinations/${destination.id}`)}
              >
                <ImageBackground
                  source={{ uri: destination.imageUrl }}
                  style={styles.featuredImage}
                  imageStyle={styles.featuredImageRadius}
                >
                  <View style={styles.featuredImageOverlay} />
                  <View style={styles.featuredScoreBadge}>
                    <Text style={styles.featuredScoreStar}>★</Text>
                    <Text style={styles.featuredScoreText}>9.{(destination.id.length % 9) + 1}</Text>
                  </View>
                  {destination.category ? (
                    <View style={styles.featuredCategoryPill}>
                      <Text style={styles.featuredCategoryText}>{destination.category}</Text>
                    </View>
                  ) : null}
                </ImageBackground>
                <View style={styles.featuredContent}>
                  <Text style={styles.featuredCountry}>{destination.country}</Text>
                  <Text style={styles.featuredCity}>{destination.city || destination.name}</Text>
                  <View style={styles.featuredFooter}>
                    <View>
                      <Text style={styles.featuredFromLabel}>A partir de</Text>
                      <Text style={styles.featuredPrice}>R$ 590<Text style={styles.featuredPerNight}> /noite</Text></Text>
                    </View>
                    <Text style={styles.featuredArrow}>→</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.dealsBanner}>
        <View style={styles.dealsBadge}>
          <View style={styles.dealsBadgeDot} />
          <Text style={styles.dealsBadgeText}>OFERTAS DE ÚLTIMA HORA</Text>
        </View>
        <Text style={styles.dealsTitle}>Até 40% off em hotéis premium</Text>
        <Text style={styles.dealsSubtitle}>
          Reserve agora com cancelamento grátis e pague apenas no hotel.
        </Text>
        <Pressable style={styles.dealsCta} onPress={() => router.push("/destinations")}>
          <Text style={styles.dealsCtaText}>Ver ofertas</Text>
        </Pressable>
        <Text style={styles.dealsTimer}>⏱ Ofertas expiram em 48h</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>SUAS RESERVAS</Text>
            <Text style={styles.sectionTitle}>Acompanhe sua próxima viagem</Text>
          </View>
        </View>
        <Pressable
          style={styles.reservationsCard}
          onPress={() => router.push("/(tabs)/reservations")}
        >
          <View style={styles.reservationsIcon}>
            <Text style={styles.reservationsIconText}>R</Text>
          </View>
          <View style={styles.flex1}>
            <Text style={styles.reservationsTitle}>Minhas reservas</Text>
            <Text style={styles.reservationsSubtitle}>Ver histórico e check-ins programados</Text>
          </View>
          <Text style={styles.reservationsArrow}>→</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F1F3F7",
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  flex1: {
    flex: 1,
  },

  heroImage: {
    minHeight: 320,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.md,
  },
  heroImageStyle: {
    backgroundColor: "#0E2157",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(14,33,87,0.84)",
  },
  heroInner: {
    gap: spacing.md,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greetingHello: {
    ...typeScale.labelSm,
    color: "rgba(255,255,255,0.7)",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  greetingTitle: {
    ...typeScale.h3,
    color: colors.white,
    marginTop: 2,
  },
  notifButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  notifText: {
    fontFamily: fontFamilies.uiBold,
    color: colors.white,
    fontSize: 14,
  },
  eyebrowPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(244,203,87,0.16)",
    borderColor: "rgba(244,203,87,0.4)",
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    marginTop: spacing.sm,
  },
  eyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F4CB57",
  },
  eyebrowText: {
    fontFamily: fontFamilies.uiSemiBold,
    color: "#F4CB57",
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  heroHeadline: {
    fontFamily: fontFamilies.display,
    fontSize: 28,
    lineHeight: 34,
    color: colors.white,
  },
  heroHeadlineAccent: {
    color: "#F4CB57",
  },
  tabsRow: {
    flexDirection: "row",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.10)",
    padding: 4,
    borderRadius: radius.lg,
    alignSelf: "flex-start",
    flexWrap: "wrap",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderRadius: radius.md,
  },
  tabActive: {
    backgroundColor: colors.white,
  },
  tabGlyph: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.20)",
    alignItems: "center",
    justifyContent: "center",
  },
  tabGlyphActive: {
    backgroundColor: "#0E2157",
  },
  tabGlyphText: {
    fontFamily: fontFamilies.uiBold,
    color: colors.white,
    fontSize: 9,
  },
  tabGlyphTextActive: {
    color: colors.white,
  },
  tabLabel: {
    fontFamily: fontFamilies.uiMedium,
    color: "rgba(255,255,255,0.80)",
    fontSize: 12,
  },
  tabLabelActive: {
    color: "#0E2157",
  },

  searchCardWrap: {
    paddingHorizontal: spacing.md,
    marginTop: -32,
  },
  searchCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: "#E6B93A",
    padding: spacing.md,
    gap: spacing.sm,
    shadowColor: "#0E2157",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  searchInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    minHeight: 52,
  },
  searchGlyph: {
    width: 36,
    height: 36,
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
  searchLabel: {
    fontFamily: fontFamilies.uiSemiBold,
    color: "#7A8799",
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  searchInput: {
    fontFamily: fontFamilies.uiSemiBold,
    fontSize: 15,
    color: "#14181F",
    padding: 0,
    marginTop: 2,
  },
  searchInputDisplay: {
    fontFamily: fontFamilies.uiSemiBold,
    fontSize: 15,
    color: "#14181F",
    marginTop: 2,
  },
  searchDivider: {
    height: 1,
    backgroundColor: "#E4E8EF",
  },
  ctaButton: {
    backgroundColor: "#E6B93A",
    paddingVertical: 14,
    borderRadius: radius.lg,
    alignItems: "center",
    marginTop: spacing.xs,
  },
  ctaButtonText: {
    fontFamily: fontFamilies.uiBold,
    color: "#0E2157",
    fontSize: 15,
  },

  trustBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    shadowColor: shadows.sm.shadowColor,
    shadowOffset: shadows.sm.shadowOffset,
    shadowOpacity: shadows.sm.shadowOpacity,
    shadowRadius: shadows.sm.shadowRadius,
    elevation: shadows.sm.elevation,
  },
  trustItem: {
    flexBasis: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
  },
  trustGlyph: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
  },
  trustGlyphText: {
    fontFamily: fontFamilies.uiBold,
    color: "#1F4FD6",
    fontSize: 11,
  },
  trustLabel: {
    fontFamily: fontFamilies.uiMedium,
    color: "#14181F",
    fontSize: 12,
    flexShrink: 1,
  },

  section: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  sectionEyebrow: {
    fontFamily: fontFamilies.uiBold,
    color: "#7A8799",
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontFamily: fontFamilies.display,
    color: "#14181F",
    fontSize: 22,
    lineHeight: 28,
    marginTop: 4,
  },
  sectionLink: {
    fontFamily: fontFamilies.uiSemiBold,
    color: "#1F4FD6",
    fontSize: 13,
  },

  categoryScroll: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  categoryChip: {
    width: 96,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E4E8EF",
  },
  categoryGlyph: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryGlyphText: {
    fontFamily: fontFamilies.uiBold,
    color: "#1F4FD6",
    fontSize: 14,
  },
  categoryLabel: {
    fontFamily: fontFamilies.uiSemiBold,
    color: "#14181F",
    fontSize: 12,
  },

  featuredScrollContent: {
    gap: spacing.md,
    paddingRight: spacing.md,
  },
  featuredCard: {
    width: 260,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    overflow: "hidden",
    shadowColor: shadows.sm.shadowColor,
    shadowOffset: shadows.sm.shadowOffset,
    shadowOpacity: shadows.sm.shadowOpacity,
    shadowRadius: shadows.sm.shadowRadius,
    elevation: shadows.sm.elevation,
  },
  skeletonCard: {
    height: 280,
    backgroundColor: "#E4E8EF",
  },
  featuredImage: {
    height: 160,
    width: "100%",
  },
  featuredImageRadius: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  featuredImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(14,33,87,0.20)",
  },
  featuredScoreBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(14,33,87,0.85)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  featuredScoreStar: {
    color: "#F4CB57",
    fontSize: 11,
    fontFamily: fontFamilies.uiBold,
  },
  featuredScoreText: {
    color: colors.white,
    fontSize: 11,
    fontFamily: fontFamilies.uiBold,
  },
  featuredCategoryPill: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#E6B93A",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  featuredCategoryText: {
    color: "#0E2157",
    fontFamily: fontFamilies.uiBold,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  featuredContent: {
    padding: spacing.md,
    gap: 4,
  },
  featuredCountry: {
    fontFamily: fontFamilies.uiSemiBold,
    color: "#7A8799",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  featuredCity: {
    fontFamily: fontFamilies.uiBold,
    color: "#14181F",
    fontSize: 17,
    lineHeight: 22,
  },
  featuredFooter: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  featuredFromLabel: {
    fontFamily: fontFamilies.uiMedium,
    color: "#7A8799",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  featuredPrice: {
    fontFamily: fontFamilies.uiBold,
    color: "#1F4FD6",
    fontSize: 16,
  },
  featuredPerNight: {
    fontFamily: fontFamilies.uiRegular,
    color: "#7A8799",
    fontSize: 11,
  },
  featuredArrow: {
    fontFamily: fontFamilies.uiBold,
    color: "#1F4FD6",
    fontSize: 16,
  },

  dealsBanner: {
    marginHorizontal: spacing.md,
    marginTop: spacing.xl,
    backgroundColor: "#E6B93A",
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: 8,
    shadowColor: shadows.md.shadowColor,
    shadowOffset: shadows.md.shadowOffset,
    shadowOpacity: shadows.md.shadowOpacity,
    shadowRadius: shadows.md.shadowRadius,
    elevation: shadows.md.elevation,
  },
  dealsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#0E2157",
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  dealsBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F4CB57",
  },
  dealsBadgeText: {
    fontFamily: fontFamilies.uiBold,
    color: "#F4CB57",
    fontSize: 9,
    letterSpacing: 0.6,
  },
  dealsTitle: {
    fontFamily: fontFamilies.display,
    color: "#0E2157",
    fontSize: 22,
    lineHeight: 28,
    marginTop: 6,
  },
  dealsSubtitle: {
    fontFamily: fontFamilies.uiRegular,
    color: "rgba(14,33,87,0.78)",
    fontSize: 13,
    lineHeight: 19,
  },
  dealsCta: {
    backgroundColor: "#0E2157",
    borderRadius: radius.lg,
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: spacing.sm,
  },
  dealsCtaText: {
    fontFamily: fontFamilies.uiBold,
    color: colors.white,
    fontSize: 13,
  },
  dealsTimer: {
    fontFamily: fontFamilies.uiSemiBold,
    color: "rgba(14,33,87,0.70)",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: 4,
  },

  reservationsCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: "#E4E8EF",
  },
  reservationsIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
  },
  reservationsIconText: {
    fontFamily: fontFamilies.uiBold,
    color: "#1F4FD6",
    fontSize: 16,
  },
  reservationsTitle: {
    fontFamily: fontFamilies.uiBold,
    color: "#14181F",
    fontSize: 15,
  },
  reservationsSubtitle: {
    fontFamily: fontFamilies.uiRegular,
    color: "#7A8799",
    fontSize: 12,
    marginTop: 2,
  },
  reservationsArrow: {
    fontFamily: fontFamilies.uiBold,
    color: "#1F4FD6",
    fontSize: 18,
  },
});

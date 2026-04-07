import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getFriendlyErrorMessage, useHotelHub } from "../state/hotelhub-provider";
import { AlertBanner, Badge, Button, Card, ScreenContainer, SectionHeader, TextField } from "../components/primitives";
import { colors, fontFamilies, radius, spacing, typeScale } from "../theme/tokens";

export function ProfileScreen() {
  const { profile, saveProfile, usesLiveProtectedApi, isBootstrapping } = useHotelHub();
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <ScreenContainer>
      <SectionHeader
        eyebrow="Perfil"
        title="Dados do usuario"
        subtitle="Edicao cadastral basica com o mesmo contrato de perfil usado pelo backend."
      />

      <View style={styles.profileHeader}>
        <View style={styles.avatar}><Text style={styles.avatarLabel}>{profile.name.charAt(0).toUpperCase()}</Text></View>
        <View style={styles.profileMeta}>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileEmail}>{profile.email}</Text>
          <View style={styles.badges}>
            <Badge label={profile.role} tone={profile.role === "ADMIN" ? "premium" : "info"} />
            <Badge label={usesLiveProtectedApi ? "API protegida" : "Modo fallback"} tone={usesLiveProtectedApi ? "success" : "warning"} />
          </View>
        </View>
      </View>

      {isBootstrapping ? (
        <AlertBanner tone="info" title="Sincronizando" message="Carregando dados de perfil e reservas protegidas." />
      ) : null}
      {error ? <AlertBanner tone="error" title="Falha ao salvar" message={error} /> : null}

      <Card>
        <TextField label="Nome" value={name} onChangeText={setName} />
        <TextField label="Email" value={profile.email} editable={false} />
        <TextField label="Telefone" value={phone} onChangeText={setPhone} keyboardType="numeric" />
        <Button
          label="Salvar alteracoes"
          loading={saving}
          onPress={async () => {
            try {
              setSaving(true);
              setError(null);
              await saveProfile(name, phone);
            } catch (requestError) {
              setError(getFriendlyErrorMessage(requestError));
            } finally {
              setSaving(false);
            }
          }}
        />
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    backgroundColor: colors.primary[50],
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLabel: {
    fontFamily: fontFamilies.uiBold,
    fontSize: 28,
    color: colors.primaryAction,
  },
  profileMeta: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    ...typeScale.h3,
    color: colors.text,
  },
  profileEmail: {
    ...typeScale.bodySm,
    color: colors.textMuted,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
});

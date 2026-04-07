import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useMemo, useState } from "react";
import {
  Modal as RNModal,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { componentTokens, colors, fontFamilies, radius, shadows, spacing, typeScale } from "../theme/tokens";
import { formatDateLabel } from "../lib/format";

type ButtonVariant = "primary" | "secondary" | "ghost" | "accentGold" | "destructive";
type ButtonSize = "sm" | "md" | "lg";
type BadgeTone = "info" | "success" | "warning" | "error" | "premium" | "popular" | "fullyBooked" | "new";

export function ScreenContainer({ children, contentStyle }: Readonly<{ children: React.ReactNode; contentStyle?: StyleProp<ViewStyle> }>) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.screenContent, contentStyle]}>
      {children}
    </ScrollView>
  );
}

export function Card({ children, style }: Readonly<{ children: React.ReactNode; style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  disabled,
  loading,
  style,
}: Readonly<{
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}>) {
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        size === "sm" ? styles.buttonSm : size === "lg" ? styles.buttonLg : styles.buttonMd,
        variant === "primary" && styles.buttonPrimary,
        variant === "secondary" && styles.buttonSecondary,
        variant === "ghost" && styles.buttonGhost,
        variant === "accentGold" && styles.buttonAccentGold,
        variant === "destructive" && styles.buttonDestructive,
        (pressed || loading) && styles.buttonPressed,
        (disabled || loading) && styles.buttonDisabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.buttonLabel,
          (variant === "secondary" || variant === "ghost") && styles.buttonLabelDark,
          variant === "accentGold" && styles.buttonLabelAccent,
        ]}
      >
        {loading ? "Carregando..." : label}
      </Text>
    </Pressable>
  );
}

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  editable = true,
  helpText,
  errorText,
  multiline,
}: Readonly<{
  label?: string;
  value: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "email-address";
  editable?: boolean;
  helpText?: string;
  errorText?: string;
  multiline?: boolean;
}>) {
  const hint = errorText ?? helpText;
  return (
    <View style={styles.fieldWrap}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        editable={editable}
        multiline={multiline}
        placeholderTextColor={colors.textSubtle}
        style={[
          styles.textField,
          !editable && styles.textFieldReadonly,
          Boolean(errorText) && styles.textFieldError,
          multiline && styles.textFieldMultiline,
        ]}
      />
      {hint ? <Text style={[styles.fieldHint, errorText ? styles.fieldErrorText : null]}>{hint}</Text> : null}
    </View>
  );
}

export function DateField({
  label,
  value,
  onChange,
  minimumDate,
}: Readonly<{
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
  minimumDate?: string;
}>) {
  const [open, setOpen] = useState(false);
  const pickerDate = useMemo(() => new Date(`${value}T00:00:00`), [value]);
  const minDate = useMemo(
    () => (minimumDate ? new Date(`${minimumDate}T00:00:00`) : undefined),
    [minimumDate],
  );

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable onPress={() => setOpen(true)} style={styles.dateFieldButton}>
        <Text style={styles.dateFieldValue}>{formatDateLabel(value)}</Text>
        <Text style={styles.dateFieldHint}>Alterar</Text>
      </Pressable>
      {open ? (
        <DateTimePicker
          value={pickerDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          minimumDate={minDate}
          onChange={(_, selectedDate) => {
            setOpen(false);
            if (selectedDate) {
              const year = selectedDate.getFullYear();
              const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
              const day = String(selectedDate.getDate()).padStart(2, "0");
              onChange(`${year}-${month}-${day}`);
            }
          }}
        />
      ) : null}
    </View>
  );
}

export function DateRangeField({
  checkInDate,
  checkOutDate,
  guestCount,
  onCheckInChange,
  onCheckOutChange,
  onGuestCountChange,
}: Readonly<{
  checkInDate: string;
  checkOutDate: string;
  guestCount: string;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
  onGuestCountChange: (value: string) => void;
}>) {
  return (
    <View style={styles.dateRangeGrid}>
      <DateField label="Check-in" value={checkInDate} onChange={onCheckInChange} />
      <DateField label="Check-out" value={checkOutDate} onChange={onCheckOutChange} minimumDate={checkInDate} />
      <TextField label="Hospedes" value={guestCount} onChangeText={onGuestCountChange} keyboardType="numeric" />
    </View>
  );
}

export function Badge({
  label,
  tone = "info",
  style,
}: Readonly<{ label: string; tone?: BadgeTone; style?: StyleProp<ViewStyle> }>) {
  return (
    <View style={[styles.badge, badgeToneStyles[tone], style]}>
      <Text style={[styles.badgeLabel, badgeTextStyles[tone]]}>{label}</Text>
    </View>
  );
}

export function AmenityPill({ label }: Readonly<{ label: string }>) {
  return <Badge label={label} tone="new" style={styles.amenityPill} />;
}

export function AlertBanner({
  title,
  message,
  tone = "info",
}: Readonly<{
  title: string;
  message: string;
  tone?: "info" | "success" | "warning" | "error";
}>) {
  return (
    <View style={[styles.alertBanner, alertToneStyles[tone]]}>
      <View style={styles.alertIcon}><Text style={styles.alertIconLabel}>{tone === "success" ? "OK" : tone === "warning" ? "!" : tone === "error" ? "x" : "i"}</Text></View>
      <View style={styles.flexFill}>
        <Text style={styles.alertTitle}>{title}</Text>
        <Text style={styles.alertMessage}>{message}</Text>
      </View>
    </View>
  );
}

export function Toast({
  visible,
  tone,
  title,
  message,
  onDismiss,
}: Readonly<{
  visible: boolean;
  tone: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  onDismiss: () => void;
}>) {
  if (!visible) return null;

  return (
    <Pressable style={styles.toastWrap} onPress={onDismiss}>
      <View style={[styles.toast, alertToneStyles[tone]]}>
        <Text style={styles.toastTitle}>{title}</Text>
        <Text style={styles.toastMessage}>{message}</Text>
      </View>
    </Pressable>
  );
}

export function EmptyState({
  title,
  message,
  primaryLabel,
  onPrimaryPress,
  secondaryLabel,
  onSecondaryPress,
}: Readonly<{
  title: string;
  message: string;
  primaryLabel?: string;
  onPrimaryPress?: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
}>) {
  return (
    <Card style={styles.emptyStateCard}>
      <View style={styles.emptyStateIcon}><Text style={styles.emptyStateIconLabel}>?</Text></View>
      <Text style={styles.emptyStateTitle}>{title}</Text>
      <Text style={styles.emptyStateMessage}>{message}</Text>
      {primaryLabel ? <Button label={primaryLabel} onPress={onPrimaryPress} style={styles.emptyPrimaryButton} /> : null}
      {secondaryLabel ? (
        <Pressable onPress={onSecondaryPress}>
          <Text style={styles.emptyStateLink}>{secondaryLabel}</Text>
        </Pressable>
      ) : null}
    </Card>
  );
}

export function SkeletonCard() {
  return (
    <View style={styles.skeletonCard}>
      <View style={[styles.skeletonBlock, styles.skeletonHero]} />
      <View style={[styles.skeletonBlock, styles.skeletonTitle]} />
      <View style={[styles.skeletonBlock, styles.skeletonLine]} />
      <View style={[styles.skeletonBlock, styles.skeletonLineShort]} />
    </View>
  );
}

export function BottomSheet({
  title,
  subtitle,
  children,
}: Readonly<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}>) {
  return (
    <View style={styles.sheetBackdrop}>
      <View style={styles.sheetCard}>
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sheetSubtitle}>{subtitle}</Text> : null}
        <View style={styles.sheetContent}>{children}</View>
      </View>
    </View>
  );
}

export function Modal({
  visible,
  title,
  message,
  confirmLabel,
  onConfirm,
  cancelLabel = "Fechar",
  onCancel,
}: Readonly<{
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  cancelLabel?: string;
  onCancel: () => void;
}>) {
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <View style={styles.modalActions}>
            <Button label={cancelLabel} variant="secondary" onPress={onCancel} style={styles.flexFill} />
            <Button label={confirmLabel} onPress={onConfirm} style={styles.flexFill} />
          </View>
        </View>
      </View>
    </RNModal>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: Readonly<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
}>) {
  return (
    <View style={styles.sectionHeader}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function HeroCard({
  eyebrow,
  title,
  message,
  children,
}: Readonly<{
  eyebrow: string;
  title: string;
  message: string;
  children?: React.ReactNode;
}>) {
  return (
    <View style={styles.heroCard}>
      <Badge label={eyebrow} tone="premium" style={styles.heroBadge} />
      <Text style={styles.heroTitle}>{title}</Text>
      <Text style={styles.heroMessage}>{message}</Text>
      {children ? <View style={styles.heroActions}>{children}</View> : null}
    </View>
  );
}

const badgeToneStyles: Record<BadgeTone, ViewStyle> = {
  info: { backgroundColor: colors.statusInfoBg },
  success: { backgroundColor: colors.statusSuccessBg },
  warning: { backgroundColor: colors.statusWarningBg },
  error: { backgroundColor: colors.statusErrorBg },
  premium: { backgroundColor: colors.accentGold[100] },
  popular: { backgroundColor: colors.primary[100] },
  fullyBooked: { backgroundColor: colors.error[50] },
  new: { backgroundColor: colors.neutral[100] },
};

const badgeTextStyles: Record<BadgeTone, TextStyle> = {
  info: { color: colors.statusInfoFg },
  success: { color: colors.statusSuccessFg },
  warning: { color: colors.statusWarningFg },
  error: { color: colors.statusErrorFg },
  premium: { color: colors.accentGold[700] },
  popular: { color: colors.primary[700] },
  fullyBooked: { color: colors.error[700] },
  new: { color: colors.neutral[700] },
};

const alertToneStyles = {
  info: { backgroundColor: colors.statusInfoBg, borderColor: colors.info[500] },
  success: { backgroundColor: colors.statusSuccessBg, borderColor: colors.success[500] },
  warning: { backgroundColor: colors.statusWarningBg, borderColor: colors.warning[500] },
  error: { backgroundColor: colors.statusErrorBg, borderColor: colors.error[500] },
} as const;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: componentTokens.card.padding,
    gap: componentTokens.card.gap,
    shadowColor: shadows.sm.shadowColor,
    shadowOffset: shadows.sm.shadowOffset,
    shadowOpacity: shadows.sm.shadowOpacity,
    shadowRadius: shadows.sm.shadowRadius,
    elevation: shadows.sm.elevation,
  },
  button: {
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSm: {
    minHeight: componentTokens.button.height.sm,
    paddingHorizontal: componentTokens.button.paddingX.sm,
  },
  buttonMd: {
    minHeight: componentTokens.button.height.md,
    paddingHorizontal: componentTokens.button.paddingX.md,
  },
  buttonLg: {
    minHeight: componentTokens.button.height.lg,
    paddingHorizontal: componentTokens.button.paddingX.lg,
  },
  buttonPrimary: {
    backgroundColor: colors.primaryAction,
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  buttonGhost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonAccentGold: {
    backgroundColor: colors.accentHighlight,
  },
  buttonDestructive: {
    backgroundColor: colors.dangerAction,
  },
  buttonPressed: {
    opacity: 0.88,
  },
  buttonDisabled: {
    opacity: 0.58,
  },
  buttonLabel: {
    fontFamily: fontFamilies.uiSemiBold,
    fontSize: 14,
    color: colors.textInverse,
  },
  buttonLabelDark: {
    color: colors.text,
  },
  buttonLabelAccent: {
    color: colors.neutral[900],
  },
  fieldWrap: {
    gap: spacing.xs,
  },
  fieldLabel: {
    ...typeScale.labelSm,
    color: colors.text,
  },
  fieldHint: {
    ...typeScale.labelSm,
    color: colors.textMuted,
  },
  fieldErrorText: {
    color: colors.statusErrorFg,
  },
  textField: {
    minHeight: componentTokens.input.height,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    paddingHorizontal: componentTokens.input.paddingX,
    paddingVertical: componentTokens.input.paddingY,
    fontFamily: fontFamilies.uiRegular,
    fontSize: 15,
  },
  textFieldReadonly: {
    backgroundColor: colors.surfaceMuted,
    color: colors.textMuted,
  },
  textFieldError: {
    borderColor: colors.error[500],
  },
  textFieldMultiline: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  dateFieldButton: {
    minHeight: componentTokens.input.height,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: componentTokens.input.paddingX,
    paddingVertical: componentTokens.input.paddingY,
    justifyContent: "center",
    gap: 2,
  },
  dateFieldValue: {
    ...typeScale.labelLg,
    color: colors.text,
  },
  dateFieldHint: {
    ...typeScale.labelSm,
    color: colors.textMuted,
  },
  dateRangeGrid: {
    gap: spacing.sm,
  },
  badge: {
    minHeight: componentTokens.badge.height,
    paddingHorizontal: componentTokens.badge.paddingX,
    paddingVertical: componentTokens.badge.paddingY,
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    justifyContent: "center",
  },
  badgeLabel: {
    ...typeScale.labelSm,
  },
  amenityPill: {
    minHeight: componentTokens.chip.height,
    paddingHorizontal: componentTokens.chip.paddingX,
    paddingVertical: componentTokens.chip.paddingY,
  },
  alertBanner: {
    flexDirection: "row",
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: spacing.md,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  alertIconLabel: {
    ...typeScale.labelMd,
    color: colors.text,
  },
  alertTitle: {
    ...typeScale.labelLg,
    color: colors.text,
  },
  alertMessage: {
    ...typeScale.bodySm,
    color: colors.textMuted,
    marginTop: 4,
  },
  toastWrap: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    top: spacing.md,
    zIndex: 50,
  },
  toast: {
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: spacing.md,
    shadowColor: shadows.md.shadowColor,
    shadowOffset: shadows.md.shadowOffset,
    shadowOpacity: shadows.md.shadowOpacity,
    shadowRadius: shadows.md.shadowRadius,
    elevation: shadows.md.elevation,
  },
  toastTitle: {
    ...typeScale.labelLg,
    color: colors.text,
  },
  toastMessage: {
    ...typeScale.bodySm,
    color: colors.textMuted,
    marginTop: 4,
  },
  emptyStateCard: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
  },
  emptyStateIcon: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    backgroundColor: colors.primary[50],
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateIconLabel: {
    fontFamily: fontFamilies.uiBold,
    fontSize: 28,
    color: colors.primaryAction,
  },
  emptyStateTitle: {
    ...typeScale.displayMd,
    color: colors.text,
    textAlign: "center",
    marginTop: spacing.md,
  },
  emptyStateMessage: {
    ...typeScale.bodyMd,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.sm,
    maxWidth: 320,
  },
  emptyPrimaryButton: {
    marginTop: spacing.lg,
    alignSelf: "stretch",
  },
  emptyStateLink: {
    ...typeScale.labelMd,
    color: colors.primaryAction,
    marginTop: spacing.sm,
  },
  skeletonCard: {
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  skeletonBlock: {
    backgroundColor: colors.neutral[100],
    borderRadius: radius.sm,
  },
  skeletonHero: {
    height: 160,
  },
  skeletonTitle: {
    width: "70%",
    height: 18,
  },
  skeletonLine: {
    width: "100%",
    height: 12,
  },
  skeletonLineShort: {
    width: "56%",
    height: 12,
  },
  sheetBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: colors.overlay,
  },
  sheetCard: {
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.borderStrong,
    marginBottom: spacing.sm,
  },
  sheetTitle: {
    ...typeScale.displayMd,
    color: colors.text,
  },
  sheetSubtitle: {
    ...typeScale.bodySm,
    color: colors.textMuted,
  },
  sheetContent: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  modalBackdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.overlay,
    padding: spacing.lg,
  },
  modalCard: {
    width: "100%",
    maxWidth: componentTokens.modal.width,
    borderRadius: radius.xxl,
    backgroundColor: colors.surface,
    padding: componentTokens.modal.padding,
    gap: spacing.md,
  },
  modalTitle: {
    ...typeScale.displayMd,
    color: colors.text,
  },
  modalMessage: {
    ...typeScale.bodyMd,
    color: colors.textMuted,
  },
  modalActions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  sectionHeader: {
    gap: spacing.xs,
  },
  eyebrow: {
    ...typeScale.overline,
    color: colors.textSubtle,
    textTransform: "uppercase",
  },
  sectionTitle: {
    ...typeScale.displayMd,
    color: colors.text,
  },
  sectionSubtitle: {
    ...typeScale.bodyMd,
    color: colors.textMuted,
  },
  heroCard: {
    borderRadius: radius.xxl,
    backgroundColor: colors.primary[700],
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: shadows.lg.shadowColor,
    shadowOffset: shadows.lg.shadowOffset,
    shadowOpacity: shadows.lg.shadowOpacity,
    shadowRadius: shadows.lg.shadowRadius,
    elevation: shadows.lg.elevation,
  },
  heroBadge: {
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  heroTitle: {
    ...typeScale.displayLg,
    color: colors.textInverse,
  },
  heroMessage: {
    ...typeScale.bodyLg,
    color: "rgba(255,255,255,0.82)",
  },
  heroActions: {
    gap: spacing.sm,
  },
  flexFill: {
    flex: 1,
  },
});

export const colorPrimitives = {
  primary: {
    50: "#F2F5FF",
    100: "#E2EAFF",
    200: "#C3D4FF",
    300: "#9AB8FF",
    400: "#6D93FF",
    500: "#4C75FF",
    600: "#2F5BEA",
    700: "#2447BE",
    800: "#1C388F",
    900: "#172B67",
  },
  accentGold: {
    50: "#FFF8E5",
    100: "#FFEEBF",
    200: "#FFE08C",
    300: "#FFD055",
    400: "#F7BE2C",
    500: "#D8A317",
    600: "#B6840F",
    700: "#8C650C",
    800: "#664908",
    900: "#443005",
  },
  neutral: {
    0: "#FFFFFF",
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },
  success: {
    50: "#EAFBF2",
    500: "#20B26B",
    700: "#167B4B",
  },
  warning: {
    50: "#FFF5E6",
    500: "#F2A51A",
    700: "#B5760C",
  },
  error: {
    50: "#FFF0F1",
    500: "#E14B59",
    700: "#AE3541",
  },
  info: {
    50: "#EAF3FF",
    500: "#3D7DFF",
    700: "#2A5FBE",
  },
} as const;

export const semanticColors = {
  background: colorPrimitives.neutral[50],
  backgroundAccent: "#EFF4FF",
  backgroundSuccess: "#EDF9F2",
  surface: colorPrimitives.neutral[0],
  surfaceMuted: "#F6F8FC",
  surfaceInverse: "#1C2230",
  text: colorPrimitives.neutral[900],
  textMuted: colorPrimitives.neutral[500],
  textSubtle: colorPrimitives.neutral[400],
  textInverse: colorPrimitives.neutral[0],
  border: colorPrimitives.neutral[200],
  borderStrong: colorPrimitives.neutral[300],
  primaryAction: colorPrimitives.primary[600],
  primaryActionHover: colorPrimitives.primary[700],
  accentHighlight: colorPrimitives.accentGold[500],
  accentHighlightHover: colorPrimitives.accentGold[600],
  successAction: colorPrimitives.success[500],
  successActionHover: colorPrimitives.success[700],
  dangerAction: colorPrimitives.error[500],
  dangerActionHover: colorPrimitives.error[700],
  statusInfoBg: colorPrimitives.info[50],
  statusInfoFg: colorPrimitives.info[700],
  statusSuccessBg: colorPrimitives.success[50],
  statusSuccessFg: colorPrimitives.success[700],
  statusWarningBg: colorPrimitives.warning[50],
  statusWarningFg: colorPrimitives.warning[700],
  statusErrorBg: colorPrimitives.error[50],
  statusErrorFg: colorPrimitives.error[700],
  overlay: "rgba(15, 23, 42, 0.48)",
} as const;

export const spacing = {
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  32: 32,
  40: 40,
  48: 48,
  64: 64,
  80: 80,
  96: 96,
} as const;

export const radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 9999,
} as const;

export const fontRoles = {
  display: "display",
  ui: "ui",
} as const;

export const typography = {
  displayXl: { role: fontRoles.display, size: 56, lineHeight: 64, weight: 700, letterSpacing: -1.2 },
  displayLg: { role: fontRoles.display, size: 48, lineHeight: 56, weight: 700, letterSpacing: -1 },
  displayMd: { role: fontRoles.display, size: 40, lineHeight: 48, weight: 700, letterSpacing: -0.8 },
  h1: { role: fontRoles.ui, size: 32, lineHeight: 40, weight: 700, letterSpacing: -0.6 },
  h2: { role: fontRoles.ui, size: 28, lineHeight: 36, weight: 700, letterSpacing: -0.5 },
  h3: { role: fontRoles.ui, size: 24, lineHeight: 32, weight: 600, letterSpacing: -0.4 },
  h4: { role: fontRoles.ui, size: 20, lineHeight: 28, weight: 600, letterSpacing: -0.3 },
  h5: { role: fontRoles.ui, size: 18, lineHeight: 26, weight: 600, letterSpacing: -0.2 },
  bodyLg: { role: fontRoles.ui, size: 18, lineHeight: 30, weight: 400, letterSpacing: 0 },
  bodyMd: { role: fontRoles.ui, size: 16, lineHeight: 26, weight: 400, letterSpacing: 0 },
  bodySm: { role: fontRoles.ui, size: 14, lineHeight: 22, weight: 400, letterSpacing: 0 },
  labelL: { role: fontRoles.ui, size: 16, lineHeight: 24, weight: 500, letterSpacing: 0 },
  labelM: { role: fontRoles.ui, size: 14, lineHeight: 20, weight: 500, letterSpacing: 0 },
  labelS: { role: fontRoles.ui, size: 12, lineHeight: 18, weight: 500, letterSpacing: 0 },
  caption: { role: fontRoles.ui, size: 12, lineHeight: 16, weight: 400, letterSpacing: 0 },
  overline: { role: fontRoles.ui, size: 11, lineHeight: 16, weight: 600, letterSpacing: 1.2 },
} as const;

export const elevation = {
  sm: {
    boxShadow: "0 2px 8px rgba(20,24,31,0.06)",
    shadowColor: "#14181F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    boxShadow: "0 8px 24px rgba(20,24,31,0.10)",
    shadowColor: "#14181F",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 6,
  },
  lg: {
    boxShadow: "0 20px 50px rgba(20,24,31,0.16)",
    shadowColor: "#14181F",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.16,
    shadowRadius: 50,
    elevation: 12,
  },
} as const;

export const componentTokens = {
  button: {
    height: { sm: 36, md: 44, lg: 52 },
    paddingX: { sm: 14, md: 18, lg: 24 },
    paddingY: { sm: 8, md: 12, lg: 14 },
  },
  input: {
    height: 52,
    paddingX: 16,
    paddingY: 14,
  },
  badge: {
    height: 26,
    paddingX: 12,
    paddingY: 4,
  },
  chip: {
    height: 38,
    paddingX: 16,
    paddingY: 9,
  },
  modal: {
    width: 354,
    padding: 32,
  },
  sheet: {
    width: 390,
    padding: 21,
    handleWidth: 40,
    handleHeight: 4,
  },
  card: {
    padding: 20,
    gap: 16,
  },
} as const;

export const buttonVariants = ["primary", "secondary", "ghost", "accentGold", "destructive"] as const;
export const buttonSizes = ["sm", "md", "lg"] as const;
export const badgeTones = [
  "info",
  "success",
  "warning",
  "error",
  "premium",
  "popular",
  "fullyBooked",
  "new",
] as const;

export type ButtonVariant = (typeof buttonVariants)[number];
export type ButtonSize = (typeof buttonSizes)[number];
export type BadgeTone = (typeof badgeTones)[number];

function colorScaleToCssVars(prefix: string, values: Record<string | number, string>) {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [`--hh-${prefix}-${key}`, value]),
  );
}

export function createWebCssVariables(): Record<string, string> {
  return {
    "--hh-background": semanticColors.background,
    "--hh-background-accent": semanticColors.backgroundAccent,
    "--hh-background-success": semanticColors.backgroundSuccess,
    "--hh-surface": semanticColors.surface,
    "--hh-surface-muted": semanticColors.surfaceMuted,
    "--hh-surface-inverse": semanticColors.surfaceInverse,
    "--hh-text": semanticColors.text,
    "--hh-text-muted": semanticColors.textMuted,
    "--hh-text-subtle": semanticColors.textSubtle,
    "--hh-text-inverse": semanticColors.textInverse,
    "--hh-border": semanticColors.border,
    "--hh-border-strong": semanticColors.borderStrong,
    "--hh-primary-action": semanticColors.primaryAction,
    "--hh-primary-action-hover": semanticColors.primaryActionHover,
    "--hh-accent-highlight": semanticColors.accentHighlight,
    "--hh-accent-highlight-hover": semanticColors.accentHighlightHover,
    "--hh-success-action": semanticColors.successAction,
    "--hh-success-action-hover": semanticColors.successActionHover,
    "--hh-danger-action": semanticColors.dangerAction,
    "--hh-danger-action-hover": semanticColors.dangerActionHover,
    "--hh-status-info-bg": semanticColors.statusInfoBg,
    "--hh-status-info-fg": semanticColors.statusInfoFg,
    "--hh-status-success-bg": semanticColors.statusSuccessBg,
    "--hh-status-success-fg": semanticColors.statusSuccessFg,
    "--hh-status-warning-bg": semanticColors.statusWarningBg,
    "--hh-status-warning-fg": semanticColors.statusWarningFg,
    "--hh-status-error-bg": semanticColors.statusErrorBg,
    "--hh-status-error-fg": semanticColors.statusErrorFg,
    "--hh-overlay": semanticColors.overlay,
    "--hh-shadow-sm": elevation.sm.boxShadow,
    "--hh-shadow-md": elevation.md.boxShadow,
    "--hh-shadow-lg": elevation.lg.boxShadow,
    ...colorScaleToCssVars("primary", colorPrimitives.primary),
    ...colorScaleToCssVars("accent-gold", colorPrimitives.accentGold),
    ...colorScaleToCssVars("neutral", colorPrimitives.neutral),
    ...colorScaleToCssVars("success", colorPrimitives.success),
    ...colorScaleToCssVars("warning", colorPrimitives.warning),
    ...colorScaleToCssVars("error", colorPrimitives.error),
    ...colorScaleToCssVars("info", colorPrimitives.info),
  };
}

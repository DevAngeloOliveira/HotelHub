import {
  colorPrimitives,
  componentTokens,
  elevation,
  radius as sharedRadius,
  semanticColors,
  spacing as sharedSpacing,
  typography as sharedTypography,
} from "@hotelhub/design-tokens";

export const colors = {
  ...colorPrimitives,
  ...semanticColors,
  white: colorPrimitives.neutral[0],
} as const;

export const spacing = {
  xxs: sharedSpacing[4],
  xs: sharedSpacing[8],
  sm: sharedSpacing[12],
  md: sharedSpacing[16],
  lg: sharedSpacing[24],
  xl: sharedSpacing[32],
  xxl: sharedSpacing[40],
  xxxl: sharedSpacing[48],
  hero: sharedSpacing[64],
} as const;

export const radius = {
  xs: sharedRadius.xs,
  sm: sharedRadius.sm,
  md: sharedRadius.md,
  lg: sharedRadius.lg,
  xl: sharedRadius.xl,
  xxl: sharedRadius.xxl,
  pill: sharedRadius.pill,
} as const;

export const fontFamilies = {
  display: "PlayfairDisplay_700Bold",
  uiRegular: "Inter_400Regular",
  uiMedium: "Inter_500Medium",
  uiSemiBold: "Inter_600SemiBold",
  uiBold: "Inter_700Bold",
} as const;

export const typeScale = {
  displayXl: {
    fontFamily: fontFamilies.display,
    fontSize: sharedTypography.displayXl.size,
    lineHeight: sharedTypography.displayXl.lineHeight,
  },
  displayLg: {
    fontFamily: fontFamilies.display,
    fontSize: sharedTypography.displayLg.size,
    lineHeight: sharedTypography.displayLg.lineHeight,
  },
  displayMd: {
    fontFamily: fontFamilies.display,
    fontSize: sharedTypography.displayMd.size,
    lineHeight: sharedTypography.displayMd.lineHeight,
  },
  h1: {
    fontFamily: fontFamilies.uiBold,
    fontSize: sharedTypography.h1.size,
    lineHeight: sharedTypography.h1.lineHeight,
  },
  h2: {
    fontFamily: fontFamilies.uiBold,
    fontSize: sharedTypography.h2.size,
    lineHeight: sharedTypography.h2.lineHeight,
  },
  h3: {
    fontFamily: fontFamilies.uiSemiBold,
    fontSize: sharedTypography.h3.size,
    lineHeight: sharedTypography.h3.lineHeight,
  },
  bodyLg: {
    fontFamily: fontFamilies.uiRegular,
    fontSize: sharedTypography.bodyLg.size,
    lineHeight: sharedTypography.bodyLg.lineHeight,
  },
  bodyMd: {
    fontFamily: fontFamilies.uiRegular,
    fontSize: sharedTypography.bodyMd.size,
    lineHeight: sharedTypography.bodyMd.lineHeight,
  },
  bodySm: {
    fontFamily: fontFamilies.uiRegular,
    fontSize: sharedTypography.bodySm.size,
    lineHeight: sharedTypography.bodySm.lineHeight,
  },
  labelLg: {
    fontFamily: fontFamilies.uiMedium,
    fontSize: sharedTypography.labelL.size,
    lineHeight: sharedTypography.labelL.lineHeight,
  },
  labelMd: {
    fontFamily: fontFamilies.uiMedium,
    fontSize: sharedTypography.labelM.size,
    lineHeight: sharedTypography.labelM.lineHeight,
  },
  labelSm: {
    fontFamily: fontFamilies.uiMedium,
    fontSize: sharedTypography.labelS.size,
    lineHeight: sharedTypography.labelS.lineHeight,
  },
  overline: {
    fontFamily: fontFamilies.uiBold,
    fontSize: sharedTypography.overline.size,
    lineHeight: sharedTypography.overline.lineHeight,
    letterSpacing: sharedTypography.overline.letterSpacing,
  },
} as const;

export const shadows = elevation;
export { componentTokens };

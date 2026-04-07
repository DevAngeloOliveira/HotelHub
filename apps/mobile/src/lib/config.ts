const rawBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? "";

export const apiBaseUrl = rawBaseUrl.replace(/\/+$/, "");
export const accessToken = process.env.EXPO_PUBLIC_ACCESS_TOKEN ?? "";

export const features = {
  publicApiEnabled: Boolean(apiBaseUrl),
  protectedApiEnabled: Boolean(apiBaseUrl && accessToken),
} as const;

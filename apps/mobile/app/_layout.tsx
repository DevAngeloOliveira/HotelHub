import "react-native-gesture-handler";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import { ActivityIndicator, View } from "react-native";
import { Toast } from "../src/components/primitives";
import { HotelHubProvider, useHotelHub } from "../src/state/hotelhub-provider";
import { colors } from "../src/theme/tokens";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingShell}>
        <ActivityIndicator color={colors.primaryAction} size="large" />
      </View>
    );
  }

  return (
    <HotelHubProvider>
      <StatusBar style="dark" />
      <AppShell />
    </HotelHubProvider>
  );
}

const styles = {
  loadingShell: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: colors.background,
  },
};

function AppShell() {
  const { toast, dismissToast } = useHotelHub();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="destinations/index" />
        <Stack.Screen name="destinations/[id]" />
        <Stack.Screen name="hotels/[id]/index" />
        <Stack.Screen name="hotels/[id]/availability" />
        <Stack.Screen
          name="reservations/create"
          options={{
            animation: "slide_from_bottom",
            presentation: "transparentModal",
          }}
        />
      </Stack>
      <Toast
        visible={Boolean(toast)}
        tone={toast?.tone ?? "info"}
        title={toast?.title ?? ""}
        message={toast?.message ?? ""}
        onDismiss={dismissToast}
      />
    </>
  );
}

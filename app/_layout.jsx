import { useState } from "react";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import LoginScreen from "../components/LoginScreen";
import SplashScreen from "../components/SplashScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SecureStore from "expo-secure-store";
import { View, Text } from "react-native"; // Added Text import

const tokenCache = {
  async getToken(key) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {}
  },
  async clearToken(key) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {}
  },
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "outfit": require("@/assets/fonts/Poppins-Regular.ttf"),
    "outfit-medium": require("@/assets/fonts/Poppins-Medium.ttf"),
    "outfit-bold": require("@/assets/fonts/Poppins-Bold.ttf"),
  });

  const [isSplashVisible, setIsSplashVisible] = useState(true);

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    );
  }

  if (!fontsLoaded || isSplashVisible) {
    return <SplashScreen onAnimationEnd={() => setIsSplashVisible(false)} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <SignedIn>
          <Slot />
        </SignedIn>
        <SignedOut>
          <LoginScreen />
        </SignedOut>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
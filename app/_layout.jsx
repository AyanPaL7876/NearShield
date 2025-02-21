import { useState } from "react";
import { Slot } from "expo-router";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import LoginScreen from "../components/LoginScreen";
import SplashScreen from "../components/SplashScreen";
import * as SecureStore from "expo-secure-store";

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
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    );
  }

  if (isSplashVisible) {
    return (
        <SplashScreen onAnimationEnd={() => setIsSplashVisible(false)} />
  );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <SignedIn>
        <Slot />
      </SignedIn>
      <SignedOut>
        <LoginScreen />
      </SignedOut>
    </ClerkProvider>
  );
}

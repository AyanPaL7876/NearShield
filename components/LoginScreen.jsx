import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from "../hooks/useWarmUpBrowser";
import { useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

WebBrowser.maybeCompleteAuthSession();

const { width } = Dimensions.get("window");

const LoginScreen = () => {
  useWarmUpBrowser();
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        router.replace("/(tabs)/home");
      }
    } catch (error) {
      console.error("OAuth error ", error);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(1000)} style={styles.content}>
        <Image source={require("../assets/images/loging-top-img.jpg")} style={styles.image} resizeMode="contain" />

        <Text style={styles.title}>NearShield</Text>
        <Text style={styles.subtitle}>Safety & Emergency Response System</Text>

        <TouchableOpacity style={styles.button} onPress={onPress}>
          <AntDesign name="google" size={24} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    alignItems: "center",
    width: "100%",
  },
  image: {
    width: width * 0.75,
    height: width * 0.75,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "outfit",
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#4285F4",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.85,
    maxWidth: 400,
    shadowColor: "#4285F4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  icon: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "outfit-medium",
    color: "#FFFFFF",
  },
});

export default LoginScreen;

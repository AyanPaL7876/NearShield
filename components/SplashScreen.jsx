import { useEffect, useState } from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function SplashScreen({ onAnimationEnd }) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const bgScale = useSharedValue(0);
  const dotScale = useSharedValue(0);

  useEffect(() => {
    // Background circle animation
    bgScale.value = withTiming(1, {
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    // Icon and text animations
    scale.value = withSequence(
      withDelay(
        400,
        withSpring(1, {
          damping: 12,
          stiffness: 100,
        })
      ),
      withDelay(1500, withTiming(0.9, { duration: 500 }))
    );

    opacity.value = withSequence(
      withDelay(400, withTiming(1, { duration: 800 })),
      withDelay(1500, withTiming(0, { duration: 500 }))
    );

    translateY.value = withSequence(
      withTiming(0, { duration: 800 }),
      withDelay(1500, withTiming(-50, { duration: 500 }))
    );

    // Decorative dots animation
    dotScale.value = withDelay(
      600,
      withSpring(1, {
        damping: 12,
        stiffness: 100,
      })
    );

    // Hide splash screen after animation
    const timeout = setTimeout(() => {
      onAnimationEnd(); // Notify parent to hide the splash screen
    }, 3300);

    return () => clearTimeout(timeout);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const bgStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bgScale.value }],
    opacity: interpolate(bgScale.value, [0, 1], [0, 0.15]),
  }));

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
    opacity: interpolate(dotScale.value, [0, 1], [0, 0.3]),
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backgroundCircle, bgStyle]} />
      <Animated.View style={[styles.decorativeDots, dotStyle]} />

      <Animated.View style={[styles.content, containerStyle]}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="city-variant"
            size={80}
            color="#4285F4"
          />
        </View>
        <ThemedText style={styles.title}>Smart City</ThemedText>
        <ThemedText style={styles.subtitle}>Safety & Security</ThemedText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundCircle: {
    position: "absolute",
    width: height * 0.8,
    height: height * 0.8,
    borderRadius: height * 0.4,
    backgroundColor: "#4285F4",
    opacity: 0.15,
  },
  decorativeDots: {
    position: "absolute",
    width: width,
    height: height,
    opacity: 0.3,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  iconContainer: {
    width: width * 0.35,
    height: width * 0.35,
    backgroundColor: "rgba(66, 133, 244, 0.1)",
    borderRadius: width * 0.175,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#4285F4",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  title: {
    fontSize: 36,
    fontFamily: "Poppins-Bold",
    color: "#333",
    textAlign: "center",
    paddingTop: 18,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    color: "#666",
    textAlign: "center",
    opacity: 0.8,
  },
});

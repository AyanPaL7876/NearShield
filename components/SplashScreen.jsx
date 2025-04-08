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
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function SplashScreen({ onAnimationEnd }) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const bgScale = useSharedValue(0);
  const dotScale = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  const shieldPulse = useSharedValue(1);

  useEffect(() => {
    // Background circle animation
    bgScale.value = withTiming(1, {
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    // Logo rotation animation
    logoRotate.value = withSequence(
      withTiming(360, { duration: 1500, easing: Easing.elastic(1) }),
      withTiming(0, { duration: 0 }) // Reset for potential reuse
    );

    // Shield pulse animation
    shieldPulse.value = withSequence(
      withTiming(1.1, { duration: 500, easing: Easing.ease }),
      withTiming(1, { duration: 500, easing: Easing.ease }),
      withTiming(1.05, { duration: 300, easing: Easing.ease }),
      withTiming(1, { duration: 300, easing: Easing.ease })
    );

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

    // Hide splash screen after animation
    const timeout = setTimeout(() => {
      onAnimationEnd();
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

  const logoStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${logoRotate.value}deg` },
      { scale: shieldPulse.value }
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backgroundCircle, bgStyle]} />
      
      <Animated.View style={[styles.content, containerStyle]}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <View style={styles.shieldOutline}>
            <FontAwesome5
              name="shield-alt"
              size={80}
              color="#4285F4"
              style={styles.shadow}
            />
          </View>
          <View style={styles.iconCenter}>
            <MaterialCommunityIcons
              name="police-badge"
              size={40}
              color="#FFFFFF"
            />
          </View>
        </Animated.View>
        
        <ThemedText style={styles.title}>NearShield</ThemedText>
        <ThemedText style={styles.subtitle}>Emergency & LocalNews</ThemedText>
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
  content: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  logoContainer: {
    position: 'relative',
    width: width * 0.35,
    height: width * 0.35,
    marginBottom: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  shieldOutline: {
    position: 'absolute',
  },
  iconCenter: {
    position: 'absolute',
    backgroundColor: '#4285F4',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  shadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
    color: "#333",
    textAlign: "center",
    padding:5,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#666",
    textAlign: "center",
    opacity: 0.9,
    letterSpacing: 0.5,
  },
});
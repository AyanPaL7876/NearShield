import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { useSharedValue, withSpring, withTiming, withDelay, withSequence, interpolate, Easing, useAnimatedStyle } from 'react-native-reanimated';
import { router } from 'expo-router';

const { height } = Dimensions.get('window');

export const useSplashAnimation = () => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const bgScale = useSharedValue(0);
  const dotScale = useSharedValue(0);

  useEffect(() => {
    bgScale.value = withTiming(1, { 
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
    });

    scale.value = withSequence(
      withDelay(400, withSpring(1, { damping: 12, stiffness: 100 })),
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

    dotScale.value = withDelay(600, withSpring(1, { damping: 12, stiffness: 100 }));

    const timeout = setTimeout(() => {
      router.replace('/home');
    }, 3300);

    return () => clearTimeout(timeout);
  }, []);

  return {
    containerStyle: useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
      opacity: opacity.value,
    })),

    bgStyle: useAnimatedStyle(() => ({
      transform: [{ scale: bgScale.value }],
      opacity: interpolate(bgScale.value, [0, 1], [0, 0.15]),
    })),

    dotStyle: useAnimatedStyle(() => ({
      transform: [{ scale: dotScale.value }],
      opacity: interpolate(dotScale.value, [0, 1], [0, 0.3]),
    })),
  };
};

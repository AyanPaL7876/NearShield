import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 70;
const MIDDLE_BUTTON_SIZE = 58;

export default function CustomTabBar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  
  // Animation value for the center button
  const [scaleAnimation] = useState(new Animated.Value(1));
  
  const tabs = [
    {
      route: 'home',
      label: 'Home',
      icon: (color) => <Ionicons name="home" size={24} color={color} />,
    },
    {
      route: 'explore',
      label: 'Explore',
      icon: (color) => <AntDesign name="search1" size={24} color={color} />,
    },
    {
      route: 'profile',
      label: 'Profile',
      icon: (color) => <FontAwesome name="user" size={24} color={color} />,
    },
  ];

  const handleTabPress = (route) => {
    // Animate the center button when pressed
    if (route === 'explore') {
      Animated.sequence([
        Animated.timing(scaleAnimation, {
          toValue: 0.85,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    router.push(route);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabBarContainer}>
        <Svg
          width={width}
          height={TAB_BAR_HEIGHT + 20}
          viewBox={`0 0 ${width} ${TAB_BAR_HEIGHT + 20}`}
          style={styles.background}
        >
          <Path
            d={`
              M 0,20
              L ${width / 2 - 30},20
              C ${width / 2 - 10},20 ${width / 2 - 10},0 ${width / 2},0
              C ${width / 2 + 10},0 ${width / 2 + 10},20 ${width / 2 + 30},20
              L ${width},20
              L ${width},${TAB_BAR_HEIGHT + 20}
              L 0,${TAB_BAR_HEIGHT + 20}
              Z
            `}
            fill="#ffffff"
          />
        </Svg>

        <View style={styles.tabsContainer}>
          {tabs.map((tab, index) => {
            const isActive = pathname === `/${tab.route}`;
            const color = isActive ? Colors.PRIMARY : '#9CA3AF';
            
            // Center button (Explore)
            if (index === 1) {
              return (
                <TouchableOpacity
                  key={tab.route}
                  style={styles.centerButtonContainer}
                  onPress={() => handleTabPress(tab.route)}
                  activeOpacity={0.8}
                >
                  <Animated.View
                    style={[
                      styles.centerButton,
                      {
                        transform: [{ scale: scaleAnimation }],
                      },
                    ]}
                  >
                    {tab.icon('#FFFFFF')}
                  </Animated.View>
                </TouchableOpacity>
              );
            }
            
            // Regular tab buttons
            return (
              <TouchableOpacity
                key={tab.route}
                style={styles.tabButton}
                onPress={() => handleTabPress(tab.route)}
                activeOpacity={0.7}
              >
                {tab.icon(color)}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  tabBarContainer: {
    position: 'relative',
    width: '100%',
    height: TAB_BAR_HEIGHT,
  },
  background: {
    position: 'absolute',
    top: -20,
    left: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  centerButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButton: {
    width: MIDDLE_BUTTON_SIZE,
    height: MIDDLE_BUTTON_SIZE,
    borderRadius: MIDDLE_BUTTON_SIZE / 2,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: Colors.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});
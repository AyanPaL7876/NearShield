import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, useColorScheme as useDeviceColorScheme } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  const deviceColorScheme = useDeviceColorScheme();
  const isDark = deviceColorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? Colors.dark.tint : Colors.light.tint,
        headerShown: false,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: isDark ? '#000000' : '#FFFFFF',
          },
          default: {
            backgroundColor: isDark ? '#000000' : '#FFFFFF',
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="view-dashboard" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="guidelines"
        options={{
          title: 'Guidelines',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="book.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="facilities"
        options={{
          title: 'Facilities',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="building.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="ai-analysis"
        options={{
          title: 'AI Analysis',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="brain.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}

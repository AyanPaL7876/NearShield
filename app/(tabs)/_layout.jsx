import { Tabs } from "expo-router";
import React from "react";
import { View, StyleSheet, SafeAreaView, Platform, Animated } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from '@expo/vector-icons/Octicons';
import { Colors } from '../../constants/Colors';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

const ACTIVE_TAB_SIZE = 28;
const INACTIVE_TAB_SIZE = 24;
const CENTER_TAB_SIZE = 32;

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar
        backgroundColor={Colors.primary}
        barStyle="light-content" 
      />
      
      <SafeAreaView style={styles.safeArea}>
        <Tabs
          initialRouteName="home"
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: "#A1A1A1",
            tabBarShowLabel: false,
            tabBarStyle: styles.tabBar,
            tabBarItemStyle: styles.tabBarItem,
            tabBarIcon: ({ color, focused }) => {
              let iconComponent;
              let size;
              
              if (route.name === 'add') {
                size = CENTER_TAB_SIZE;
                iconComponent = (
                  <View style={[styles.centerTab, focused && styles.centerTabActive]}>
                    <MaterialIcons 
                      name="add" 
                      size={size} 
                      color={focused ? "#fff" : Colors.primary} 
                    />
                  </View>
                );
              } else {
                size = focused ? ACTIVE_TAB_SIZE : INACTIVE_TAB_SIZE;
                
                switch (route.name) {
                  case 'home':
                    iconComponent = <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />;
                    break;
                  case 'report':
                    iconComponent = <Octicons name="report" size={size} color={color} />;
                    break;
                  case 'explore':
                    iconComponent = <FontAwesome6 name="map-location-dot" size={size} color={color} />;
                    break;
                  case 'profile':
                    iconComponent = <FontAwesome6 name={focused ? "user-large" : "user"} size={size} color={color} />;
                    break;
                }
                
                iconComponent = (
                  <View style={styles.iconContainer}>
                    {iconComponent}
                    {focused && <View style={styles.activeIndicator} />}
                  </View>
                );
              }
              
              return iconComponent;
            },
          })}
        >
          <Tabs.Screen name="home" />
          <Tabs.Screen name="report" />
          <Tabs.Screen name="add" />
          <Tabs.Screen name="explore" />
          <Tabs.Screen name="profile" />
        </Tabs>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  tabBar: {
    height: Platform.OS === 'ios' ? 90 : 75,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 5,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderTopWidth: 0,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  tabBarItem: {
    height: '100%',
    paddingVertical: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -4,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  centerTab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    top: -20,
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  centerTabActive: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
});
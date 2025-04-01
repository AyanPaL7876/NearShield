import { Tabs } from "expo-router";
import React from "react";
import { View, StyleSheet, SafeAreaView, Platform } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Octicons from '@expo/vector-icons/Octicons';
import { Colors } from '../../constants/Colors';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

const ACTIVE_TAB_SIZE = 26;
const INACTIVE_TAB_SIZE = 20;

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
            tabBarInactiveTintColor: "#9E9E9E",
            tabBarShowLabel: true,
            tabBarLabelStyle: styles.tabBarLabel,
            tabBarStyle: styles.tabBar,
            tabBarItemStyle: styles.tabBarItem,
            tabBarIcon: ({ color, focused }) => {
              const size = focused ? ACTIVE_TAB_SIZE : INACTIVE_TAB_SIZE;
              
              let iconComponent;
              
              switch (route.name) {
                case 'home':
                  iconComponent = <Ionicons name="home" size={size} color={color} />;
                  break;
                case 'report':
                  iconComponent = <Octicons name="report" size={size} color={color} />;
                  break;
                case 'explore':
                  iconComponent = <FontAwesome6 name="map-location-dot" size={size} color={color} />;
                  break;
                case 'profile':
                  iconComponent = <FontAwesome6 name="user-large" size={size} color={color} />;
                  break;
              }
              
              return (
                <View style={styles.iconContainer}>
                  {iconComponent}
                  {focused && <View style={styles.activeIndicator} />}
                </View>
              );
            },
          })}
        >
          <Tabs.Screen 
            name="home" 
            options={{ 
              tabBarLabel: '',
            }} 
          />
          <Tabs.Screen 
            name="report" 
            options={{ 
              tabBarLabel: '',
            }} 
          />
          <Tabs.Screen 
            name="explore" 
            options={{ 
              tabBarLabel: '',
            }} 
          />
          <Tabs.Screen 
            name="profile" 
            options={{ 
              tabBarLabel: '',
            }} 
          />
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
    height: 65,
    backgroundColor: "#FBFBFB",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: 'absolute',
    bottom: 0,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 5,
    paddingHorizontal: 5,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderTopWidth: 0,
  },
  tabBarItem: {
    height: 55,
    marginHorizontal: 2,
    paddingTop: 8,
    paddingBottom: 4,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
    marginBottom: Platform.OS === 'ios' ? 0 : 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 30,
    marginBottom: 2,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -10,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
});
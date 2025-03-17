import { Tabs } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Fontisto from '@expo/vector-icons/Fontisto';
import { Colors } from '../../constants/Colors';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar
      backgroundColor={Colors.primary}
      barStyle="light-content" />
      
      <Tabs initialRouteName="home" screenOptions={{
      headerShown: false, //remove all heaader
      tabBarActiveTintColor: Colors.primary, // set the tab bar active color
      tabBarShowLabel: false, // Hide tab labels
      tabBarStyle: {
        justifyContent: "center",
        alignItems: "center",
        height: 40, // Optional: Increase height for better look
        backgroundColor: "#fff", // Optional: Background color
        elevation: 10, // Android shadow
        shadowOpacity: 0.2, // iOS shadow
        borderTopWidth: 0, // Remove top border
      },
    }}>
      <Tabs.Screen name="home" options={{ 
        tabBarLabel:'Home',
        tabBarIcon : ({color})=><Ionicons name="home" size={24} color={color}/>
        }} />
      <Tabs.Screen name="report" options={{ 
        tabBarLabel:'Report',
        tabBarIcon : ({color})=><Octicons name="report" size={24} color={color}/>
        }} />
      <Tabs.Screen name="camera" options={{ 
        tabBarLabel:'Camera',
        tabBarIcon : ({color})=><Fontisto name="camera" size={22} color={color} />
        }} />
      <Tabs.Screen name="explore" options={{ 
        tabBarLabel:'Map',
        tabBarIcon : ({color})=><FontAwesome6 name="map-location-dot" size={24} color={color} />
        }} />
      <Tabs.Screen name="profile" options={{ 
        tabBarLabel:'Settings',
        tabBarIcon : ({color})=><MaterialIcons name="settings-suggest" size={30} color={color} />
        }} />
    </Tabs>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25, 
    backgroundColor: Colors.primary,
  },
});

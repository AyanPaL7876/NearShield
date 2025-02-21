import { Tabs } from "expo-router";
import React from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors } from '../../constants/Colors';

export default function TabLayout() {
  return (
    <Tabs initialRouteName="home" screenOptions={{
      headerShown: false, //remove all heaader
      tabBarActiveTintColor: Colors.PRIMARY, // set the tab bar active color
    }}>
      <Tabs.Screen name="home" options={{ 
        tabBarLabel:'Home',
        tabBarIcon : ({color})=><Ionicons name="home" size={24} color={color}/>
        }} />
      <Tabs.Screen name="explore" options={{ 
        tabBarLabel:'Explore',
        tabBarIcon : ({color})=><AntDesign name="search1" size={24} color={color} />
        }} />
      <Tabs.Screen name="profile" options={{ 
        tabBarLabel:'Profile',
        tabBarIcon : ({color})=><FontAwesome name="user" size={24} color={color} />
        }} />
    </Tabs>
  );
}

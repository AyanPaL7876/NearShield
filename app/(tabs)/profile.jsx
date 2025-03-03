import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useUser, useAuth } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Colors } from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import ProfileScreen from '../../components/ProfileScreen'

const Profile = () => {
  return(
    <ProfileScreen/>
  )
}


export default Profile
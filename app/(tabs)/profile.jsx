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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: Colors.PRIMARY,
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    color: '#fff',
  },
  userInfoContainer: {
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userDetails: {
    alignItems: 'center',
    marginBottom: 30,
  },
  name: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    fontFamily: 'outfit',
    color: '#666',
  },
  infoSection: {
    width: '100%',
    marginBottom: 30,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 16,
    fontFamily: 'outfit-medium',
    color: '#333',
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'outfit',
    color: '#666',
  },
  logoutButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'outfit-medium',
  },
})

export default Profile
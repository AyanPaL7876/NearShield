import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Text, Button, Card, Divider } from 'react-native-paper';

const ProfileScreen = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          {user?.imageUrl ? (
            <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
          ) : (
            <Ionicons name="person-circle" size={100} color={Colors.primary} />
          )}
        </View>
        <Text variant="headlineMedium" style={styles.name}>{user?.fullName || 'No Name'}</Text>
        <Text variant="bodyLarge" style={styles.email}>{user?.primaryEmailAddress?.emailAddress}</Text>
        
        <Divider style={styles.divider} />
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Email Verified:</Text>
          <Text style={styles.infoValue}>
            {user?.primaryEmailAddress?.verification.status === 'verified' ? 'Yes' : 'No'}
          </Text>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Joined:</Text>
          <Text style={styles.infoValue}>
            {new Date(user?.createdAt || '').toLocaleDateString()}
          </Text>
        </View>
        
        <Button mode="contained" style={styles.logoutButton} onPress={handleLogout}>
          Logout
        </Button>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileCard: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 5,
  },
  email: {
    color: Colors.TEXT_SECONDARY,
    marginBottom: 20,
  },
  divider: {
    width: '100%',
    marginVertical: 15,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
  },
  infoLabel: {
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
  },
  infoValue: {
    color: Colors.TEXT_SECONDARY,
  },
  logoutButton: {
    marginTop: 20,
    width: '100%',
  },
});

export default ProfileScreen;

import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Button, Card, Divider, Badge } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { formatDate } from './dateUtils';

const ProfileCard = ({ 
  user, 
  stats, 
  location, 
  address, 
  onOpenMap, 
  onEditProfile, 
  onLogout 
}) => {
  return (
    <Card style={styles.profileCard} elevation={4}>
      <View style={styles.avatarContainer}>
        {user?.imageUrl ? (
          <Image 
            source={{ uri: user.imageUrl }} 
            style={styles.avatar} 
            resizeMode="cover"
          />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarInitials}>
              {user?.fullName?.charAt(0) || user?.username?.charAt(0) || '?'}
            </Text>
          </View>
        )}
        
        {user?.primaryEmailAddress?.verification.status === 'verified' && (
          <Badge style={styles.verifiedBadge}>
            <Ionicons name="checkmark" size={14} color="white" />
          </Badge>
        )}
      </View>
      
      <Text variant="headlineMedium" style={styles.name}>
        {user?.fullName || user?.username || 'User'}
      </Text>
      <Text variant="bodyLarge" style={styles.email}>
        {user?.primaryEmailAddress?.emailAddress}
      </Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text variant="titleLarge" style={styles.statNumber}>{stats.reportsCount}</Text>
          <Text variant="bodySmall" style={styles.statLabel}>Reports</Text>
        </View>
        <View style={styles.statItem}>
          <Text variant="titleLarge" style={styles.statNumber}>{stats.solvedReports}</Text>
          <Text variant="bodySmall" style={styles.statLabel}>Resolved</Text>
        </View>
        <View style={styles.statItem}>
          <Text variant="titleLarge" style={styles.statNumber}>{stats.totalLikes}</Text>
          <Text variant="bodySmall" style={styles.statLabel}>Likes</Text>
        </View>
      </View>
      
      <Divider style={styles.divider} />
      
      {/* User info section */}
      <View style={styles.infoSection}>
        <View style={styles.infoContainer}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="mail" size={18} color="white" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text 
              style={styles.infoValue}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {user?.primaryEmailAddress?.emailAddress || 'Not available'}
            </Text>
          </View>
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="calendar" size={18} color="white" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Joined</Text>
            <Text style={styles.infoValue}>{user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.infoContainer} 
          onPress={onOpenMap}
          activeOpacity={0.8}
          disabled={!location}
        >
          <View style={styles.infoIconContainer}>
            <Ionicons name="location" size={18} color="white" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Current Location</Text>
            <Text style={styles.infoValue}>
              {location ? 
                `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 
                'Loading...'}
            </Text>
            <Text 
              style={styles.addressText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {address}
            </Text>
          </View>
          {location && <Ionicons name="open-outline" size={18} color={Colors.primary} />}
        </TouchableOpacity>
      </View>
      
      {/* Action buttons */}
      <View style={styles.actionButtonsContainer}>
        <Button 
          mode="contained" 
          style={styles.logoutButton} 
          labelStyle={styles.logoutButtonText}
          icon="logout" 
          onPress={onLogout}
        >
          Logout
        </Button>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    marginTop: -50,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    alignSelf: 'center',
    marginTop: -40,
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarInitials: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.success,
  },
  name: {
    textAlign: 'center',
    marginTop: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    color: '#666',
    marginTop: 2,
  },
  divider: {
    marginHorizontal: -16,
  },
  infoSection: {
    marginTop: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  addressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  editProfileButton: {
    flex: 1,
    marginRight: 8,
    borderColor: Colors.secondary,
  },
  editProfileButtonText: {
    color: Colors.secondary,
  },
  logoutButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: Colors.denger,
  },
  logoutButtonText: {
    color: '#fff',
  },
});

export default ProfileCard;
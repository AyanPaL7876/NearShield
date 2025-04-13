import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Linking, 
  RefreshControl,
  Animated,
  Easing,
  Alert
} from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Text, Button, Card, Divider, Avatar, Badge, Chip, ActivityIndicator } from 'react-native-paper';
import * as Location from 'expo-location';
import { updateReportStatus } from '../services/reportService';
import { getUserReports } from '../services/userService';
import { formatDate, calculateAverageResponseTime } from './Profile/dateUtils';
import ProfileCard from './Profile/ProfileCard';
import ReportCard from './Profile/ReportCard';

const ProfileScreen = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  
  // State variables
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Fetching location...');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unsubscribeReports, setUnsubscribeReports] = useState(null);
  
  // Animation states
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];

  // Stats calculation
  const solvedReports = reports.filter(report => report.solved).length;
  const totalLikes = reports.reduce((total, report) => total + (report.likes || 0), 0);
  const averageResponseTime = calculateAverageResponseTime(reports);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      fetchUserLocation();
      
      try {
        if (user?.id) {
          const userReports = await getUserReports(user.id);
          setReports(userReports);
        } else {
          setReports([]);
        }
      } catch (error) {
        console.error('Error loading reports:', error);
        Alert.alert("Error", "Failed to load your reports. Please try again.");
      } finally {
        setLoading(false);
        animateScreen();
      }
    };

    initialize();

    return () => {
      if (typeof unsubscribeReports === 'function') {
        unsubscribeReports();
      }
    };
  }, [user?.id]);

  const animateScreen = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();
  };

  const fetchUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAddress('Location permission denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentLocation.coords);
      
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
      });
      
      if (addressResponse?.length > 0) {
        const addressData = addressResponse[0];
        const formattedAddress = [
          addressData.street,
          addressData.city,
          addressData.region,
          addressData.postalCode,
          addressData.country
        ].filter(Boolean).join(', ');
        setAddress(formattedAddress);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setAddress('Unable to fetch location');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchUserLocation();
      if (user?.id) {
        const userReports = await getUserReports(user.id);
        setReports(userReports);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      Alert.alert("Error", "Failed to refresh your data. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (typeof unsubscribeReports === 'function') {
        unsubscribeReports();
      }
      await signOut();
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  const openMap = () => {
    if (location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
      Linking.openURL(url);
    }
  };

  const toggleReportStatus = async (reportId, currentStatus) => {
    try {
      await updateReportStatus(reportId, !currentStatus);
      // Update local state immediately for a more responsive UI
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId ? {...report, solved: !currentStatus} : report
        )
      );
    } catch (error) {
      console.error('Error updating report status:', error);
      Alert.alert("Error", "Failed to update report status.");
    }
  };

  return (
    <Animated.ScrollView 
      style={[styles.container, { opacity: fadeAnim }]}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh} 
          colors={[Colors.primary]} 
          tintColor={Colors.primary}
          progressBackgroundColor="#fff"
        />
      }
    >
      {/* Header with gradient background */}
      <Animated.View style={[styles.header, {
        transform: [{ translateY: slideAnim }],
      }]}>
        <View style={styles.headerGradient} />
      </Animated.View>
      
      {/* Profile Card */}
      <Animated.View style={{
        transform: [{ translateY: slideAnim }],
      }}>
        <ProfileCard 
          user={user}
          stats={{
            reportsCount: reports.length,
            solvedReports,
            totalLikes
          }}
          location={location}
          address={address}
          onOpenMap={openMap}
          onEditProfile={() => router.push('/edit-profile')}
          onLogout={handleLogout}
        />
      </Animated.View>

      {/* Reports Section */}
      <Animated.View 
        style={[styles.reportsSection, {
          opacity: fadeAnim,
          marginBottom: 80,
          transform: [{ translateY: slideAnim }],
        }]}
      >
        <View style={styles.sectionHeaderContainer}>
          <Text variant="titleLarge" style={styles.sectionTitle}>My Reports</Text>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading your reports...</Text>
          </View>
        ) : reports.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="document-text-outline" size={50} color={Colors.primaryLight} />
            <Text style={styles.emptyStateText}>You haven't created any reports yet</Text>
            <Button 
              mode="contained-tonal" 
              style={styles.createReportButton}
              labelStyle={styles.createReportButtonText}
              onPress={() => router.push('/add')}
              icon="plus"
            >
              Create Your First Report
            </Button>
          </View>
        ) : (
          reports.map((report) => (
            <ReportCard 
              key={report.id}
              report={report}
              onEdit={() => router.push(`/edit-report/${report.id}`)}
              onView={() => router.push(`/report/${report.id}`)}
              onToggleStatus={() => toggleReportStatus(report.id, report.solved)}
            />
          ))
        )}
      </Animated.View>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    height: 120,
    position: 'relative',
  },
  headerGradient: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  reportsSection: {
    padding: 16,
    marginTop: 8,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  emptyStateContainer: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 40,
  },
  emptyStateText: {
    marginTop: 16,
    marginBottom: 24,
    color: '#666',
    textAlign: 'center',
  },
  createReportButton: {
    marginTop: 8,
    backgroundColor: Colors.primaryLight,
  },
  createReportButtonText: {
    color: Colors.primary,
  }
});

export default ProfileScreen;
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
import { fetchUserReports, updateReportStatus } from '../services/reportService';

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
    fetchUserLocation();
    const unsubscribe = loadUserReports();
    
    // Set up animation
    animateScreen();
    
    // Cleanup function
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
      if (typeof unsubscribeReports === 'function') {
        unsubscribeReports();
      }
    };
  }, []);

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

  const loadUserReports = useCallback(async () => {
    try {
      setLoading(true);
      const userId = user?.id;
      
      if (!userId) {
        setReports([]);
        setLoading(false);
        return;
      }
      
      const unsubscribe = await fetchUserReports(userId)
        .then(userReports => {
          setReports(userReports);
          setLoading(false);
          return () => {}; // Will be replaced by actual unsubscribe function
        })
        .catch(error => {
          console.error('Error loading user reports:', error);
          setLoading(false);
          Alert.alert("Error", "Failed to load your reports. Please try again.");
          return () => {};
        });
      
      setUnsubscribeReports(() => unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('Error in loadUserReports:', error);
      setLoading(false);
      return () => {};
    }
  }, [user?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchUserLocation(), loadUserReports()]);
    setRefreshing(false);
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
      // The real-time listener will update the UI automatically
    } catch (error) {
      console.error('Error updating report status:', error);
      Alert.alert("Error", "Failed to update report status.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate average time to resolve reports
  function calculateAverageResponseTime(reportsList) {
    const solvedReportsWithDates = reportsList.filter(report => 
      report.solved && report.solvedAt && report.time
    );
    
    if (solvedReportsWithDates.length === 0) return null;
    
    const totalDays = solvedReportsWithDates.reduce((total, report) => {
      const createTime = new Date(report.time.seconds * 1000);
      const solveTime = new Date(report.solvedAt.seconds * 1000);
      const diffTime = Math.abs(solveTime - createTime);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return total + diffDays;
    }, 0);
    
    return (totalDays / solvedReportsWithDates.length).toFixed(1);
  }

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
              <Text variant="titleLarge" style={styles.statNumber}>{reports.length}</Text>
              <Text variant="bodySmall" style={styles.statLabel}>Reports</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="titleLarge" style={styles.statNumber}>{solvedReports}</Text>
              <Text variant="bodySmall" style={styles.statLabel}>Resolved</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="titleLarge" style={styles.statNumber}>{totalLikes}</Text>
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
              onPress={openMap}
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
              mode="outlined" 
              style={styles.editProfileButton} 
              labelStyle={styles.editProfileButtonText}
              icon="account-edit-outline" 
              onPress={() => router.push('/edit-profile')}
            >
              Edit Profile
            </Button>
            
            <Button 
              mode="contained" 
              style={styles.logoutButton} 
              labelStyle={styles.logoutButtonText}
              icon="logout" 
              onPress={handleLogout}
            >
              Logout
            </Button>
          </View>
        </Card>
      </Animated.View>

      {/* Reports Section */}
      <Animated.View 
        style={[styles.reportsSection, {
          opacity: fadeAnim,
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
            <Card 
              key={report.id} 
              style={styles.reportCard}
              elevation={2}
            >
              <View style={styles.reportHeader}>
                <View style={styles.reportTitleContainer}>
                  <MaterialIcons 
                    name={report.icon || "report-problem"} 
                    size={24} 
                    color={Colors.primary} 
                    style={styles.reportIcon} 
                  />
                  <Text variant="titleMedium" style={styles.reportTitle}>
                    {report.title}
                  </Text>
                </View>
                <TouchableOpacity 
                  onPress={() => toggleReportStatus(report.id, report.solved)}
                >
                  <Chip 
                    style={[
                      styles.statusChip, 
                      report.solved ? styles.solvedChip : styles.unsolvedChip
                    ]}
                    textStyle={report.solved ? styles.solvedChipText : styles.unsolvedChipText}
                  >
                    {report.solved ? 'Solved' : 'Unsolved'}
                  </Chip>
                </TouchableOpacity>
              </View>
              
              <Divider style={styles.reportDivider} />
              
              {report.image && (
                <TouchableOpacity 
                  onPress={() => router.push(`/report/${report.id}`)}
                  activeOpacity={0.9}
                >
                  <Image 
                    source={{ uri: report.image }} 
                    style={styles.reportImage} 
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
              
              <Text 
                style={styles.reportDescription}
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                {report.description}
              </Text>
              
              <View style={styles.reportFooter}>
                <View style={styles.reportStat}>
                  <Ionicons name="heart" size={16} color="#FF4F5E" />
                  <Text style={styles.reportStatText}>{report.likes || 0}</Text>
                </View>
                <View style={styles.reportStat}>
                  <Ionicons name="chatbubble-outline" size={16} color="#666" />
                  <Text style={styles.reportStatText}>{report.comments || 0}</Text>
                </View>
                <Text style={styles.reportDate}>{formatDate(
                  report.time?.seconds ? new Date(report.time.seconds * 1000) : report.time
                )}</Text>
              </View>
              
              <View style={styles.reportActions}>
                <TouchableOpacity 
                  style={styles.viewReportButton}
                  onPress={() => router.push(`/report/${report.id}`)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.viewReportText}>View Details</Text>
                  <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.editReportButton}
                  onPress={() => router.push(`/edit-report/${report.id}`)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="create-outline" size={18} color={Colors.secondary} />
                </TouchableOpacity>
              </View>
            </Card>
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
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportsSection: {
    padding: 16,
    marginTop: 8,
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
  },
  reportCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  reportTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reportIcon: {
    marginRight: 8,
  },
  reportTitle: {
    fontWeight: '600',
    flex: 1,
  },
  statusChip: {
    height: 28,
  },
  solvedChip: {
    backgroundColor: Colors.successLight,
  },
  solvedChipText: {
    color: Colors.success,
  },
  unsolvedChip: {
    backgroundColor: Colors.warningLight,
  },
  unsolvedChipText: {
    color: Colors.warning,
  },
  reportDivider: {
    marginVertical: 0,
  },
  reportImage: {
    width: '100%',
    height: 180,
  },
  reportDescription: {
    padding: 16,
    color: '#555',
  },
  reportFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  reportStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  reportStatText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 12,
  },
  reportDate: {
    marginLeft: 'auto',
    fontSize: 12,
    color: '#888',
  },
  reportActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  viewReportButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewReportText: {
    color: Colors.primary,
    fontWeight: '500',
    marginRight: 4,
  },
  editReportButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  Linking,
  Platform
} from 'react-native';
import { FontAwesome, MaterialIcons, AntDesign } from '@expo/vector-icons'; 
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Shadow } from '@/constants';
import { useNavigation } from '@react-navigation/native';
import { FALLBACK_POLICE_STATIONS } from '@/data/policeStation';

const PoliceScreen = () => {
  const [location, setLocation] = useState(null);
  const [policeStations, setPoliceStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchRadius, setSearchRadius] = useState(10000); // 10km default
  const [useFallbackData, setUseFallbackData] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchLocationAndPoliceStations();
  }, []);

  const fetchLocationAndPoliceStations = async () => {
    setLoading(true);
    setErrorMsg(null);
    
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      
      // Fetch nearby police stations
      await fetchNearbyPoliceStations(currentLocation.coords.latitude, currentLocation.coords.longitude);
    } catch (error) {
      console.error("Location error:", error);
      setErrorMsg('Error getting location: ' + error.message);
      setLoading(false);
    }
  };

  const fetchNearbyPoliceStations = async (latitude, longitude) => {
    try {
      // Use a more flexible query to find police stations
      const url = `https://overpass-api.de/api/interpreter?data=[out:json];(node(around:${searchRadius},${latitude},${longitude})["amenity"="police"];node(around:${searchRadius},${latitude},${longitude})["office"="police"];);out body;`;
      console.log("Fetching URL:", url);
      
      const response = await fetch(url);
      console.log("Response Status:", response.status);
  
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API Response Data:", data);
      console.log("Number of police stations found:", data?.elements?.length);
  
      if (data?.elements?.length > 0) {
        const stationsWithDistance = data.elements.map(station => {
          const distance = calculateDistance(latitude, longitude, station.lat, station.lon);
          const tags = station.tags ?? {}; // Handle missing tags
          console.log("Station Tags:", tags);
          console.log("Station Name & Distance:", tags.name || "Police Station", distance);
  
          return {
            place_id: station.id.toString(),
            name: tags.name || "Police Station", 
            geometry: {
              location: {
                lat: station.lat,
                lng: station.lon
              }
            },
            vicinity: constructAddress(tags) || "Unknown Location",
            distance: distance,
            details: {
              formatted_address: constructAddress(tags) || "Address not available",
              formatted_phone_number: tags.phone || tags["contact:phone"] || null,
              website: tags.website || null,
              opening_hours: tags.opening_hours ? { open_now: true } : null
            }
          };
        });
  
        setPoliceStations(stationsWithDistance.sort((a, b) => a.distance - b.distance));
        setUseFallbackData(false);
      } else {
        console.log("No stations found, using fallback data");
        // Use fallback data if no results found
        if (useFallbackData) {
          setPoliceStations([]);
        } else {
          // Try with a larger radius before using fallback data
          if (searchRadius < 50000) {
            setSearchRadius(50000); // Increase to 50km
            fetchNearbyPoliceStations(latitude, longitude);
            return;
          }
          // Use fallback data with adjusted distances
          const fallbackWithDistances = FALLBACK_POLICE_STATIONS.map(station => {
            return {
              ...station,
              distance: calculateDistance(latitude, longitude, station.geometry.location.lat, station.geometry.location.lng)
            };
          });
          setPoliceStations(fallbackWithDistances);
          setUseFallbackData(true);
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      setErrorMsg("Error fetching police stations: " + error.message);
      // Use fallback data on error
      if (!useFallbackData) {
        const fallbackWithDistances = FALLBACK_POLICE_STATIONS.map(station => {
          return {
            ...station,
            distance: location ? 
              calculateDistance(location.coords.latitude, location.coords.longitude, station.geometry.location.lat, station.geometry.location.lng) :
              station.distance
          };
        });
        setPoliceStations(fallbackWithDistances);
        setUseFallbackData(true);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to construct address from tags
  const constructAddress = (tags) => {
    if (!tags) return "Address not available";
    
    const addressParts = [];
    
    if (tags["addr:housenumber"]) addressParts.push(tags["addr:housenumber"]);
    if (tags["addr:street"]) addressParts.push(tags["addr:street"]);
    if (tags["addr:city"]) addressParts.push(tags["addr:city"]);
    if (tags["addr:postcode"]) addressParts.push(tags["addr:postcode"]);
    
    // If we don't have structured address parts, try to use other available address info
    if (addressParts.length === 0) {
      if (tags.address) return tags.address;
      if (tags.name) return `${tags.name} location`;
      return "Address not available";
    }
    
    return addressParts.join(", ");
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  // Open navigation to a police station
  const navigateToStation = (station) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${station.geometry.location.lat},${station.geometry.location.lng}`;
    const label = station.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    Linking.openURL(url).catch(err => {
      console.error('Error opening maps:', err);
      Alert.alert('Navigation Error', 'Could not open maps application');
    });
  };

  // Call the police station
  const callStation = (phoneNumber) => {
    if (!phoneNumber) {
      Alert.alert('No phone number available');
      return;
    }
    
    Linking.openURL(`tel:${phoneNumber}`).catch(err => {
      console.error('Error making call:', err);
      Alert.alert('Call Error', 'Could not initiate call');
    });
  };

  // Open website for the police station
  const openWebsite = (website) => {
    if (!website) {
      Alert.alert('No website available');
      return;
    }
    
    Linking.openURL(website).catch(err => {
      console.error('Error opening website:', err);
      Alert.alert('Website Error', 'Could not open website');
    });
  };

  // Render each police station item
  const renderPoliceStation = ({ item }) => {
    return (
      <View style={styles.stationCard}>
        <Text style={styles.stationName}>{item.name}</Text>
        
        <View style={styles.detailRow}>
          <FontAwesome name="map-marker" size={16} color="#4A80F0" />
          <Text style={styles.detailText}>{item.details.formatted_address || item.vicinity || "Address not available"}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <FontAwesome name="location-arrow" size={16} color="#4A80F0" />
          <Text style={styles.detailText}>{item.distance.toFixed(2)} km away</Text>
        </View>
        
        {item.details.formatted_phone_number && (
          <View style={styles.detailRow}>
            <FontAwesome name="phone" size={16} color="#4A80F0" />
            <Text style={styles.detailText}>{item.details.formatted_phone_number}</Text>
          </View>
        )}
        
        {item.details.opening_hours && (
          <View style={styles.detailRow}>
            <FontAwesome name="clock-o" size={18} color="#4A80F0" />
            <Text style={styles.detailText}>
              {item.details.opening_hours.open_now ? 'Open Now' : 'Closed'}
            </Text>
          </View>
        )}
        
        {item.rating && (
          <View style={styles.detailRow}>
            <FontAwesome name="star" size={16} color="#FFD700" />
            <Text style={styles.detailText}>{item.rating} / 5</Text>
          </View>
        )}
        
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigateToStation(item)}
          >
            <MaterialIcons name="directions" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Directions</Text>
          </TouchableOpacity>
          
          {item.details.formatted_phone_number && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => callStation(item.details.formatted_phone_number)}
            >
              <FontAwesome name="phone" size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
          )}
          
          {item.details.website && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => openWebsite(item.details.website)}
            >
              <FontAwesome name="globe" size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Website</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Render loading, error, or list of police stations
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4A80F0" />
          <Text style={styles.loadingText}>Finding nearby police stations...</Text>
        </View>
      );
    }
    
    if (errorMsg && policeStations.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <FontAwesome name="exclamation-triangle" size={50} color="#FF6B6B" />
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setSearchRadius(10000); // Reset to default radius
              fetchLocationAndPoliceStations();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (policeStations.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <FontAwesome name="search" size={50} color="#4A80F0" />
          <Text style={styles.noResultsText}>No police stations found nearby</Text>
          <Text style={styles.noResultsSubText}>Try increasing the search radius or check your location</Text>
          <TouchableOpacity 
            style={[styles.retryButton, {marginTop: 20}]}
            onPress={() => {
              setSearchRadius(prev => prev * 2); // Double the search radius
              if (location) {
                fetchNearbyPoliceStations(location.coords.latitude, location.coords.longitude);
              } else {
                fetchLocationAndPoliceStations();
              }
            }}
          >
            <Text style={styles.retryButtonText}>Increase Search Radius</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <>
        {useFallbackData && (
          <View style={styles.fallbackNotice}>
            <FontAwesome name="info-circle" size={16} color="#4A80F0" />
            <Text style={styles.fallbackNoticeText}>
              Showing demo data. Pull down to refresh.
            </Text>
          </View>
        )}
        <FlatList
          data={policeStations}
          renderItem={renderPoliceStation}
          keyExtractor={(item) => item.place_id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
  <StatusBar 
    backgroundColor={Colors.statusBarBg}
    barStyle="light-content"
  />
  <View style={styles.header}>
    <View style={{ flexDirection: 'row', alignItems: "center" }}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="arrowleft" size={20} color="#4A80F0" />
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', alignItems: "flex-end" }}>
        <Text style={styles.headerTitle}>Nearby Police Stations</Text>
      </View>
    </View>
    <TouchableOpacity 
      style={styles.refreshButton}
      onPress={() => {
        setLoading(true);
        if (location) {
          fetchNearbyPoliceStations(location.coords.latitude, location.coords.longitude);
        } else {
          setErrorMsg('Location not available. Please try again.');
          setLoading(false);
        }
      }}
    >
      <FontAwesome name="refresh" size={20} color="#4A80F0" />
    </TouchableOpacity>
  </View>
  {renderContent()}
</SafeAreaView>
  );
};

const styles = StyleSheet.create({
    // Container styles
    backButton: {
        padding: 10,
        marginRight: 5,
      },
    safeArea: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    statusBar: {
      backgroundColor: Colors.statusBarBg,
      barStyle: 'light-content', // This is for the StatusBar component prop
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
      backgroundColor: Colors.policeBlue,
      ...Shadow.medium,
    },
    headerTitle: {
      ...Typography.heading2,
      color: Colors.white,
    },
    headerLeftContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    policeIcon: {
      marginRight: 12,
      width: 24,
      height: 24,
      resizeMode: 'contain',
    //   tintColor: Colors.white,
    },
    refreshButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    
    // Content container styles
    contentContainer: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
      backgroundColor: Colors.background,
    },
    
    // State-specific containers
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    loadingText: {
      ...Typography.subtitle,
      marginTop: 20,
      color: Colors.textSecondary,
    },
    errorContainer: {
      alignItems: 'center',
      padding: 30,
      backgroundColor: Colors.white,
      borderRadius: 12,
      marginHorizontal: 24,
      ...Shadow.small,
    },
    errorIcon: {
      width: 48,
      height: 48,
      tintColor: Colors.error,
      marginBottom: 16,
    },
    errorText: {
      ...Typography.subtitle,
      marginTop: 8,
      color: Colors.error,
      textAlign: 'center',
    },
    errorDescription: {
      ...Typography.body,
      marginTop: 8,
      color: Colors.textSecondary,
      textAlign: 'center',
    },
    noResultsContainer: {
      alignItems: 'center',
      padding: 30,
      backgroundColor: Colors.white,
      borderRadius: 12,
      marginHorizontal: 24,
      ...Shadow.small,
    },
    noResultsIcon: {
      width: 48,
      height: 48,
      tintColor: Colors.textLight,
      marginBottom: 16,
    },
    noResultsText: {
      ...Typography.heading2,
      marginTop: 12,
      color: Colors.textPrimary,
      textAlign: 'center',
    },
    noResultsSubText: {
      ...Typography.body,
      marginTop: 12,
      color: Colors.textSecondary,
      textAlign: 'center',
      maxWidth: '90%',
    },
    
    // Action elements
    retryButton: {
      marginTop: 24,
      paddingVertical: 14,
      paddingHorizontal: 32,
      backgroundColor: Colors.primary,
      borderRadius: 10,
      ...Shadow.small,
    },
    retryButtonText: {
      ...Typography.button,
      color: Colors.white,
      textAlign: 'center',
    },
    
    // List styles
    listContainer: {
      padding: 16,
    },
    
    // Card styles
    stationCard: {
      backgroundColor: Colors.cardBg,
      borderRadius: 12,
      paddingVertical: 20,
      paddingHorizontal: 16,
      paddingLeft: 20,
      marginBottom: 16,
      borderLeftWidth: 4,
      borderLeftColor: Colors.policeBlue,
      ...Shadow.medium,
    },
    stationNameContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    stationName: {
      ...Typography.heading2,
      color: Colors.policeBlue,
      flex: 1,
    },
    statusIndicator: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: Colors.success,
      marginRight: 8,
    },
    
    // Detail styles
    detailsContainer: {
      marginVertical: 4,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 4,
      gap: 8,
    },
    detailIconContainer: {
      width: 24,
      alignItems: 'center',
    },
    detailIcon: {
      width: 18,
      height: 18,
      marginTop: 2,
      tintColor: Colors.policeBlue,
    },
    detailContent: {
      flex: 1,
      marginLeft: 12,
    },
    detailLabel: {
      ...Typography.caption,
      color: Colors.textLight,
      marginBottom: 4,
    },
    detailText: {
      ...Typography.body,
      color: Colors.textSecondary,
    },
    
    // Action buttons
    actionButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: Colors.divider,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.policeLightBlue,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 8,
      flex: 1,
      marginHorizontal: 4,
      ...Shadow.small,
    },
    actionButtonPrimary: {
      backgroundColor: Colors.policeLightBlue,
    },
    actionButtonSecondary: {
      backgroundColor: Colors.white,
      borderWidth: 1,
      borderColor: Colors.policeLightBlue,
    },
    actionButtonIcon: {
      width: 16,
      height: 16,
      tintColor: Colors.white,
      marginRight: 6,
    },
    actionButtonText: {
      ...Typography.button,
      fontSize: 14,
      color: Colors.white,
      paddingLeft: 7,
    },
    actionButtonTextSecondary: {
      color: Colors.policeLightBlue,
    },
    
    // Badges and tags
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: Colors.policeAccent,
      marginBottom: 12,
      alignSelf: 'flex-start',
    },
    badgeText: {
      ...Typography.caption,
      color: Colors.policeBlue,
      fontWeight: '600',
    },
    distanceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.policeAccent,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    distanceIcon: {
      width: 12,
      height: 12,
      marginRight: 4,
      tintColor: Colors.policeLightBlue,
    },
    distanceText: {
      ...Typography.caption,
      color: Colors.policeLightBlue,
      fontWeight: '600',
    },
    
    // Filter section
    filterContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: Colors.white,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: Colors.policeAccent,
      marginRight: 10,
    },
    filterButtonText: {
      ...Typography.caption,
      fontWeight: '500',
      color: Colors.policeBlue,
    },
    filterIcon: {
      width: 14,
      height: 14,
      marginRight: 4,
      tintColor: Colors.policeBlue,
    },
    
    // Bottom navigation
    bottomNav: {
      flexDirection: 'row',
      backgroundColor: Colors.white,
      borderTopWidth: 1,
      borderTopColor: Colors.border,
      paddingBottom: 8,
      ...Shadow.medium,
    },
    bottomNavItem: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 10,
    },
    bottomNavIcon: {
      width: 24,
      height: 24,
      marginBottom: 4,
      tintColor: Colors.textLight,
    },
    bottomNavIconActive: {
      tintColor: Colors.policeBlue,
    },
    bottomNavText: {
      ...Typography.caption,
      color: Colors.textLight,
    },
    bottomNavTextActive: {
      color: Colors.policeBlue,
      fontWeight: '500',
    },
    fallbackNotice:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        backgroundColor: Colors.warning,
    }
  });
  

export default PoliceScreen;
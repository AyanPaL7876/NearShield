import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Colors, Typography } from '@/constants';
import { FALLBACK_HOSPITALS } from '@/data/hospitals';
import { calculateDistance, deg2rad } from '@/lib/math';
import { renderHospitalItem } from './item/renderHospitalItem';
import { fetchHospitalData } from '@/lib/NearbyHospitals';
import Loading from './item/loading';
import ErrorMsg from './item/errorMsg';
import { AntDesign } from '@expo/vector-icons'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const NearestHospitalsScreen = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [location, setLocation] = useState(null);
  const [useFallbackData, setUseFallbackData] = useState(false);
  const [searchRadius, setSearchRadius] = useState(20000); // 20km default
  const navigation = useNavigation();
  // Fetch nearby hospitals
  const fetchNearbyHospitals = async (latitude, longitude) => {
    try {
      const data = await fetchHospitalData(latitude, longitude, searchRadius);
  
      if (data.length > 0) {
        const hospitalsWithDistance = data.map(hospital => {
          const distance = calculateDistance(latitude, longitude, hospital.lat, hospital.lon);
          const tags = hospital.tags ?? {}; 
  
          const formattedAddress = [
            tags["addr:full"],
            tags["addr:district"],
            tags["addr:state"],
            tags["addr:postcode"]
          ].filter(Boolean).join(", ");
  
          return {
            place_id: hospital.id.toString(),
            name: tags.name || "Hospital",
            geometry: {
              location: { lat: hospital.lat, lng: hospital.lon }
            },
            vicinity: formattedAddress || "Unknown Location",
            distance,
            details: {
              formatted_address: formattedAddress || "Address not available",
              formatted_phone_number: tags.phone || tags["contact:phone"] || null,
              website: tags.website || null,
              opening_hours: tags.opening_hours ? { open_now: true } : null
            }
          };
        });
  
        setHospitals(hospitalsWithDistance.sort((a, b) => a.distance - b.distance));
        setUseFallbackData(false);
      } else {
        console.log("No hospitals found, using fallback data");
        if (useFallbackData) {
          setHospitals([]);
        } else {
          if (searchRadius < 50000) {
            setSearchRadius(50000);
            fetchNearbyHospitals(latitude, longitude);
            return;
          }
          const fallbackWithDistances = FALLBACK_HOSPITALS.map(hospital => ({
            ...hospital,
            distance: calculateDistance(latitude, longitude, hospital.geometry.location.lat, hospital.geometry.location.lng)
          }));
          setHospitals(fallbackWithDistances);
          setUseFallbackData(true);
        }
      }
    } catch (error) {
      setErrorMsg("Error fetching hospitals: " + error.message);
      if (!useFallbackData) {
        const fallbackWithDistances = FALLBACK_HOSPITALS.map(hospital => ({
          ...hospital,
          distance: location
            ? calculateDistance(location.coords.latitude, location.coords.longitude, hospital.geometry.location.lat, hospital.geometry.location.lng)
            : hospital.distance
        }));
        setHospitals(fallbackWithDistances);
        setUseFallbackData(true);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Get the user's location and fetch hospitals
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      try {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        await fetchNearbyHospitals(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude
        );
      } catch (error) {
        console.error("Location Error:", error);
        setErrorMsg('Error getting location: ' + error.message);
        setLoading(false);
      }
    })();
  }, []);

  // Refresh hospitals data
  const refreshHospitals = async () => {
    if (!location) {
      Alert.alert('Error', 'Cannot determine your location');
      return;
    }
    setRefreshing(true);
    setErrorMsg(null);
    await fetchNearbyHospitals(
      location.coords.latitude,
      location.coords.longitude
    );
  };

  // Render content
  const renderContent = () => {
    if (loading && !refreshing) {
      return <Loading item="Hospitals"/>;
    }
    
    if (errorMsg && hospitals.length === 0) {
      return <ErrorMsg msg={errorMsg} />;
    }
    
    if (hospitals.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="medical" size={60} color={Colors.disabled} />
          <Text style={styles.emptyText}>No hospitals found nearby</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setSearchRadius(prev => prev * 2); // Double the search radius
              refreshHospitals();
            }}
          >
            <Text style={styles.retryButtonText}>Increase Search Radius</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <FlatList
        data={hospitals}
        renderItem={renderHospitalItem}
        keyExtractor={(item) => item.place_id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshHospitals}
            colors={[Colors.hospitalGreen]}
            tintColor={Colors.hospitalGreen}
          />
        }
      />
    );
  };

  // Main component
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.hospitalGreen} />
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="arrowleft" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nearby Hospitals</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          {useFallbackData ? 'Showing sample data - Pull down to refresh' : `Found ${hospitals.length} hospitals near you`}
        </Text>
      </View>
      
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.hospitalGreen,
    padding: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 10,
  },
  headerTitle: {
    ...Typography.heading1,
    color: Colors.white,
  },
  headerSubtitle: {
    ...Typography.caption,
    color: Colors.white,
    opacity: 0.8,
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100, // Extra padding at the bottom for better scrolling
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.hospitalGreen,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    ...Typography.button,
    color: Colors.white,
  },
});

export default NearestHospitalsScreen;
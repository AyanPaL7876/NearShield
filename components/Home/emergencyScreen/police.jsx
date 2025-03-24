import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { FontAwesome, AntDesign } from '@expo/vector-icons'; 
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography } from '@/constants';
import { useNavigation } from '@react-navigation/native';
import { FALLBACK_POLICE_STATIONS } from '@/data/policeStation';
import Loading from './item/loading';
import ErrorMsg from './item/errorMsg';
import { renderPoliceStation } from './item/renderPoliceStation';
import { fetchPoliceStations, getLocationPermission } from '@/utils/policeStationUtils';

const PoliceScreen = () => {
  const [location, setLocation] = useState(null);
  const [policeStations, setPoliceStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchRadius, setSearchRadius] = useState(30000); // 30km default
  const [useFallbackData, setUseFallbackData] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchLocationAndPoliceStations();
  }, []);

  const fetchLocationAndPoliceStations = async () => {
    setLoading(true);
    setErrorMsg(null);
    
    try {
      // Get location permission and current position
      const currentLocation = await getLocationPermission();
      if (!currentLocation) {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }
      
      setLocation(currentLocation);
      
      // Fetch nearby police stations
      const result = await fetchPoliceStations(
        currentLocation.coords.latitude, 
        currentLocation.coords.longitude,
        searchRadius,
        useFallbackData,
        location,
        FALLBACK_POLICE_STATIONS
      );
      
      setPoliceStations(result.stations);
      setUseFallbackData(result.usedFallback);
      
      // If search radius was increased
      if (result.newRadius) {
        setSearchRadius(result.newRadius);
      }
      
    } catch (error) {
      console.error("Error in fetchLocationAndPoliceStations:", error);
      setErrorMsg('Error: ' + error.message);
      
      // Use fallback data on error if not already using it
      if (!useFallbackData) {
        try {
          const fallbackResult = await fetchPoliceStations(
            location?.coords.latitude || 0, 
            location?.coords.longitude || 0,
            searchRadius,
            true,
            location,
            FALLBACK_POLICE_STATIONS
          );
          
          setPoliceStations(fallbackResult.stations);
          setUseFallbackData(true);
        } catch (fallbackError) {
          console.error("Error using fallback data:", fallbackError);
        }
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchLocationAndPoliceStations();
  };

  // Render loading, error, or list of police stations
  const renderContent = () => {
    if (loading && !refreshing) {
      return <Loading item="Police Stations"/>;
    }
    
    if (errorMsg && policeStations.length === 0) {
      return <ErrorMsg msg={errorMsg} />;
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
              fetchLocationAndPoliceStations();
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4A80F0']}
              tintColor="#4A80F0"
            />
          }
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.policeBlue} />
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="arrowleft" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nearby Police Stations</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          {useFallbackData ? 'Showing sample data - Pull down to refresh' : `Found ${policeStations.length} police stations near you`}
        </Text>
      </View>
      
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.white,
    elevation: 3,
  },
  headerTitle: {
    ...Typography.heading2,
    color: Colors.primary,
    marginLeft: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100, // Add some extra padding at the bottom
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    ...Typography.heading3,
    marginTop: 20,
    textAlign: 'center',
  },
  noResultsSubText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    ...Typography.button,
    color: Colors.white,
  },
  fallbackNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.info,
    padding: 10,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  fallbackNoticeText: {
    ...Typography.caption,
    color: Colors.white,
    marginLeft: 8,
  },
  container: {
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.policeBlue,
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
});

export default PoliceScreen;
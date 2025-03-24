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
import { FALLBACK_FIRE_STATIONS } from '@/data/fireStation';
import Loading from './item/loading';
import ErrorMsg from './item/errorMsg';
import { renderFireStation } from './item/renderFireStation';
import { fetchFireStations, getLocationPermission } from '@/utils/fireStationUtils';

const FireScreen = () => {
  const [location, setLocation] = useState(null);
  const [fireStations, setFireStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchRadius, setSearchRadius] = useState(30000); // 30km default
  const [useFallbackData, setUseFallbackData] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchLocationAndFireStations();
  }, []);

  const fetchLocationAndFireStations = async () => {
    setLoading(true);
    setErrorMsg(null);
    
    try {
      const currentLocation = await getLocationPermission();
      if (!currentLocation) {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }
      
      setLocation(currentLocation);
      
      const result = await fetchFireStations(
        currentLocation.coords.latitude, 
        currentLocation.coords.longitude,
        searchRadius,
        useFallbackData,
        location,
        FALLBACK_FIRE_STATIONS
      );
      
      setFireStations(result.stations);
      setUseFallbackData(result.usedFallback);
      
      if (result.newRadius) {
        setSearchRadius(result.newRadius);
      }
      
    } catch (error) {
      console.error("Error in fetchLocationAndFireStations:", error);
      setErrorMsg('Error: ' + error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchLocationAndFireStations();
  };

  const renderContent = () => {
    if (loading && !refreshing) {
      return <Loading item="Fire Stations"/>;
    }
    
    if (errorMsg && fireStations.length === 0) {
      return <ErrorMsg msg={errorMsg} />;
    }
    
    if (fireStations.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <FontAwesome name="search" size={50} color="#4A80F0" />
          <Text style={styles.noResultsText}>No fire stations found nearby</Text>
          <Text style={styles.noResultsSubText}>Try increasing the search radius or check your location</Text>
          <TouchableOpacity 
            style={[styles.retryButton, {marginTop: 20}]}
            onPress={() => {
              setSearchRadius(prev => prev * 2);
              fetchLocationAndFireStations();
            }}
          >
            <Text style={styles.retryButtonText}>Increase Search Radius</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <View style={styles.container}>
        {useFallbackData && (
          <View style={styles.fallbackNotice}>
            <FontAwesome name="info-circle" size={16} color="#4A80F0" />
            <Text style={styles.fallbackNoticeText}>
              Showing demo data. Pull down to refresh.
            </Text>
          </View>
        )}
        <FlatList
          data={fireStations}
          renderItem={renderFireStation}
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
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    <StatusBar backgroundColor={Colors.fireRed} barStyle="light-content" />
    <View style={styles.header}>
      <View style={styles.headerTopRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nearby Fire Stations</Text>
      </View>
      <Text style={styles.headerSubtitle}>
        {useFallbackData ? 'Showing sample data - Pull down to refresh' : `Found ${fireStations.length} fire stations near you`}
      </Text>
    </View>
    {renderContent()}
  </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.fireRed,
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
  container: {
    backgroundColor: Colors.background,
  }
});

export default FireScreen;
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapboxGL, { Camera, LocationPuck, MapView, ShapeSource, SymbolLayer, Images, CircleLayer } from "@rnmapbox/maps";
import * as Location from 'expo-location';
import Mapbox from '@rnmapbox/maps';
import { featureCollection, point } from '@turf/helpers';
import alertPin from '../assets/images/alert.png';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { getAlertPoints } from '../services/alertPointService';

const Map = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const mapRef = useRef(null);
  const cameraRef = useRef(null);

  const [userLocation, setUserLocation] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [focusedReport, setFocusedReport] = useState(null);
  
  // Add the specific report point if provided in params
  const [allPoints, setAllPoints] = useState([]);

  useEffect(async() => {
    const initializeMap = async () => {
      try {
        Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_API_KEY);
        await getUserLocation();
        setInitialized(true);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    await getAlertPoints(
      (points) => {
        const newPoints = points.map(alert => point([alert.long, alert.lat], { id: alert.id }));
        setAllPoints(prev => [...prev, ...newPoints]);
      },
      (error) => { 
        console.error('Error fetching alert points:', error);
      }
    );

    initializeMap();
  }, []);

  useEffect(() => {
    // Check if we have params with lat/lng and focus on that location
    if (initialized && params.lat && params.lng) {
      const reportLat = parseFloat(params.lat);
      const reportLng = parseFloat(params.lng);
      
      // Set the focused report
      setFocusedReport({
        id: params.reportId || 'unknown',
        title: params.title || 'Report Location',
        coordinates: [reportLng, reportLat]
      });
      
      // Create a new feature collection including this point
      const reportPoint = point([reportLng, reportLat], {
        id: params.reportId || 'unknown',
        title: params.title || 'Report Location',
        isFocused: true
      });
      
      // Add this to our collection, avoiding duplicates
      setAllPoints(prev => {
        const filtered = prev.filter(p => 
          p.properties?.id !== reportPoint.properties.id
        );
        return [...filtered, reportPoint];
      });
      
      // Fly to this location
      if (cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: [reportLng, reportLat],
          zoomLevel: 15,
          animationDuration: 2000
        });
      }
    }
  }, [params, initialized]);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setUserLocation([position.coords.longitude, position.coords.latitude]);
    } catch (error) {
      console.error('Error getting user location:', error);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef}
        style={styles.map} 
        zoomEnabled={true} 
        styleURL='mapbox://styles/mapbox/navigation-night-v1'
      >
        <Camera
          ref={cameraRef}
          followUserLocation={!focusedReport}
          followZoomLevel={14}
          centerCoordinate={userLocation}
        />
        
        <LocationPuck 
          puckBearingEnabled 
          puckBearing='heading'
          pulsing={{isEnabled: true, color: '#60A5FA'}}
        />

        <ShapeSource 
          id='alerts' 
          cluster 
          shape={featureCollection(allPoints)}
          onPress={(event) => {
            if (event.features.length > 0) {
              console.log('Feature pressed:', event.features[0].properties);
              
              // If we have coordinates in the feature, fly to them
              const feature = event.features[0];
              if (feature.geometry && feature.geometry.coordinates) {
                cameraRef.current?.setCamera({
                  centerCoordinate: feature.geometry.coordinates,
                  zoomLevel: 15,
                  animationDuration: 1000
                });
              }
            }
          }}
        >
          <SymbolLayer 
            id='cluster-count'
            style={{
              textField: ['get', 'point_count'],
              textSize: 12,
              textColor: '#ffffff',
              textPitchAlignment: 'map',
            }}
          />
          
          <CircleLayer
            id="clusters"
            belowLayerID='cluster-count'
            filter={['has', 'point_count']}
            style={{
              circlePitchAlignment: 'map',
              circleColor: '#FCA5A5',
              circleRadius: 20,
              circleOpacity: 0.7,
              circleStrokeWidth: 2,
              circleStrokeColor: '#EF4444',
            }}
          />
          
          {/* Regular alert pins */}
          <SymbolLayer 
            id='alert-icons'
            filter={['all', 
              ['!', ['has', 'point_count']],
              ['!', ['has', 'isFocused']]
            ]}
            style={{ 
              iconImage: 'alertPin', 
              iconSize: 0.07,
              iconAllowOverlap: true,
              iconAnchor: 'bottom',
            }} 
          />
          
          {/* Focused alert pin (bigger and with different style) */}
          <SymbolLayer 
            id='focused-alert-icon'
            filter={['all', 
              ['!', ['has', 'point_count']],
              ['==', ['get', 'isFocused'], true]
            ]}
            style={{ 
              iconImage: 'alertPin', 
              iconSize: 0.12,  // Bigger size
              iconAllowOverlap: true,
              iconAnchor: 'bottom',
              iconColor: '#2563EB', // Different color
            }} 
          />
          
          <Images 
            images={{ alertPin: alertPin }} 
          />
        </ShapeSource>
      </MapView>
      
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <MaterialIcons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      
      {/* Info panel when focused on a report */}
      {focusedReport && (
        <View style={styles.infoPanel}>
          <View style={styles.infoPanelHeader}>
            <MaterialIcons name="location-on" size={20} color={Colors.danger} />
            <Text style={styles.infoPanelTitle}>{focusedReport.title}</Text>
          </View>
          <Text style={styles.infoPanelCoordinates}>
            {focusedReport.coordinates[1].toFixed(5)}, {focusedReport.coordinates[0].toFixed(5)}
          </Text>
          <TouchableOpacity 
            style={styles.viewDetailsButton}
            onPress={() => router.push(`/report/${focusedReport.id}`)}
          >
            <Text style={styles.viewDetailsText}>View Report Details</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
      
      {/* User location button */}
      <TouchableOpacity 
        style={styles.myLocationButton}
        onPress={() => {
          if (userLocation) {
            cameraRef.current?.setCamera({
              centerCoordinate: userLocation,
              zoomLevel: 14,
              animationDuration: 1000
            });
          }
        }}
      >
        <MaterialIcons name="my-location" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 160,
    right: 20,
    backgroundColor: Colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  infoPanel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  infoPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoPanelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  infoPanelCoordinates: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  viewDetailsText: {
    color: '#fff',
    fontWeight: '500',
    marginRight: 8,
  }
});

export default Map;
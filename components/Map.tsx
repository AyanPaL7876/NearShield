import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapboxGL from "@rnmapbox/maps";
import * as Location from 'expo-location';
import { featureCollection, point } from '@turf/helpers';
import alertPin from '../assets/images/alert.png';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { getAlertPoints } from '../services/alertPointService';

// Initialize Mapbox
MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_API_KEY);

const Map = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const mapRef = useRef<MapboxGL.MapView>(null);
  const cameraRef = useRef<MapboxGL.Camera>(null);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [focusedReport, setFocusedReport] = useState<{
    id: string;
    title: string;
    coordinates: [number, number];
  } | null>(null);
  const [allPoints, setAllPoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        await requestLocationPermission();
        await fetchAlertPoints();
        if (isMounted) {
          setIsMapReady(true);
        }
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
      // Removed the mapRef.current.remove() call that was causing errors
    };
  }, []);

  useEffect(() => {
    if (isMapReady && params.lat && params.lng) {
      handleReportFocus();
    }
  }, [params, isMapReady]);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Location permission denied');
      return;
    }

    const position = await Location.getCurrentPositionAsync({ 
      accuracy: Location.Accuracy.Balanced 
    });
    setUserLocation([position.coords.longitude, position.coords.latitude]);
  };

  const fetchAlertPoints = async () => {
    try {
      await getAlertPoints(
        (points) => {
          const newPoints = points.map(alert => 
            point([alert.long, alert.lat], { 
              id: alert.id,
              title: alert.title || 'Alert' 
            })
          );
          setAllPoints(newPoints);
        },
        (error) => {
          console.error('Error fetching alerts:', error);
        }
      );
    } catch (error) {
      console.error('Failed to fetch alert points:', error);
    }
  };

  const handleReportFocus = () => {
    const reportLat = parseFloat(params.lat as string);
    const reportLng = parseFloat(params.lng as string);
    
    const report = {
      id: params.reportId as string || 'unknown',
      title: params.title as string || 'Report Location',
      coordinates: [reportLng, reportLat] as [number, number]
    };
    
    setFocusedReport(report);
    
    const reportPoint = point([reportLng, reportLat], {
      id: report.id,
      title: report.title,
      isFocused: true
    });
    
    setAllPoints(prev => [
      ...prev.filter(p => p.properties?.id !== report.id),
      reportPoint
    ]);
    
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [reportLng, reportLat],
        zoomLevel: 15,
        animationDuration: 1000
      });
    }
  };

  const handleBackPress = () => router.back();

  const handleLocationPress = () => {
    if (userLocation && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: userLocation,
        zoomLevel: 14,
        animationDuration: 1000
      });
    }
  };

  const handleFeaturePress = (event: any) => {
    if (event.features.length > 0) {
      const feature = event.features[0];
      
      // Get the feature properties
      const { id, title } = feature.properties || {};
      
      // Set focused report
      if (id && feature.geometry?.coordinates) {
        setFocusedReport({
          id,
          title: title || 'Alert',
          coordinates: feature.geometry.coordinates as [number, number]
        });
        
        // Update the point to show it's focused
        const updatedPoints = allPoints.map(point => {
          if (point.properties.id === id) {
            return {
              ...point,
              properties: {
                ...point.properties,
                isFocused: true
              }
            };
          } else {
            return {
              ...point,
              properties: {
                ...point.properties,
                isFocused: false
              }
            };
          }
        });
        
        setAllPoints(updatedPoints);
        
        // Center the camera on the selected point
        if (cameraRef.current) {
          cameraRef.current.setCamera({
            centerCoordinate: feature.geometry.coordinates,
            zoomLevel: 15,
            animationDuration: 1000
          });
        }
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isMapReady && (
        <MapboxGL.MapView
          ref={mapRef}
          style={styles.map}
          styleURL={MapboxGL.StyleURL.Street}  // Light mode map
          onDidFinishLoadingMap={() => setIsMapReady(true)}
        >
          <MapboxGL.Camera
            ref={cameraRef}
            followUserLocation={!focusedReport}
            followZoomLevel={14}
            centerCoordinate={userLocation || [0, 0]}
            defaultSettings={{
              centerCoordinate: userLocation || [0, 0],
              zoomLevel: 14,
            }}
          />

          {userLocation && (
            <MapboxGL.UserLocation
              visible={true}
              animated
              showsUserHeadingIndicator
              renderMode="normal"
            />
          )}

          {/* Removed the custom LineLayer components that were causing errors */}

          {/* Alert points (no clustering) */}
          <MapboxGL.ShapeSource
            id="alerts"
            shape={featureCollection(allPoints)}
            onPress={handleFeaturePress}
            cluster={false}  // Explicitly disable clustering
          >
            <MapboxGL.SymbolLayer
              id="alert-icons"
              filter={['!', ['has', 'isFocused']]}
              style={{
                iconImage: 'alertPin',
                iconSize: 0.07,
                iconAllowOverlap: true,
                iconAnchor: 'bottom',
              }}
            />

            <MapboxGL.SymbolLayer
              id="focused-alert-icon"
              filter={['==', ['get', 'isFocused'], true]}
              style={{
                iconImage: 'alertPin',
                iconSize: 0.12,
                iconAllowOverlap: true,
                iconAnchor: 'bottom',
                iconColor: '#2563EB',
              }}
            />

            <MapboxGL.Images images={{ alertPin }} />
          </MapboxGL.ShapeSource>
        </MapboxGL.MapView>
      )}

      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <MaterialIcons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {userLocation && (
        <TouchableOpacity style={styles.myLocationButton} onPress={handleLocationPress}>
          <MaterialIcons name="my-location" size={24} color="#fff" />
        </TouchableOpacity>
      )}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    zIndex: 10,
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
    zIndex: 10,
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
    zIndex: 10,
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
  },
});

export default Map;
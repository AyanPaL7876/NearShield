import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import MapboxGL, { MapView } from "@rnmapbox/maps";
import * as Location from 'expo-location';
import Mapbox from '@rnmapbox/maps';

const Map = () => {
  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Initialize Mapbox
        Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_API_KEY);
        
        // Request location permissions
        // const { status } = await Location.requestForegroundPermissionsAsync();
        // if (status !== 'granted') {
        //   console.log('Permission to access location was denied');
        //   return;
        // }

        // MapboxGL.setTelemetryEnabled(false);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();
  }, []);

  return (
    // <View style={{ flex: 1 }}>
    //   <Text>Map</Text>
    // </View>
    <MapView style={{flex:1}}/>
  )
}

export default Map
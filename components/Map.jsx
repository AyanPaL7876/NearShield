import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapboxGL, { Camera, LocationPuck, MapView } from "@rnmapbox/maps";
import * as Location from 'expo-location';
import Mapbox from '@rnmapbox/maps';

const Map = () => {
  const [zoom, setZoom] = useState(2); // Start with low zoom level

  useEffect(() => {
    const initializeMap = async () => {
      try {
        Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_API_KEY);

        // Delay zoom animation to ensure map is rendered
        setTimeout(() => {
          setZoom(14); // Target zoom level
        }, 500); // Delay before animation starts
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();
  }, []);

  // styleURL="mapbox://styles/mapbox/standard-satellite"

  return (
    <MapView 
    style={{ flex: 1 }} 
    zoomEnabled={true} 
    styleURL='mapbox://styles/mapbox/navigation-night-v1'>
      <Camera
        followUserLocation
        followZoomLevel={14}
        centerCoordinate
      />
      <LocationPuck 
      puckBearingEnabled puckBearing='heading'
      pulsing={{isEnabled: true, color: '#60A5FA'}}
      />
    </MapView>
  )
}

export default Map;

import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapboxGL, { Camera, LocationPuck, MapView, ShapeSource, SymbolLayer, Images, CircleLayer } from "@rnmapbox/maps";
import * as Location from 'expo-location';
import Mapbox from '@rnmapbox/maps';
import { featureCollection, point } from '@turf/helpers';
import alertPoint from '../data/alertPoint.json';
import alertPin from '../assets/images/alert.png';

const Map = () => {
  const points = alertPoint.map(alert => point([alert.long, alert.lat]));

  useEffect(() => {
    const initializeMap = async () => {
      try {
        Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_API_KEY);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();
  }, []);

  // const scooterFeatures = featureCollection(points);

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

      <ShapeSource 
      id='alerts' 
      cluster 
      shape={featureCollection(points)}
      onPress={(event) => {console.log(JSON.stringify(event, null, 2))}}
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
          id = "clusters"
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
        <SymbolLayer 
        id='alerts-icons'
        filter={['!',['has', 'point_count']]} 
        style={{ 
          iconImage: 'alertPin', 
          iconSize: 0.07,
          iconAllowOverlap: true,
          iconAnchor: 'bottom',
        }} />
        <Images 
        images={{ alertPin: alertPin }} 
        />
        
      </ShapeSource>
    </MapView>
  )
}

export default Map;

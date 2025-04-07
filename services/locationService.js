// locationService.js
// Handles device location services

import * as Location from 'expo-location';
import { Alert } from 'react-native';

// Request location permissions
export const requestLocationPermission = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

// Get current location with formatted address
export const getCurrentLocation = async () => {
  try {
    // Get current position
    let currentLocation = await Location.getCurrentPositionAsync({ 
      accuracy: Location.Accuracy.High 
    });
    
    // Get readable address from coordinates
    let reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude
    });
    
    // Format address for display
    const addressObj = reverseGeocode[0];
    const formattedAddress = [
      addressObj.street,
      addressObj.city,
      addressObj.region,
      addressObj.postalCode
    ].filter(Boolean).join(', ');
    
    return {
      formattedAddress,
      coordinates: {
        lat: currentLocation.coords.latitude,
        long: currentLocation.coords.longitude
      }
    };
  } catch (error) {
    console.error('Location error:', error);
    throw new Error('Failed to get current location');
  }
};
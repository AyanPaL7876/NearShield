import { Platform } from 'react-native';
import { Linking, Alert } from 'react-native';

// Open navigation to a police station
export const navigateToStation = (station) => {
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
export const callStation = (phoneNumber) => {
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
export const openWebsite = (website) => {
    if (!website) {
      Alert.alert('No website available');
      return;
    }
    
    Linking.openURL(website).catch(err => {
      console.error('Error opening website:', err);
      Alert.alert('Website Error', 'Could not open website');
    });
  };
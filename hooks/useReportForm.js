// useReportForm.js
// Custom hook for handling form state and submission

import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { requestLocationPermission, getCurrentLocation } from '../services/locationService';
import { submitReport } from '../services/reportService';
import * as ImagePicker from 'expo-image-picker';

export const useReportForm = (user) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState({ long: null, lat: null });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [incidentType, setIncidentType] = useState('directions-car');

  // Request location permissions on component mount
  useEffect(() => {
    (async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        fetchCurrentLocation();
      } else {
        Alert.alert('Permission needed', 'Location permission is required to report incidents accurately.');
      }
    })();
  }, []);

  // Pick image from library
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setUploadedImage(result.assets[0].uri);
    }
  };

  // Get current location
  const fetchCurrentLocation = async () => {
    try {
      setLoading(true);
      const locationData = await getCurrentLocation();
      setLocation(locationData.formattedAddress);
      setCoordinates(locationData.coordinates);
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location. Please enter it manually.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form fields
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for the incident.');
      return;
    }
    
    if (!description.trim()) {
      Alert.alert('Error', 'Please provide a description of the incident.');
      return;
    }
    
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter or detect a location.');
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare report data
      const reportData = {
        title: title.trim(),
        description: description.trim(),
        time: new Date().toISOString(),
        icon: incidentType,
        user: {
          name: user?.fullName || 'Anonymous',
          avatar: user?.imageUrl || null,
          verified: true
        },
        location: coordinates,
      };
      
      // Submit report with image if available
      const result = await submitReport(reportData, uploadedImage);
      
      // Reset form on success
      setTitle('');
      setDescription('');
      setUploadedImage(null);
      
      Alert.alert(
        'Success',
        'Your incident report has been submitted successfully!',
        [{ text: 'OK' }]
      );
      
      console.log('Report submitted with ID:', result.reportId);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to submit your report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Return all state and handlers
  return {
    title,
    setTitle,
    description,
    setDescription,
    location,
    setLocation,
    coordinates,
    uploadedImage,
    setUploadedImage,
    loading,
    incidentType,
    setIncidentType,
    pickImage,
    fetchCurrentLocation,
    handleSubmit
  };
};
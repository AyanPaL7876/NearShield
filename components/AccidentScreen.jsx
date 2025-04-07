import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { Card, Avatar, Button, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { useUser } from '@clerk/clerk-expo';

const AccidentReportForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

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

  const handleSubmit = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Reset form
      setTitle('');
      setDescription('');
      setLocation('');
      setUploadedImage(null);
      alert('Report submitted successfully!');
    }, 1500);
  };

  const getCurrentLocation = () => {
    setLocation('Current location detected');
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#0052CC', '#0052CC', '#0052CC']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Report an Incident</Text>
        <Text style={styles.headerSubtitle}>Help keep your community safe</Text>
      </LinearGradient>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Incident Type</Text>
            <View style={styles.incidentTypeContainer}>
              <TouchableOpacity style={[styles.incidentType, styles.activeIncidentType]}>
                <Icon name="directions-car" size={24} color="#fff" />
                <Text style={styles.incidentTypeText}>Road</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.incidentType}>
                <Icon name="local-fire-department" size={24} color="#555" />
                <Text style={styles.incidentTypeTextInactive}>Fire</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.incidentType}>
                <Icon name="medical-services" size={24} color="#555" />
                <Text style={styles.incidentTypeTextInactive}>Medical</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.incidentType}>
                <Icon name="public" size={24} color="#555" />
                <Text style={styles.incidentTypeTextInactive}>Other</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a descriptive title"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe what happened in detail"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.locationContainer}>
              <TextInput
                style={[styles.input, styles.locationInput]}
                placeholder="Enter or select location"
                value={location}
                onChangeText={setLocation}
              />
              <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
                <Icon name="my-location" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Photo Evidence</Text>
            {uploadedImage ? (
              <View style={styles.uploadedImageContainer}>
                <Image source={{ uri: uploadedImage }} style={styles.uploadedImage} />
                <TouchableOpacity style={styles.removeImageButton} onPress={() => setUploadedImage(null)}>
                  <Icon name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
                <Icon name="add-a-photo" size={36} color="#4c669f" />
                <Text style={styles.uploadText}>Tap to add photo</Text>
              </TouchableOpacity>
            )}
          </View>

          <Divider style={styles.divider} />

          <View style={styles.userInfoSection}>
            <Avatar.Image size={40} source={{ uri: user.imageUrl }} />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.fullName || 'No Name'}</Text>
              <Text style={styles.userStatus}>Your identity will be shared with officials</Text>
            </View>
          </View>

          <Button
            mode="contained"
            loading={loading}
            onPress={handleSubmit}
            style={styles.submitButton}
            labelStyle={styles.submitButtonText}
          >
            Submit Report
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#f5f5f5',
    paddingButtom: 40,
  },
  header: {
    padding: 24,
    paddingTop: 64,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E0E0E0',
  },
  card: {
    marginTop: -20,
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  incidentTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  incidentType: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    width: '22%',
  },
  activeIncidentType: {
    backgroundColor: Colors.primary,
  },
  incidentTypeText: {
    color: '#fff',
    marginTop: 4,
    fontSize: 12,
  },
  incidentTypeTextInactive: {
    color: '#555',
    marginTop: 4,
    fontSize: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInput: {
    flex: 1,
    marginRight: 8,
  },
  locationButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
  },
  uploadBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: '#4c669f',
    marginTop: 8,
    fontSize: 16,
  },
  uploadedImageContainer: {
    position: 'relative',
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    marginVertical: 16,
  },
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userDetails: {
    marginLeft: 12,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  userStatus: {
    fontSize: 12,
    color: '#777',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AccidentReportForm;
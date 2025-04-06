import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Avatar } from 'react-native-paper';

const AccidentScreen = () => {
  const [uploadedImage, setUploadedImage] = useState(null);

  const report = {
    title: 'Road Accident',
    description: 'Car collision reported near City Mall.',
    time: '2025-03-29T14:00:00Z',
    icon: 'directions-car',
    image: 'https://pbs.twimg.com/media/EEbkSQ_U4AE_IG6?format=jpg&name=large',
    user: {
      name: 'John Smith',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      verified: true,
    },
    likes: 24,
    comments: 8,
    solved: false,
    location: { long: 88.4589, lat: 22.7391 },
  };

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{report.title}</Text>
      <Text style={styles.description}>{report.description}</Text>
      <Text style={styles.time}>{new Date(report.time).toLocaleString()}</Text>
      
      <Image source={{ uri: uploadedImage || report.image }} style={styles.image} />
      <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
        <Icon name="photo-camera" size={24} color="#fff" />
        <Text style={styles.uploadText}>Upload Image</Text>
      </TouchableOpacity>
      
      <View style={styles.userContainer}>
        <Avatar.Image size={50} source={{ uri: report.user.avatar }} />
        <Text style={styles.userName}>{report.user.name} {report.user.verified && '✔️'}</Text>
      </View>
      
      <Text style={styles.stats}>👍 {report.likes}  💬 {report.comments}</Text>
      <Text style={styles.location}>📍 {report.location.lat}, {report.location.long}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  description: { fontSize: 16, color: '#555', marginBottom: 5 },
  time: { fontSize: 14, color: '#999', marginBottom: 10 },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#007AFF', padding: 10, borderRadius: 5, justifyContent: 'center', marginBottom: 10 },
  uploadText: { color: '#fff', marginLeft: 10 },
  userContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  userName: { marginLeft: 10, fontSize: 16, fontWeight: 'bold' },
  stats: { fontSize: 16, color: '#333', marginTop: 10 },
  location: { fontSize: 14, color: '#777', marginTop: 5 },
});

export default AccidentScreen;

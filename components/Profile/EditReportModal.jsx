import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import  db  from '../../configs/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const EditReportModal = ({ visible, onClose, report }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [icon, setIcon] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (report) {
      setTitle(report.title || '');
      setDescription(report.description || '');
      setImage(report.image || null);
      setIcon(report.icon || 'report-problem');
    }
  }, [report]);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) return null;
    
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const storage = getStorage();
    const imageName = `reports/${report.id}/${Date.now()}`;
    const imageRef = ref(storage, imageName);
    
    await uploadBytes(imageRef, blob);
    const downloadUrl = await getDownloadURL(imageRef);
    
    return { url: downloadUrl, path: imageName };
  };

  const handleUpdateReport = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for the report');
      return;
    }

    try {
      setLoading(true);
      const reportRef = doc(db, 'reports', report.id);
      
      let imageData = null;
      // Only upload if the image has changed
      if (image && image !== report.image) {
        imageData = await uploadImage(image);
        
        // Delete old image if it exists
        if (report.imagePath) {
          const storage = getStorage();
          const oldImageRef = ref(storage, report.imagePath);
          try {
            await deleteObject(oldImageRef);
          } catch (error) {
            console.log('Error deleting old image:', error);
          }
        }
      }
      
      await updateDoc(reportRef, {
        title,
        description,
        icon,
        ...(imageData ? { image: imageData.url, imagePath: imageData.path } : {})
      });
      
      setLoading(false);
      onClose(true); // Pass true to indicate successful update
    } catch (error) {
      console.error('Error updating report:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to update report. Please try again.');
    }
  };

  const handleDeleteReport = () => {
    Alert.alert(
      'Delete Report',
      'Are you sure you want to delete this report? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: confirmDelete 
        }
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      const reportRef = doc(db, 'reports', report.id);
      
      // Delete the image from storage if it exists
      if (report.imagePath) {
        const storage = getStorage();
        const imageRef = ref(storage, report.imagePath);
        try {
          await deleteObject(imageRef);
        } catch (error) {
          console.log('Error deleting image:', error);
        }
      }
      
      // Delete the document from Firestore
      await deleteDoc(reportRef);
      
      setDeleteLoading(false);
      onClose(true); // Pass true to indicate successful deletion
    } catch (error) {
      console.error('Error deleting report:', error);
      setDeleteLoading(false);
      Alert.alert('Error', 'Failed to delete report. Please try again.');
    }
  };

  const iconOptions = [
    'report-problem', 'warning', 'error', 'construction',
    'lightbulb', 'local-fire-department', 'coronavirus',
    'public', 'accessibility', 'eco'
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => onClose(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text variant="titleLarge" style={styles.modalTitle}>Edit Report</Text>
            <IconButton
              icon="close"
              size={24}
              onPress={() => onClose(false)}
            />
          </View>
          
          <ScrollView style={styles.modalContent}>
            <TextInput
              label="Report Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              mode="outlined"
            />
            
            <Text style={styles.label}>Select Icon</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.iconSelector}
            >
              {iconOptions.map((iconName) => (
                <TouchableOpacity
                  key={iconName}
                  style={[
                    styles.iconOption,
                    icon === iconName && styles.selectedIconOption
                  ]}
                  onPress={() => setIcon(iconName)}
                >
                  <MaterialIcons
                    name={iconName}
                    size={24}
                    color={icon === iconName ? Colors.primary : '#777'}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={4}
            />
            
            <Text style={styles.label}>Report Image</Text>
            {image ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.reportImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setImage(null)}
                >
                  <MaterialIcons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.imagePicker}
                onPress={handlePickImage}
              >
                <MaterialIcons name="add-photo-alternate" size={36} color="#999" />
                <Text style={styles.imagePickerText}>Add Image</Text>
              </TouchableOpacity>
            )}
            
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleUpdateReport}
                style={styles.updateButton}
                loading={loading}
                disabled={loading || deleteLoading}
              >
                Update Report
              </Button>
              
              <Button
                mode="contained"
                onPress={handleDeleteReport}
                style={styles.deleteButton}
                loading={deleteLoading}
                disabled={loading || deleteLoading}
                icon="delete"
              >
                Delete Report
              </Button>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontWeight: '600',
  },
  modalContent: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#555',
  },
  iconSelector: {
    paddingBottom: 16,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginRight: 12,
  },
  selectedIconOption: {
    backgroundColor: Colors.primaryLight,
  },
  imagePicker: {
    height: 160,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  imagePickerText: {
    marginTop: 8,
    color: '#666',
  },
  imageContainer: {
    marginBottom: 24,
    position: 'relative',
  },
  reportImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  updateButton: {
    marginBottom: 16,
    backgroundColor: Colors.primary,
  },
  deleteButton: {
    backgroundColor: Colors.error,
  },
});

export default EditReportModal;
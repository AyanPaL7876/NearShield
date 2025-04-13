import { Alert } from "react-native";
import {
  collection,
  doc, 
  updateDoc, 
  onSnapshot,
  query ,
  serverTimestamp,
  addDoc
} from "firebase/firestore";
import db from "../configs/firebaseConfig";
import * as Location from 'expo-location'; // For React Native with Expo
import {uploadImageToCloudinary} from "./cloudinaryService"; // Assuming you have a cloudinaryService for image uploads
// If not using Expo, you'd use the react-native-geolocation-service package instead

export const fetchReports = async (onSuccess, onError) => {
  // Get current device location using Expo's Location API
  const getCurrentLocation = async () => {
    try {
      // Request location permissions first
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        throw new Error('Location permission not granted');
      }
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      return {
        lat: location.coords.latitude,
        long: location.coords.longitude
      };
    } catch (error) {
      console.error("Error getting device location:", error);
      throw error;
    }
  };

  // Calculate distance between two coordinates in km using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    return distance;
  };

  let unsubscribe = () => {};
  
  try {
    // First get the current location
    const userLocation = await getCurrentLocation();
    
    // Set up a real-time listener for reports collection
    const q = query(collection(db, "reports"));
    unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allReports = [];
      querySnapshot.forEach((doc) => {
        const report = { id: doc.id, ...doc.data() };
        allReports.push(report);
      });
      
      // Filter reports within 30km of user's location
      const nearbyReports = allReports.filter(report => {
        // Skip reports without location data
        if (!report.location || !report.location.lat || !report.location.long) {
          return false;
        }
        
        const distance = calculateDistance(
          userLocation.lat, 
          userLocation.long, 
          report.location.lat, 
          report.location.long
        );
        return distance <= 30; // Only include reports within 30km
      });
      
      onSuccess(nearbyReports);
    }, (error) => {
      console.error("Error fetching reports:", error);
      Alert.alert("Error", "Failed to load reports. Please try again later.");
      onError(error);
    });
    
  } catch (error) {
    console.error("Error setting up reports listener:", error);
    Alert.alert("Error", "Failed to load reports. Please try again later.");
    onError(error);
  }
  
  // Return the unsubscribe function to clean up the listener when needed
  return unsubscribe;
};

// Function to update report likes
export const updateReportLikes = async (reportId, currentLikes) => {
  try {
    const newLikes = (currentLikes || 0) + 1;
    
    // Update likes in Firebase
    const reportRef = doc(db, "reports", reportId);
    await updateDoc(reportRef, {
      likes: newLikes
    });
    
    return true;
  } catch (error) {
    console.error("Error updating likes:", error);
    Alert.alert("Error", "Failed to update likes. Please try again.");
    return false;
  }
};

// Function to submit solution for a report
export const submitSolution = async (reportId, solution, currentStatus) => {
  if (!solution.trim() || !currentStatus.trim()) {
    Alert.alert(
      "Error",
      "Please fill in both the solution and current status fields."
    );
    return false;
  }

  try {
    // Update in Firebase
    const reportRef = doc(db, "reports", reportId);
    await updateDoc(reportRef, {
      solved: true,
      solution: solution.trim(),
      currentStatus: currentStatus.trim()
    });

    Alert.alert(
      "Marked as Solved",
      "Thank you for providing the solution details for this incident."
    );
    return true;
  } catch (error) {
    console.error("Error submitting solution:", error);
    Alert.alert("Error", "Failed to submit solution. Please try again.");
    return false;
  }
};

// Function to reopen a solved report
export const reopenReport = async (reportId, reportTitle) => {
  try {
    // Update solved status in Firebase
    const reportRef = doc(db, "reports", reportId);
    await updateDoc(reportRef, {
      solved: false
    });
    
    Alert.alert(
      "Reopened",
      `The ${reportTitle} incident has been reopened.`
    );
    return true;
  } catch (error) {
    console.error("Error reopening issue:", error);
    Alert.alert("Error", "Failed to reopen issue. Please try again.");
    return false;
  }
};


export const submitReport = async (reportData, uploadedImage) => {
  try {
    // If there's an image, upload it to Cloudinary first
    let imageUrl = null;
    if (uploadedImage) {
      imageUrl = await uploadImageToCloudinary(uploadedImage);
    }

    // Create report object with all required fields
    const firestoreData = {
      ...reportData,
      image: imageUrl,
      likes: 0,
      comments: 0,
      solved: false,
      solution: null,
      currentStatus: null,
      createdAt: serverTimestamp(),
    };

    // Add document to Firestore and get the reference
    const docRef = await addDoc(collection(db, 'reports'), firestoreData);
    
    return {
      success: true,
      reportId: docRef.id
    };
  } catch (error) {
    console.error('Error submitting report:', error);
    throw error;
  }
};

export const fetchUserReports = (userId) => {
  return new Promise((resolve, reject) => {
    if (!userId) {
      reject(new Error("User ID is required"));
      return;
    }
    
    try {
      // Query reports where userId matches the current user
      const q = query(
        collection(db, "reports"), 
        where("userId", "==", userId),
        orderBy("time", "desc")
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const reportsList = [];
        querySnapshot.forEach((doc) => {
          reportsList.push({ id: doc.id, ...doc.data() });
        });
        resolve(reportsList);
        // Note: We're not unsubscribing here to maintain real-time updates
      }, (error) => {
        console.error("Error fetching user reports:", error);
        reject(error);
      });
      
      // Return the unsubscribe function for optional cleanup
      return unsubscribe;
    } catch (error) {
      console.error("Error setting up user reports listener:", error);
      reject(error);
    }
  });
};

// Add function to create a new report
export const createReport = async (reportData) => {
  try {
    const reportsRef = collection(db, "reports");
    const docRef = await addDoc(reportsRef, {
      ...reportData,
      time: serverTimestamp(),
      likes: 0,
      comments: 0,
      solved: false
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating report:", error);
    throw error;
  }
};

// Add function to update report status
export const updateReportStatus = async (reportId, solved) => {
  try {
    const reportRef = doc(db, "reports", reportId);
    await updateDoc(reportRef, {
      solved: solved,
      solvedAt: solved ? serverTimestamp() : null
    });
    return true;
  } catch (error) {
    console.error("Error updating report status:", error);
    throw error;
  }
};

// Add function to toggle like on a report
export const toggleReportLike = async (reportId, userId, liked) => {
  try {
    const reportRef = doc(db, "reports", reportId);
    const likesRef = collection(db, "reports", reportId, "likes");
    
    const batch = writeBatch(db);
    
    if (liked) {
      // Add user to likes collection
      batch.set(doc(likesRef, userId), {
        userId,
        timestamp: serverTimestamp()
      });
      
      // Increment report likes count
      batch.update(reportRef, {
        likes: increment(1)
      });
    } else {
      // Remove user from likes collection
      batch.delete(doc(likesRef, userId));
      
      // Decrement report likes count
      batch.update(reportRef, {
        likes: increment(-1)
      });
    }
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error("Error toggling report like:", error);
    throw error;
  }
};




// Update an existing report
export const updateReport = async (reportId, data) => {
  try {
    const reportRef = doc(db, "reports", reportId);
    await updateDoc(reportRef, data);
    return true;
  } catch (error) {
    console.error("Error updating report:", error);
    throw error;
  }
};

// Toggle report status (solved/unsolved)
export const toggleReportStatus = async (reportId, currentStatus) => {
  try {
    const reportRef = doc(db, "reports", reportId);
    await updateDoc(reportRef, {
      solved: !currentStatus
    });
    return !currentStatus;
  } catch (error) {
    console.error("Error toggling report status:", error);
    throw error;
  }
};

// Delete a report and its associated image
export const deleteReport = async (reportId, imagePath) => {
  try {
    // First delete the image if it exists
    // if (imagePath) {
    //   // const storage = getStorage();
    //   const imageRef = ref(storage, imagePath);
    //   try {
    //     await deleteObject(imageRef);
    //   } catch (imageError) {
    //     console.log("Error deleting image:", imageError);
    //     // Continue with document deletion even if image deletion fails
    //   }
    // }
    
    // delete alertpoint
    if(reportId.alertpointID){
      await deleteAlertPoint(reportId.alertpointID);
    }

    //delete report from usersreports
    const userReportsRef = collection(db, "users", reportId.userId, "reports");
    const userReportDocRef = doc(userReportsRef, reportId.id);
    await deleteDoc(userReportDocRef);

    // Then delete the document
    const reportRef = doc(db, "reports", reportId);
    await deleteDoc(reportRef);
    return true;
  } catch (error) {
    console.error("Error deleting report:", error);
    throw error;
  }
};

// Upload an image to Firebase Storage
export const uploadReportImage = async (uri, reportId) => {
  if (!uri) return null;
  
  try {
    await uploadImageToCloudinary(uri).then((response) => {
      console.log("Image uploaded successfully:", response.secure_url);
    }
    ).catch((error) => {
      console.error("Error uploading image:", error);
    });
    return { url: downloadUrl, path: imagePath };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
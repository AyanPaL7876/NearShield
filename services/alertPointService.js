import {
  collection,
  doc, 
  onSnapshot,
  query,
  setDoc,
  serverTimestamp
} from "firebase/firestore";
import db from "../configs/firebaseConfig";

export const addAlertPoint = async (long,lat) => {
  try {
    const alertPointRef = doc(collection(db, 'alertPoints'));
    await setDoc(alertPointRef, {
      long: long,
      lat: lat,
      createdAt: serverTimestamp(),
    });
    
    //return the ID of the newly created alert point
    return alertPointRef.id;
  }
  catch (error) {
    console.error('Error adding alert point:', error);
    throw error;
  }
}

export const getAlertPoints = (onSuccess, onError) => {
  try {
    const q = query(collection(db, "alertPoints"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allAlertPoints = [];
      querySnapshot.forEach((doc) => {
        const alertPoint = { id: doc.id, ...doc.data() };
        allAlertPoints.push(alertPoint);
      });
      onSuccess(allAlertPoints);
    }, (error) => {
      console.error("Error fetching alert points:", error);
      Alert.alert("Error", "Failed to load alert points. Please try again later.");
      onError(error);
    });
    
    // Return the unsubscribe function to clean up the listener when needed
    return unsubscribe;
  } catch (error) {
    console.error("Error setting up alert points listener:", error);
    Alert.alert("Error", "Failed to load alert points. Please try again later.");
    onError(error);
  }
}

export const deleteAlertPoint = async (alertPointId) => {
  try {
    const alertPointRef = doc(db, 'alertPoints', alertPointId);
    await deleteDoc(alertPointRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting alert point:', error);
    throw error;
  }
}
import { Alert } from "react-native";
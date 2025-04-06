import { Alert } from "react-native";
import {
  collection,
  doc, 
  updateDoc, 
  onSnapshot,
  query 
} from "firebase/firestore";
import db from "../configs/firebaseConfig";

// Function to fetch reports from Firebase
export const fetchReports = (onSuccess, onError) => {
  try {
    // Set up a real-time listener for reports collection
    const q = query(collection(db, "reports"));
    return onSnapshot(q, (querySnapshot) => {
      const reportsList = [];
      querySnapshot.forEach((doc) => {
        reportsList.push({ id: doc.id, ...doc.data() });
      });
      onSuccess(reportsList);
    }, (error) => {
      console.error("Error fetching reports:", error);
      Alert.alert("Error", "Failed to load reports. Please try again later.");
      onError(error);
    });
  } catch (error) {
    console.error("Error setting up reports listener:", error);
    Alert.alert("Error", "Failed to load reports. Please try again later.");
    onError(error);
    return () => {}; // Return a no-op function if setting up the listener fails
  }
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
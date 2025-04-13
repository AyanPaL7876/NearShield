import {
  doc, 
  updateDoc,
  getDoc,
  arrayUnion,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc
} from "firebase/firestore";
import db from "../configs/firebaseConfig";

/**
 * Adds a report ID to a user's reports array
 * Creates a new document with random ID if no document exists for this user
 * @param {string} userId - The user's ID
 * @param {string} reportId - The report ID to add
 * @returns {Promise<boolean>} - True if successful
 */
export const addReportForUser = async (userId, reportId) => {
  try {
    // First, check if a document exists for this user
    const userReportsRef = collection(db, 'usersreport');
    const q = query(userReportsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Document exists, update it
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        reports: arrayUnion(reportId)
      });
    } else {
      // No document exists, create a new one with random ID
      await addDoc(collection(db, 'usersreport'), {
        userId: userId,
        reports: [reportId]
      });
    }
    return true;
  } catch (error) {
    console.error('Error adding report for user:', error);
    throw error;
  }
}

/**
 * Gets all reports associated with a user
 * @param {string} userId - The user's ID
 * @returns {Promise<Array>} - Array of report data
 */
export const getUserReports = async (userId) => {
  try {
    // Query for documents with matching userId
    const userReportsRef = collection(db, 'usersreport');
    const q = query(userReportsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // User found, get the first matching document
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const reportIds = userData.reports || [];
      
      // Fetch all reports in parallel for better performance
      const reportPromises = reportIds.map(async (reportId) => {
        const reportRef = doc(db, 'reports', reportId);
        const reportSnap = await getDoc(reportRef);
        if (reportSnap.exists()) {
          console.log('Report data:', reportSnap.data());
          return { id: reportId, ...reportSnap.data() };
        }
        return null;
      });
      
      const reportResults = await Promise.all(reportPromises);
      
      // Filter out any null results (reports that don't exist)
      return reportResults.filter(report => report !== null);
    } else {
      console.log('No reports found for this user');
      return [];
    }
  } catch (error) {
    console.error('Error fetching user reports:', error);
    throw error;
  }
}
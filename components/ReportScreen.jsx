import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "../constants/Colors";
import { initializeApp } from "firebase/app";
import {
  collection,
  doc, 
  updateDoc, 
  onSnapshot,
  query 
} from "firebase/firestore";
 import db from "../configs/firebaseConfig"; // Import the Firestore instance

const ReportScreen = () => {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [solution, setSolution] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch reports from Firebase on component mount
  useEffect(() => {
    fetchReports();
  }, []);

  // Function to fetch reports from Firebase
  const fetchReports = async () => {
    try {
      setLoading(true);
      
      // Set up a real-time listener for reports collection
      const q = query(collection(db, "reports"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const reportsList = [];
        querySnapshot.forEach((doc) => {
          reportsList.push({ id: doc.id, ...doc.data() });
        });
        setReports(reportsList);
        setLoading(false);
      });
      
      // Return the unsubscribe function
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching reports:", error);
      Alert.alert("Error", "Failed to load reports. Please try again later.");
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      // Find the report
      const report = reports.find(report => report.id === id);
      const newLikes = (report.likes || 0) + 1;
      
      // Update likes in Firebase
      const reportRef = doc(db, "reports", id);
      await updateDoc(reportRef, {
        likes: newLikes
      });
      
      // Local state is updated by the onSnapshot listener
    } catch (error) {
      console.error("Error updating likes:", error);
      Alert.alert("Error", "Failed to update likes. Please try again.");
    }
  };

  const handleShare = (report) => {
    Alert.alert("Share", `Sharing ${report.title} report`);
  };

  const viewComments = (report) => {
    Alert.alert(
      "Comments",
      `Viewing ${report.comments} comments for ${report.title}`
    );
  };

  const viewUserProfile = (user) => {
    Alert.alert("Profile", `Viewing ${user.name}'s profile`);
  };

  const openSolveModal = (report) => {
    if (report.solved) {
      // If already solved, show the solution details
      Alert.alert(
        "Solution Details",
        `How it was solved:\n${report.solution}\n\nCurrent status:\n${report.currentStatus}`,
        [
          { text: "Close", style: "cancel" },
          {
            text: "Reopen Issue",
            style: "destructive",
            onPress: async () => {
              try {
                // Update solved status in Firebase
                const reportRef = doc(db, "reports", report.id);
                await updateDoc(reportRef, {
                  solved: false
                });
                
                Alert.alert(
                  "Reopened",
                  `The ${report.title} incident has been reopened.`
                );
              } catch (error) {
                console.error("Error reopening issue:", error);
                Alert.alert("Error", "Failed to reopen issue. Please try again.");
              }
            },
          },
        ]
      );
    } else {
      // If not solved, open the modal to add solution details
      setCurrentReport(report);
      setSolution("");
      setCurrentStatus("");
      setModalVisible(true);
    }
  };

  const handleSubmitSolution = async () => {
    if (!solution.trim() || !currentStatus.trim()) {
      Alert.alert(
        "Error",
        "Please fill in both the solution and current status fields."
      );
      return;
    }

    try {
      // Update in Firebase
      const reportRef = doc(db, "reports", currentReport.id);
      await updateDoc(reportRef, {
        solved: true,
        solution: solution.trim(),
        currentStatus: currentStatus.trim()
      });

      setModalVisible(false);
      Alert.alert(
        "Marked as Solved",
        `Thank you for providing the solution details for this ${currentReport.title} incident.`
      );
    } catch (error) {
      console.error("Error submitting solution:", error);
      Alert.alert("Error", "Failed to submit solution. Please try again.");
    }
  };

  const filterReports = (filterType) => {
    setFilter(filterType);
  };

  const getFilteredReports = () => {
    if (filter === "all") return reports;
    if (filter === "verified") {
      return reports.filter((report) => report.user?.verified);
    }
    if (filter === "solved") {
      return reports.filter((report) => report.solved);
    }
    if (filter === "unsolved") {
      return reports.filter((report) => !report.solved);
    }
    return reports;
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Incident Reports</Text>
      <View style={styles.filterButtons}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "all" && styles.activeFilter]}
          onPress={() => filterReports("all")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.activeFilterText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "verified" && styles.activeFilter,
          ]}
          onPress={() => filterReports("verified")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "verified" && styles.activeFilterText,
            ]}
          >
            Verified
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "solved" && styles.activeFilter,
          ]}
          onPress={() => filterReports("solved")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "solved" && styles.activeFilterText,
            ]}
          >
            Solved
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "unsolved" && styles.activeFilter,
          ]}
          onPress={() => filterReports("unsolved")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "unsolved" && styles.activeFilterText,
            ]}
          >
            Unsolved
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSolutionInfo = (item) => {
    if (!item.solved) return null;

    return (
      <View style={styles.solutionContainer}>
        <View style={styles.solutionHeader}>
          <MaterialIcons name="check-circle" size={18} color="#4CAF50" />
          <Text style={styles.solutionTitle}>Solution Details</Text>
        </View>

        <View style={styles.solutionContent}>
          <Text style={styles.solutionLabel}>How it was solved:</Text>
          <Text style={styles.solutionText}>{item.solution}</Text>

          <Text style={styles.solutionLabel}>Current status:</Text>
          <Text style={styles.solutionText}>{item.currentStatus}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header section */}
      {renderHeader()}
      
      {/* Content section with curved top */}
      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading reports...</Text>
          </View>
        ) : reports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="info" size={48} color="#999" />
            <Text style={styles.emptyText}>No reports found</Text>
          </View>
        ) : (
          <FlatList
            data={getFilteredReports()}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.userInfo}>
                  <TouchableOpacity onPress={() => viewUserProfile(item.user)}>
                    <Image
                      source={{ uri: item.user?.avatar }}
                      style={styles.avatar}
                    />
                  </TouchableOpacity>
                  <View style={styles.nameContainer}>
                    <Text style={styles.userName}>{item.user?.name}</Text>
                    {item.user?.verified && (
                      <MaterialIcons
                        name="verified"
                        size={16}
                        color={Colors.primary}
                        style={styles.verifiedIcon}
                      />
                    )}
                  </View>
                  <Text style={styles.cardTime}>{item.time}</Text>
                </View>

                {item.solved && (
                  <View style={styles.solvedBanner}>
                    <MaterialIcons name="check-circle" size={16} color="#fff" />
                    <Text style={styles.solvedText}>SOLVED</Text>
                  </View>
                )}

                <Image source={{ uri: item.image }} style={styles.cardImage} />

                <View style={styles.cardContent}>
                  <View style={styles.titleRow}>
                    <MaterialIcons
                      name={item.icon}
                      size={24}
                      color={Colors.primary}
                    />
                    <Text style={styles.cardTitle}>{item.title}</Text>
                  </View>
                  <Text style={styles.cardDescription}>{item.description}</Text>

                  {renderSolutionInfo(item)}

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleLike(item.id)}
                    >
                      <MaterialIcons
                        name="thumb-up"
                        size={20}
                        color={Colors.primary}
                      />
                      <Text style={styles.actionText}>{item.likes || 0}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => viewComments(item)}
                    >
                      <MaterialIcons
                        name="comment"
                        size={20}
                        color={Colors.primary}
                      />
                      <Text style={styles.actionText}>{item.comments || 0}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleShare(item)}
                    >
                      <MaterialIcons
                        name="share"
                        size={20}
                        color={Colors.primary}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.solveButton,
                        item.solved && styles.solvedButton,
                      ]}
                      onPress={() => openSolveModal(item)}
                    >
                      <MaterialIcons
                        name={item.solved ? "check-circle" : "check-circle-outline"}
                        size={20}
                        color={item.solved ? "#fff" : Colors.primary}
                      />
                      <Text
                        style={[
                          styles.solveButtonText,
                          item.solved && styles.solvedButtonText,
                        ]}
                      >
                        {item.solved ? "View Solution" : "Mark Solved"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        )}

        <TouchableOpacity style={styles.floatingButton}>
          <MaterialIcons name="add" size={28} color="#FFF" />
        </TouchableOpacity>

        {/* Solution Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalOverlay}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Mark as Solved</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <MaterialIcons name="close" size={24} color="#777" />
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={styles.modalScrollView}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.modalSubtitle}>
                  {currentReport ? currentReport.title : ""} Incident
                </Text>

                <Text style={styles.inputLabel}>How was this issue solved?</Text>
                <TextInput
                  style={styles.textInput}
                  multiline
                  numberOfLines={4}
                  placeholder="Describe the steps taken to solve this issue..."
                  value={solution}
                  onChangeText={setSolution}
                />

                <Text style={styles.inputLabel}>What is the current status?</Text>
                <TextInput
                  style={styles.textInput}
                  multiline
                  numberOfLines={3}
                  placeholder="Describe the current situation..."
                  value={currentStatus}
                  onChangeText={setCurrentStatus}
                />

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmitSolution}
                >
                  <MaterialIcons name="check-circle" size={20} color="#fff" />
                  <Text style={styles.submitButtonText}>Submit Solution</Text>
                </TouchableOpacity>
                
                {/* Add extra padding at the bottom to ensure content isn't hidden */}
                <View style={{ height: 20 }} />
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: Colors.primary,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  filterButtons: {
    flexDirection: "row",
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: "#fff",
  },
  filterText: {
    color: "#fff",
    fontWeight: "500",
  },
  activeFilterText: {
    color: Colors.primary,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -10,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontWeight: "600",
    fontSize: 14,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  cardTime: {
    fontSize: 12,
    color: "#777",
  },
  solvedBanner: {
    position: "absolute",
    top: 12,
    right: 0,
    backgroundColor: "#4CAF50",
    paddingVertical: 4,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    zIndex: 1,
  },
  solvedText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 10,
    marginLeft: 4,
  },
  cardImage: {
    width: "100%",
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  cardDescription: {
    color: "#444",
    marginBottom: 12,
  },
  solutionContainer: {
    backgroundColor: "#f0f8ff",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#4CAF50",
  },
  solutionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  solutionTitle: {
    fontWeight: "600",
    marginLeft: 4,
    color: "#333",
  },
  solutionContent: {
    marginLeft: 2,
  },
  solutionLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
    marginBottom: 2,
  },
  solutionText: {
    color: "#333",
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 12,
    padding: 4,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  actionText: {
    marginLeft: 4,
    color: "#555",
  },
  solveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: "auto",
  },
  solveButtonText: {
    color: Colors.primary,
    fontWeight: "500",
    marginLeft: 4,
    fontSize: 12,
  },
  solvedButton: {
    backgroundColor: Colors.primary,
  },
  solvedButtonText: {
    color: "#fff",
  },
  floatingButton: {
    position: "absolute",
    bottom: 80,
    right: 16,
    backgroundColor: Colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalScrollView: {
    padding: 16,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 16,
    color: Colors.primary,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#555",
  },
  textInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#777',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    color: '#777',
    fontSize: 16,
  },
});

export default ReportScreen;
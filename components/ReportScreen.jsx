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
} from "react-native";
import React, { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "../constants/Colors";
import reportData from "../data/report.json";

const ReportScreen = () => {
  const [reports, setReports] = useState(reportData);
  const [filter, setFilter] = useState("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [solution, setSolution] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");

  const handleLike = (id) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === id ? { ...report, likes: report.likes + 1 } : report
      )
    );
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
            onPress: () => {
              setReports((prevReports) =>
                prevReports.map((r) =>
                  r.id === report.id ? { ...r, solved: false } : r
                )
              );
              Alert.alert(
                "Reopened",
                `The ${report.title} incident has been reopened.`
              );
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

  const handleSubmitSolution = () => {
    if (!solution.trim() || !currentStatus.trim()) {
      Alert.alert(
        "Error",
        "Please fill in both the solution and current status fields."
      );
      return;
    }

    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === currentReport.id
          ? {
              ...report,
              solved: true,
              solution: solution.trim(),
              currentStatus: currentStatus.trim(),
            }
          : report
      )
    );

    setModalVisible(false);
    Alert.alert(
      "Marked as Solved",
      `Thank you for providing the solution details for this ${currentReport.title} incident.`
    );
  };

  const filterReports = (filterType) => {
    setFilter(filterType);
  };

  const getFilteredReports = () => {
    if (filter === "all") return reports;
    if (filter === "verified") {
      return reports.filter((report) => report.user.verified);
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
                    source={{ uri: item.user.avatar }}
                    style={styles.avatar}
                  />
                </TouchableOpacity>
                <View style={styles.nameContainer}>
                  <Text style={styles.userName}>{item.user.name}</Text>
                  {item.user.verified && (
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
                    <Text style={styles.actionText}>{item.likes}</Text>
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
                    <Text style={styles.actionText}>{item.comments}</Text>
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
  // Header container styles
  headerContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: Colors.white,
  },
  // Content container with curved top
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    marginTop: -20,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 80, // Add padding for floating button
  },
  filterButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#EFEFEF",
  },
  activeFilter: {
    backgroundColor: Colors.white,
  },
  filterText: {
    color: "#666",
    fontWeight: "500",
  },
  activeFilterText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  solvedBanner: {
    position: "absolute",
    top: 15,
    right: 0,
    backgroundColor: "#4CAF50",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  solvedText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 4,
  },
  cardImage: {
    width: "100%",
    height: 200,
  },
  cardContent: {
    padding: 15,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
    color: Colors.primary,
  },
  cardDescription: {
    fontSize: 14,
    color: "#777",
    marginBottom: 15,
    lineHeight: 20,
  },
  solutionContainer: {
    backgroundColor: "#F1F8E9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: "#4CAF50",
  },
  solutionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  solutionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32",
    marginLeft: 8,
  },
  solutionContent: {
    paddingLeft: 4,
  },
  solutionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginTop: 6,
    marginBottom: 2,
  },
  solutionText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingTop: 12,
    flexWrap: "wrap",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    marginBottom: 8,
  },
  actionText: {
    marginLeft: 5,
    color: "#666",
    fontSize: 14,
  },
  solveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  solvedButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  solveButtonText: {
    marginLeft: 4,
    color: Colors.primary,
    fontWeight: "500",
    fontSize: 14,
  },
  solvedButtonText: {
    color: "#fff",
  },
  cardTime: {
    fontSize: 12,
    color: "#999",
  },
  floatingButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: Colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    maxHeight: "80%",
  },
  modalScrollView: {
    flexGrow: 0,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
    marginBottom: 16,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default ReportScreen;
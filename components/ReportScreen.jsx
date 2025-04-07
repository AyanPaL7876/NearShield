import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from "../constants/Colors";
import { fetchReports } from "../services/reportService";
import NewspaperReport from "./Report/ReportCard";
import ReportHeader from "./Report/ReportHeader";
import SolutionModal from "./Report/SolutionModal";
import EmptyState from "./Report/EmptyState";
import { styles } from "../styles/reportScreenStyles";
import { useUser } from '@clerk/clerk-expo';

const ReportScreen = () => {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [solution, setSolution] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  // Fetch reports from Firebase on component mount
  useEffect(() => {
    const unsubscribeFunction = fetchReports(
      (reportsList) => {
        setReports(reportsList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching reports:", error);
        setLoading(false);
      }
    );

    // Clean up the listener when component unmounts
    return () => {
      if (typeof unsubscribeFunction === "function") {
        unsubscribeFunction();
      }
    };
  }, []);

  const filterReports = (filterType) => {
    setFilter(filterType);
  };

  const handleCategoryFilterChange = (category) => {
    // If clicking on already active category, clear the filter
    setCategoryFilter(categoryFilter === category ? null : category);
  };

  const getFilteredReports = () => {
    let filteredReports = reports;

    // Apply status filters
    if (filter === "solved") {
      filteredReports = filteredReports.filter((report) => report.solved);
    } else if (filter === "unsolved") {
      filteredReports = filteredReports.filter((report) => !report.solved);
    }

    // Apply category filter if set
    if (categoryFilter) {
      filteredReports = filteredReports.filter(
        (report) => report.incidentType === categoryFilter
      );
    }

    // Sort by timestamp, newest first
    return filteredReports.sort((a, b) => {
      // If using Firebase Timestamp objects
      return b.createdAt?.toMillis() - a.createdAt?.toMillis();
      
      // If using regular Date objects or timestamp numbers
      // return b.createdAt - a.createdAt;
    });
  };

  const openSolveModal = (report) => {
    setCurrentReport(report);
    setSolution("");
    setCurrentStatus("");
    setModalVisible(true);
  };

  // Get filtered reports once to use for rendering decisions
  const filteredReports = getFilteredReports();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header section */}
      <ReportHeader
        filter={filter}
        onFilterChange={filterReports}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={handleCategoryFilterChange}
      />

      {/* Content section with curved top */}
      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading reports...</Text>
          </View>
        ) : filteredReports.length === 0 ? (
          <EmptyState 
            message={
              categoryFilter || filter !== "all" 
                ? "No reports match the current filters" 
                : "No reports available"
            }
          />
        ) : (
          <FlatList
            data={filteredReports}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <NewspaperReport report={item} onSolvePress={openSolveModal} currentUser={user}/>
            )}
          />
        )}

        {/* Solution Modal */}
        <SolutionModal
          visible={modalVisible}
          report={currentReport}
          solution={solution}
          currentStatus={currentStatus}
          onChangeSolution={setSolution}
          onChangeStatus={setCurrentStatus}
          onClose={() => setModalVisible(false)}
          onSubmit={() => {
            setModalVisible(false);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ReportScreen;
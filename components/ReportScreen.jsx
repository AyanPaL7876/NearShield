import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Link } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "../constants/Colors";
import { fetchReports } from "../services/reportService";
import ReportCard from "./Report/ReportCard";
import ReportHeader from "./Report/ReportHeader";
import SolutionModal from "./Report/SolutionModal";
import EmptyState from "./Report/EmptyState";
import { styles } from "../styles/reportScreenStyles";

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
    const unsubscribeFunction = fetchReports(
      (reportsList) => {
        setReports(reportsList);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
      }
    );
    
    // Clean up the listener when component unmounts
    return () => {
      if (typeof unsubscribeFunction === 'function') {
        unsubscribeFunction();
      }
    };
  }, []);

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

  const openSolveModal = (report) => {
    setCurrentReport(report);
    setSolution("");
    setCurrentStatus("");
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header section */}
      <ReportHeader filter={filter} onFilterChange={filterReports} />
      
      {/* Content section with curved top */}
      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading reports...</Text>
          </View>
        ) : reports.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={getFilteredReports()}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <ReportCard 
                report={item} 
                onSolvePress={openSolveModal}
              />
            )}
          />
        )}

        <Link href="/screen/uplodeReport" style={styles.floatingButton}>
          <MaterialIcons style={styles.floatingIcon} name="add" size={40} color="#FFF" />
        </Link>

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
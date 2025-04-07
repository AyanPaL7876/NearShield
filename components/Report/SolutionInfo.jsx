import React from "react";
import {
  View,
  Text,
  Platform
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/styles/solutionInfoStyles";

const SolutionInfo = ({ report }) => {
  if (!report.solved) return null;

  // Format date in newspaper style (e.g., "Monday, March 29, 2023")
  const formatNewspaperDate = (dateString) => {
    if (!dateString) return "Date unavailable";
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format time in 12-hour format with AM/PM
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const options = { hour: 'numeric', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };

  return (
    <View style={styles.solutionContainer}>
      <View style={styles.solutionHeader}>
        <MaterialIcons name="check-circle" size={18} color="#fff" />
        <Text style={styles.solutionTitle}>RESOLUTION REPORT</Text>
      </View>

      {/* Headline for important resolutions */}
      {report.isHighPriority && (
        <Text style={styles.headlineStyle}>
          {report.title} Issue Successfully Resolved
        </Text>
      )}

      <View style={styles.solutionContent}>
        <Text style={styles.solutionLabel}>How it was resolved:</Text>
        <Text style={styles.solutionText}>{report.solution}</Text>

        <View style={styles.solutionDivider} />

        <View style={styles.statusContainer}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>RESOLVED</Text>
        </View>
        
        <Text style={styles.solutionLabel}>Current status:</Text>
        <Text style={styles.solutionText}>{report.currentStatus}</Text>

        {/* Add official statement as a newspaper quote if available */}
        {report.officialStatement && (
          <>
            <Text style={styles.solutionLabel}>Official statement:</Text>
            <Text style={styles.solutionQuote}>"{report.officialStatement}"</Text>
          </>
        )}

        {/* Show who resolved the issue */}
        {report.resolvedBy && (
          <Text style={styles.solvedByText}>
            Resolved by {report.resolvedBy}
          </Text>
        )}
      </View>

      {/* Timestamp footer */}
      <View style={styles.timestampRow}>
        <MaterialIcons 
          name="access-time" 
          size={12} 
          color="#777" 
          style={styles.clockIcon} 
        />
        <Text style={styles.timeStampText}>
          Resolved on {formatNewspaperDate(report.resolvedDate)} at {formatTime(report.resolvedDate)}
        </Text>
      </View>
    </View>
  );
};

export default SolutionInfo;
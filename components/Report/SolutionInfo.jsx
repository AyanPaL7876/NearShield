import React from "react";
import {
  View,
  Text,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { styles } from "@/styles/solutionInfoStyles";

const SolutionInfo = ({ report }) => {
  if (!report.solved) return null;

  return (
    <View style={styles.solutionContainer}>
      <View style={styles.solutionHeader}>
        <MaterialIcons name="check-circle" size={18} color="#4CAF50" />
        <Text style={styles.solutionTitle}>Solution Details</Text>
      </View>

      <View style={styles.solutionContent}>
        <Text style={styles.solutionLabel}>How it was solved:</Text>
        <Text style={styles.solutionText}>{report.solution}</Text>

        <Text style={styles.solutionLabel}>Current status:</Text>
        <Text style={styles.solutionText}>{report.currentStatus}</Text>
      </View>
    </View>
  );
};

export default SolutionInfo;
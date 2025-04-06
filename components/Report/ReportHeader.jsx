import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { styles } from "@/styles/reportHeaderStyles";

const ReportHeader = ({ filter, onFilterChange }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Incident Reports</Text>
      <View style={styles.filterButtons}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "all" && styles.activeFilter]}
          onPress={() => onFilterChange("all")}
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
          onPress={() => onFilterChange("verified")}
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
          onPress={() => onFilterChange("solved")}
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
          onPress={() => onFilterChange("unsolved")}
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
};

export default ReportHeader;
import React from "react";
import {
  View,
  Text,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { styles } from "@/styles/emptyStateStyles";

const EmptyState = () => {
  return (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="info" size={48} color="#999" />
      <Text style={styles.emptyText}>No reports found</Text>
    </View>
  );
};

export default EmptyState;
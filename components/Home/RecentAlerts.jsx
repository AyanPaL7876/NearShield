import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { section, sectionTitle } from "../../constants/section";
import { MaterialIcons } from "@expo/vector-icons";

const RecentAlerts = () => {
  return (
    <View style={[section, { paddingVertical: 20 }]}>
      <Text style={sectionTitle}>Recent Alerts</Text>
      <View style={styles.cards}>

      <View style={styles.alertCard}>
        <MaterialIcons name="warning" size={24} color="#FFB347" />
        <View style={styles.alertContent}>
          <Text style={styles.alertTitle}>Flash Flood Warning</Text>
          <Text style={styles.alertDescription}>
            Heavy rainfall expected in your area
          </Text>
        </View>
      </View>
      <View style={styles.alertCard}>
        <MaterialIcons name="error-outline" size={24} color="#FF6347" />
        <View style={styles.alertContent}>
          <Text style={styles.alertTitle}>Power Outage Alert</Text>
          <Text style={styles.alertDescription}>
            Scheduled power maintenance from 2 PM to 6 PM
          </Text>
        </View>
      </View>
    </View>
    </View>
  );
};

export default RecentAlerts;

const styles = StyleSheet.create({
  cards:{
    flexDirection: "column",
    gap: 15,
    marginBottom:75
  },
  alertCard: {
    backgroundColor: "#FFF5E6",
    padding: 15,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  alertContent: {
    marginLeft: 15,
    flex: 1,
  },
  alertTitle: {
    fontSize: 15,
    fontFamily: "outfit-bold",
    color: "#333",
  },
  alertDescription: {
    fontSize: 13,
    fontFamily: "outfit",
    color: "#666",
  },
});

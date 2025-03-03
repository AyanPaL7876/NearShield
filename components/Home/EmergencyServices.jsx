import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { section, sectionTitle } from "../../constants/section";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

const EmergencyCard = ({ icon, title, color, onPress }) => (
  <TouchableOpacity
    style={[styles.emergencyCard, { backgroundColor: color }]}
    onPress={onPress}
  >
    <View style={styles.emergencyIconContainer}>{icon}</View>
    <Text style={styles.emergencyTitle}>{title}</Text>
  </TouchableOpacity>
);

const EmergencyServices = () => {
  return (
    <View style={[section, styles.boxTopRadius]}>
      <Text style={sectionTitle}>Emergency Services</Text>
      <View style={styles.emergencyGrid}>
        <EmergencyCard
          icon={<MaterialIcons name="local-police" size={32} color="white" />}
          title="Police"
          description="Report crime or emergency"
          color="#FF6B6B"
          onPress={() => navigation.navigate("Police")}
        />
        <EmergencyCard
          icon={<FontAwesome5 name="ambulance" size={32} color="white" />}
          title="Ambulance"
          description="Medical emergency"
          color="#4ECDC4"
          onPress={() => navigation.navigate("Ambulance")}
        />
        <EmergencyCard
          icon={<MaterialIcons name="fire-truck" size={32} color="white" />}
          title="Fire"
          description="Fire emergency"
          color="#FFB347"
          onPress={() => navigation.navigate("Fire")}
        />
        <EmergencyCard
          icon={<MaterialIcons name="report" size={32} color="white" />}
          title="Report"
          description="Report an incident"
          color="#845EC2"
          onPress={() => navigation.navigate("Report")}
        />
      </View>
    </View>
  );
};

export default EmergencyServices;

const styles = StyleSheet.create({
  boxTopRadius: {
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  emergencyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  emergencyCard: {
    width: "24%",
    padding: 8,
    borderRadius: 15,
    marginBottom: 8,
    elevation: 5,
    alignItems: "center",
  },
  emergencyIconContainer: {
    marginBottom: 4,
  },
  emergencyTitle: {
    fontSize: 11,
    fontFamily: "outfit-medium",
    color: "white",
    marginBottom: 3,
  }
});

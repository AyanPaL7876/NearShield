import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { section, sectionTitle } from "../../constants/section";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

const EmergencyCard = ({ icon, title, color, onPress }) => (
  <TouchableOpacity
    style={[styles.emergencyCard, { backgroundColor: color }]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.emergencyIconContainer}>{icon}</View>
    <Text style={styles.emergencyTitle}>{title}</Text>
  </TouchableOpacity>
);

const EmergencyServices = ({ navigation }) => {
  return (
    <View style={[section, styles.boxTopRadius]}>
      <Text style={sectionTitle}>Emergency Services</Text>
      <View style={styles.emergencyGrid}>
        <EmergencyCard
          icon={<MaterialIcons name="local-police" size={32} color="white" />}
          title="Police"
          color="#1E3A8A"
          onPress={() => navigation.navigate("Police")}
        />
        <EmergencyCard
          icon={<FontAwesome5 name="ambulance" size={32} color="white" />}
          title="Ambulance"
          color="#E11D48"
          onPress={() => navigation.navigate("Ambulance")}
        />
        <EmergencyCard
          icon={<MaterialIcons name="fire-truck" size={32} color="white" />}
          title="Fire"
          color="#F97316"
          onPress={() => navigation.navigate("Fire")}
        />
        <EmergencyCard
          icon={<MaterialIcons name="report" size={32} color="white" />}
          title="Report"
          color="#6B21A8"
          onPress={() => navigation.navigate("Report")}
        />
        <EmergencyCard
          icon={<FontAwesome5 name="stethoscope" size={32} color="white" />}
          title="Doctor"
          color="#059669"
          onPress={() => navigation.navigate("Doctor")}
        />
        <EmergencyCard
          icon={<FontAwesome5 name="hospital" size={32} color="white" />}
          title="Hospital"
          color="#DC2626FA"
          onPress={() => navigation.navigate("Hospital")}
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
    gap: 10,
    paddingVertical: 10,
  },
  emergencyCard: {
    width: "30%", // Adjusted for better layout
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  emergencyIconContainer: {
    marginBottom: 6,
  },
  emergencyTitle: {
    fontSize: 12,
    fontFamily: "outfit-medium",
    color: "white",
    textAlign: "center",
  },
});

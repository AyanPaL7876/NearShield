// EmergencyServices.js
import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { section, sectionTitle } from "../../constants/section";
import { Link } from "expo-router";
import { MaterialIcons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";

const EmergencyCard = ({ icon, title, color, href, onPress }) => {
  // Use Pressable with onPress if provided, otherwise use Link
  const CardContent = (
    <View style={[styles.emergencyCard, { backgroundColor: color }]}>
      <View style={styles.emergencyIconContainer}>{icon}</View>
      <Text style={styles.emergencyTitle}>{title}</Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable style={styles.link} onPress={onPress}>
        {CardContent}
      </Pressable>
    );
  }

  return (
    <Link href={href} style={styles.link} asChild>
      <Pressable>
        {CardContent}
      </Pressable>
    </Link>
  );
};

const EmergencyServices = ({ openWeatherModal }) => {
  return (
    <View style={[section, styles.boxTopRadius]}>
      <Text style={sectionTitle}>Emergency Services</Text>
      <View style={styles.emergencyGrid}>
        <EmergencyCard
          icon={<MaterialIcons name="local-police" size={32} color="white" />}
          title="Police"
          color="#1E3A8A"
          href="/screen/police"
        />
        <EmergencyCard
          icon={<FontAwesome5 name="hospital" size={32} color="white" />}
          title="Hospital"
          color="#00875A"
          href="/screen/hospital"
        />
        <EmergencyCard
          icon={<MaterialIcons name="local-fire-department" size={32} color="white" />}
          title="Fire"
          color="#DE350B"
          href="/screen/fire"
        />
        <EmergencyCard
          icon={<FontAwesome5 name="ambulance" size={32} color="white" />}
          title="Ambulance"
          color="#FFAB00"
          href="/screen/ambulance"
        />
        <EmergencyCard
          icon={<FontAwesome5 name="stethoscope" size={32} color="white" />}
          title="Doctor"
          color="#614BB9"
          href="/screen/doctor"
        />
        <EmergencyCard
          icon={<MaterialCommunityIcons name="weather-partly-cloudy" size={32} color="white" />}
          title="Weather"
          color="#0096FF"
          onPress={openWeatherModal}
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
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  link: {
    width: "30%",
    marginBottom: 16,
  },
  emergencyCard: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    
    // iOS Shadow
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,

    // Android Shadow
    elevation: 5,
  },
  emergencyIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },
  emergencyTitle: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: "white",
    textAlign: "center",
  },
});

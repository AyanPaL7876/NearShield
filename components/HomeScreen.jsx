import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { Colors } from "../constants/Colors";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
// import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { data } from "../data/temp.json";
import Header from "./Home/header";
import EmergencyServices from "./Home/EmergencyServices";
import DataAnalytics from "./Home/DataAnalytics";
import RecentAlerts from "./Home/RecentAlerts";


const HomeScreen = () => {
  const navigation = useNavigation();

  // Check if user is an authority
  // const isAuthority = true;


  // Hardcoded analytics data
  const analyticsData = {
    incidentsToday: 24,
    emergencyResponses: 18,
    highAlertAreas: 3,
    responseTime: "8.5 min",
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <Header />

      {/* Emergency Services Section */}
      <EmergencyServices />

      {/* Data Analytics Section - Only shown to authorities */}
      {/* {isAuthority && ( */}
      <DataAnalytics />
      {/* )} */}

      {/* Recent Alerts Section */}
      <RecentAlerts />

      {/* Safety Tips Section */}
    
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  analyticsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  analyticsCard: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    width: "30%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  analyticsValue: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: "#333",
    marginVertical: 5,
  },
  analyticsLabel: {
    fontSize: 12,
    fontFamily: "outfit",
    color: "#666",
    textAlign: "center",
  },
  analyticsDashboardButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
  },
  analyticsDashboardContent: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  analyticsTextContainer: {
    flex: 1,
  },
  analyticsDashboardTitle: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    color: "#FFF",
  },
  analyticsDashboardDesc: {
    fontSize: 12,
    fontFamily: "outfit",
    color: "#FFF",
    opacity: 0.8,
  },

  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  avatarContainer: {
    marginTop: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  greeting: {
    fontSize: 15,
    fontFamily: "outfit",
    color: Colors.smallTextColor,
  },
  userName: {
    fontSize: 25,
    fontFamily: "outfit-bold",
    color: Colors.dark.text,
  },
  notificationButton: {
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  section: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  boxTopRadius: {
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    marginBottom: 15,
    color: "#333",
  },
  emergencyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  emergencyCard: {
    width: "22%",
    padding: 8,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 5,
    alignItems: "center",
  },
  emergencyIconContainer: {
    marginBottom: 2,
  },
  emergencyTitle: {
    fontSize: 10,
    fontFamily: "outfit-medium",
    color: "white",
    marginBottom: 3,
  },
  emergencyDescription: {
    fontSize: 13,
    fontFamily: "outfit",
    color: "white",
    opacity: 0.9,
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
    shadowRadius: 4,
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
  viewMoreButton: {
    marginTop: 10,
    alignSelf: "flex-end",
    padding: 8,
  },
  viewMoreText: {
    fontSize: 15,
    fontFamily: "outfit-bold",
    color: "#000",
  },
  tipCard: {
    width: 150,
    marginRight: 15,
    borderRadius: 15,
    overflow: "hidden",
  },
  tipImage: {
    width: "100%",
    height: 100,
    borderRadius: 15,
  },
  tipTitle: {
    fontSize: 15,
    fontFamily: "outfit-medium",
    color: "#333",
    marginTop: 10,
  },
});

export default HomeScreen;

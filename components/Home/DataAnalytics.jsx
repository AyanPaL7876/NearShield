import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
  } from "react-native";
  import React from "react";
  import { Colors } from "../../constants/Colors";
  import { section, sectionTitle } from "../../constants/section";
  import { MaterialIcons } from "@expo/vector-icons";
  import { MaterialCommunityIcons } from "@expo/vector-icons";


const DataAnalytics = () => {

    const analyticsData = {
        incidentsToday: 24,
        emergencyResponses: 18,
        highAlertAreas: 3,
        responseTime: "8.5 min",
      };

  return (
    <View style={section}>
        <Text style={sectionTitle}>Data Analytics</Text>

        {/* Analytics Summary Cards */}
        <View style={styles.analyticsGrid}>
          <View style={styles.analyticsCard}>
            <MaterialIcons
              name="crisis-alert"
              size={24}
              color={Colors.warning}
            />
            <Text style={styles.analyticsValue}>
              {analyticsData.incidentsToday}
            </Text>
            <Text style={styles.analyticsLabel}>Incidents Today</Text>
          </View>

          <View style={styles.analyticsCard}>
            <MaterialIcons
              name="access-time"
              size={24}
              color={Colors.good}
            />
            <Text style={[styles.analyticsValue , {fontSize: 15}]}>
              {analyticsData.responseTime}
            </Text>
            <Text style={styles.analyticsLabel}>Avg Response</Text>
          </View>

          <View style={styles.analyticsCard}>
            <MaterialCommunityIcons
              name="map-marker-alert"
              size={24}
              color={Colors.danger}
            />
            <Text style={styles.analyticsValue}>
              {analyticsData.highAlertAreas}
            </Text>
            <Text style={styles.analyticsLabel}>High Alert Areas</Text>
          </View>
        </View>

        {/* Analytics Dashboard Button */}
        <TouchableOpacity
          style={[styles.analyticsDashboardButton, styles.card]}
          onPress={() => navigation.navigate("AnalyticsDashboard")}
        >
          <View style={styles.analyticsDashboardContent}>
            <View style={styles.analyticsTextContainer}>
              <Text style={styles.analyticsDashboardTitle}>
                Analytics Dashboard
              </Text>
              <Text style={styles.analyticsDashboardDesc}>
                View heatmaps, statistics, and predictive analytics
              </Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={18} color="#000" />
          </View>
        </TouchableOpacity>
      </View>
  )
}

export default DataAnalytics;

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
    card: {
      backgroundColor: "#f8f8f8",
      paddingHorizontal: 10,
      borderRadius: 12,
    //   alignItems: "center",
    //   width: "30%",
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
      color: "#000",
    },
    analyticsDashboardDesc: {
      fontSize: 12,
      fontFamily: "outfit",
      color: "#000",
      opacity: 0.8,
    }
  });
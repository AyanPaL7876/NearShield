import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { section, sectionTitle } from "../../constants/section";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from 'expo-location';

const RecentAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHERMAP_API_KEY; // Replace with your actual API key

  useEffect(() => {
    const getLocationAndAlerts = async () => {
      try {
        // Request location permissions
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLoading(false);
          return;
        }

        // Get current location
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        
        // Fetch weather alerts from OpenWeatherMap using One Call API
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,daily&appid=${API_KEY}`
        );
        
        const data = await response.json();
        
        // Check if there are any alerts
        if (data.alerts && data.alerts.length > 0) {
          setAlerts(data.alerts);
        } else {
          setAlerts([]);
        }
      } catch (error) {
        console.error("Error fetching alerts:", error);
        setErrorMsg("Failed to load alerts");
      } finally {
        setLoading(false);
      }
    };

    getLocationAndAlerts();
  }, []);

  // Helper function to generate appropriate icon for alert type
  const getAlertIcon = (event) => {
    const eventLower = event.toLowerCase();
    
    if (eventLower.includes("flood")) {
      return <MaterialIcons name="water-damage" size={24} color="#4B9BFF" />;
    } else if (eventLower.includes("storm") || eventLower.includes("thunder")) {
      return <MaterialIcons name="flash-on" size={24} color="#FFD700" />;
    } else if (eventLower.includes("rain") || eventLower.includes("precipitation")) {
      return <MaterialIcons name="grain" size={24} color="#4682B4" />;
    } else if (eventLower.includes("wind")) {
      return <MaterialIcons name="air" size={24} color="#87CEEB" />;
    } else if (eventLower.includes("snow") || eventLower.includes("ice")) {
      return <MaterialIcons name="ac-unit" size={24} color="#ADD8E6" />;
    } else if (eventLower.includes("heat")) {
      return <MaterialIcons name="whatshot" size={24} color="#FF4500" />;
    } else if (eventLower.includes("fog") || eventLower.includes("haze")) {
      return <MaterialIcons name="cloud" size={24} color="#708090" />;
    } else {
      return <MaterialIcons name="warning" size={24} color="#FFB347" />;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={[styles.centerContainer,{marginBottom:100}]}>
          <ActivityIndicator size="large" color="#FFB347" />
          <Text style={styles.loadingText}>Loading alerts...</Text>
        </View>
      );
    }

    if (errorMsg) {
      return (
        <View style={styles.alertCard}>
          <MaterialIcons name="error" size={24} color="#FF6347" />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Error</Text>
            <Text style={styles.alertDescription}>{errorMsg}</Text>
          </View>
        </View>
      );
    }

    if (alerts.length === 0) {
      return (
        <View style={[styles.alertCard,{marginBottom:100}]}>
          <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>No Alerts</Text>
            <Text style={styles.alertDescription}>
              No active weather alerts for your location
            </Text>
          </View>
        </View>
      );
    }

    return (
      <>
        {alerts.map((alert, index) => (
          <View key={index} style={styles.alertCard}>
            {getAlertIcon(alert.event)}
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>{alert.event}</Text>
              <Text style={styles.alertDescription}>
                {alert.description ? 
                  (alert.description.length > 100 ? 
                    alert.description.substring(0, 100) + '...' : 
                    alert.description) : 
                  'Weather alert in your area'}
              </Text>
            </View>
          </View>
        ))}
      </>
    );
  };

  return (
    <View style={[section, { paddingVertical: 20 }]}>
      <Text style={sectionTitle}>Recent Alerts</Text>
      <View style={styles.cards}>
        {renderContent()}
      </View>
    </View>
  );
};

export default RecentAlerts;

const styles = StyleSheet.create({
  cards: {
    flexDirection: "column",
    gap: 15,
    marginBottom: 75
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
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: "outfit",
    color: "#666",
  }
});
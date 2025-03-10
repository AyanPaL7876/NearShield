import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Header from "./Home/header";
import EmergencyServices from "./Home/EmergencyServices";
import DataAnalytics from "./Home/DataAnalytics";
import RecentAlerts from "./Home/RecentAlerts";
import Weather from "./Home/Weather";


const HomeScreen = () => {
  const navigation = useNavigation();
  const [weatherModalVisible, setWeatherModalVisible] = useState(false);

  // Check if user is an authority
  // const isAuthority = true;

  const openWeatherModal = () => {
    setWeatherModalVisible(true);
  };

  const closeWeatherModal = () => {
    setWeatherModalVisible(false);
  };

  return (
    <View style={styles.mainContainer}>
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
      </ScrollView>

      {/* Fixed Weather Button */}
      <TouchableOpacity 
        style={styles.floatingWeatherButton}
        onPress={openWeatherModal}
      >
        <MaterialCommunityIcons name="weather-partly-cloudy" size={26} color="white" />
      </TouchableOpacity>

      {/* Weather Modal Popup */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={weatherModalVisible}
        onRequestClose={closeWeatherModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Weather Information</Text>
              <TouchableOpacity onPress={closeWeatherModal}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>
            <Weather />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: 'relative',
  },
  container:{
    flex: 1,
    backgroundColor: Colors.background,
    padding: 0,
  },
  // Floating Weather Button
  floatingWeatherButton: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 999,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    color: '#333',
  },
});

export default HomeScreen;
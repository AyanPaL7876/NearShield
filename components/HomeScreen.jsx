import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Header from "./Home/header";
import EmergencyServices from "./Home/EmergencyServices";
import DataAnalytics from "./Home/DataAnalytics";
import RecentAlerts from "./Home/RecentAlerts";
import Weather from "./Home/Weather";

const HomeScreen = () => {
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

        {/* Emergency Services Section with Weather Modal Functionality */}
        <EmergencyServices openWeatherModal={openWeatherModal} />

        {/* Data Analytics Section - Only shown to authorities */}
        {/* {isAuthority && ( */}
        <DataAnalytics />
        {/* )} */}

        {/* Recent Alerts Section */}
        <RecentAlerts />
      </ScrollView>

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
    backgroundColor: Colors.primary,
    padding: 0,
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
import { View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import PoliceScreen from "../../components/Home/emergencyScreen/police";

const police = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#1E3A8A" }}>
      <StatusBar style="light" backgroundColor="#1E3A8A" translucent={true} />
      <PoliceScreen />
    </View>
  );
};

export default police;

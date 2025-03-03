import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";



const Header = () => {
  const { user } = useUser();
  const navigation = useNavigation();
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <View style={styles.header}>
        <View style={styles.userContainer}>
          <TouchableOpacity
          onPress={() => navigation.navigate("profile")}
          style={styles.avatarContainer}>
            {user?.imageUrl ? (
              <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
            ) : (
              <Ionicons
                name="person-circle"
                size={100}
                color={Colors.PRIMARY}
              />
            )}
          </TouchableOpacity>
          <View style={styles.infoContainer}>
            <Text style={styles.greeting}>{greeting()}</Text>
            <Text style={styles.userName}>{user?.firstName || "User"}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications" size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
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
  }
});
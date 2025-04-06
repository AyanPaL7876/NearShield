import { StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  nameContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  userName: {
    fontWeight: "600",
    fontSize: 16,
    marginRight: 4,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  cardTime: {
    color: "#888",
    fontSize: 12,
  },
  cardImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  solvedBanner: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  solvedText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 4,
  },
  cardContent: {
    padding: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  actionText: {
    marginLeft: 4,
    color: "#666",
  },
  solveButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  solvedButton: {
    backgroundColor: Colors.primary,
  },
  solveButtonText: {
    marginLeft: 4,
    color: Colors.primary,
    fontWeight: "500",
  },
  solvedButtonText: {
    color: "#fff",
  },
});
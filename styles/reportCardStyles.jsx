import { StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9f7f1", // Off-white paper color
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: "#222",
    paddingBottom: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#f1efe9",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#000",
  },
  nameContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  userName: {
    fontWeight: "700",
    fontSize: 14,
    marginRight: 4,
    fontFamily: "serif", // Newspaper-style font
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  cardTime: {
    color: "#444",
    fontSize: 12,
    fontStyle: "italic",
    fontFamily: "serif",
  },
  headline: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "serif",
    marginBottom: 6,
    color: "#000",
    letterSpacing: -0.5,
  },
  cardImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  solvedBanner: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#8B0000", // Dark red for newspaper feel
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 0, // Square corners for newspaper style
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
    transform: [{ rotate: "5deg" }], // Stamp-like tilt
  },
  solvedText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 4,
    fontFamily: "serif",
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
    fontFamily: "serif",
    color: "#000",
  },
  subheader: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#555",
    marginBottom: 12,
    fontFamily: "serif",
  },
  cardDescription: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
    marginBottom: 16,
    fontFamily: "serif",
    textAlign: "justify", // Newspaper text alignment
    columnGap: 16,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  actionText: {
    marginLeft: 4,
    color: "#444",
    fontFamily: "serif",
  },
  solveButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 0, // Square corners for newspaper feel
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#f9f7f1",
  },
  solvedButton: {
    backgroundColor: "#8B0000", // Dark red for newspaper feel
    borderColor: "#8B0000",
  },
  solveButtonText: {
    marginLeft: 4,
    color: "#000",
    fontWeight: "600",
    fontFamily: "serif",
  },
  solvedButtonText: {
    color: "#fff",
  },
  iconWrapper: {
    width: 32,
    height: 32,
    backgroundColor: "#f1efe9",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  categoryLabel: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#222",
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  categoryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "serif",
  },
  metadata: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  metadataText: {
    fontSize: 12,
    color: "#777",
    fontStyle: "italic",
    fontFamily: "serif",
  },
});
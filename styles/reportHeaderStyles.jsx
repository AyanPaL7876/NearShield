import { StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

export const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  filterButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  activeFilter: {
    backgroundColor: "#fff",
  },
  filterText: {
    color: "#fff",
    fontWeight: "500",
  },
  activeFilterText: {
    color: Colors.primary,
  },
});
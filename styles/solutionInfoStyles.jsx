import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  solutionContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
  },
  solutionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  solutionTitle: {
    fontWeight: "600",
    marginLeft: 6,
    color: "#4CAF50",
  },
  solutionContent: {
    marginTop: 4,
  },
  solutionLabel: {
    fontWeight: "500",
    fontSize: 13,
    marginTop: 6,
    marginBottom: 2,
    color: "#666",
  },
  solutionText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
});
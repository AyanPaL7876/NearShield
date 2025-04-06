import React from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { submitSolution } from "@/services/reportService";
import { styles } from "@/styles/solutionModalStyles";

const SolutionModal = ({
  visible,
  report,
  solution,
  currentStatus,
  onChangeSolution,
  onChangeStatus,
  onClose,
  onSubmit,
}) => {
  const handleSubmitSolution = async () => {
    if (!report) return;
    
    const success = await submitSolution(
      report.id,
      solution,
      currentStatus
    );
    
    if (success) {
      onSubmit();
    }
  };

  if (!report) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Mark as Solved</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#777" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.modalScrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.modalSubtitle}>
              {report.title} Incident
            </Text>

            <Text style={styles.inputLabel}>How was this issue solved?</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              placeholder="Describe the steps taken to solve this issue..."
              value={solution}
              onChangeText={onChangeSolution}
            />

            <Text style={styles.inputLabel}>What is the current status?</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={3}
              placeholder="Describe the current situation..."
              value={currentStatus}
              onChangeText={onChangeStatus}
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitSolution}
            >
              <MaterialIcons name="check-circle" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Submit Solution</Text>
            </TouchableOpacity>
            
            {/* Add extra padding at the bottom to ensure content isn't hidden */}
            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default SolutionModal;
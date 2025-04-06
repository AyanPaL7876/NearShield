import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
import { updateReportLikes, reopenReport } from "@/services/reportService";
import SolutionInfo from "./SolutionInfo";
import { styles } from "@/styles/reportCardStyles";

const ReportCard = ({ report, onSolvePress }) => {
  const handleLike = async (id) => {
    await updateReportLikes(id, report.likes);
  };

  const handleShare = (report) => {
    Alert.alert("Share", `Sharing ${report.title} report`);
  };

  const viewComments = (report) => {
    Alert.alert(
      "Comments",
      `Viewing ${report.comments} comments for ${report.title}`
    );
  };

  const viewUserProfile = (user) => {
    Alert.alert("Profile", `Viewing ${user.name}'s profile`);
  };

  const openSolveModal = () => {
    if (report.solved) {
      // If already solved, show the solution details
      Alert.alert(
        "Solution Details",
        `How it was solved:\n${report.solution}\n\nCurrent status:\n${report.currentStatus}`,
        [
          { text: "Close", style: "cancel" },
          {
            text: "Reopen Issue",
            style: "destructive",
            onPress: async () => {
              await reopenReport(report.id, report.title);
            },
          },
        ]
      );
    } else {
      // If not solved, open the modal to add solution details
      onSolvePress(report);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.userInfo}>
        <TouchableOpacity onPress={() => viewUserProfile(report.user)}>
          <Image
            source={{ uri: report.user?.avatar }}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <View style={styles.nameContainer}>
          <Text style={styles.userName}>{report.user?.name}</Text>
          {report.user?.verified && (
            <MaterialIcons
              name="verified"
              size={16}
              color={Colors.primary}
              style={styles.verifiedIcon}
            />
          )}
        </View>
        <Text style={styles.cardTime}>{report.time}</Text>
      </View>

      {report.solved && (
        <View style={styles.solvedBanner}>
          <MaterialIcons name="check-circle" size={16} color="#fff" />
          <Text style={styles.solvedText}>SOLVED</Text>
        </View>
      )}

      <Image source={{ uri: report.image }} style={styles.cardImage} />

      <View style={styles.cardContent}>
        <View style={styles.titleRow}>
          <MaterialIcons
            name={report.icon}
            size={24}
            color={Colors.primary}
          />
          <Text style={styles.cardTitle}>{report.title}</Text>
        </View>
        <Text style={styles.cardDescription}>{report.description}</Text>

        <SolutionInfo report={report} />

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleLike(report.id)}
          >
            <MaterialIcons
              name="thumb-up"
              size={20}
              color={Colors.primary}
            />
            <Text style={styles.actionText}>{report.likes || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => viewComments(report)}
          >
            <MaterialIcons
              name="comment"
              size={20}
              color={Colors.primary}
            />
            <Text style={styles.actionText}>{report.comments || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleShare(report)}
          >
            <MaterialIcons
              name="share"
              size={20}
              color={Colors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.solveButton,
              report.solved && styles.solvedButton,
            ]}
            onPress={openSolveModal}
          >
            <MaterialIcons
              name={report.solved ? "check-circle" : "check-circle-outline"}
              size={20}
              color={report.solved ? "#fff" : Colors.primary}
            />
            <Text
              style={[
                styles.solveButtonText,
                report.solved && styles.solvedButtonText,
              ]}
            >
              {report.solved ? "View Solution" : "Mark Solved"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ReportCard;
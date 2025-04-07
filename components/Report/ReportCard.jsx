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
import { styles } from "@/styles/reportCardStyles"; // Using the styles we just created

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

  // Helper function to get the icon label based on icon name
  const getIconLabel = (iconName) => {
    const labels = {
      'directions-car': 'Road',
      'local-fire-department': 'Fire',
      'medical-services': 'Medical',
      'local-gas-station': 'Gas Leak',
      'local-bar': 'Drunk', 
      'flash-on': 'Electric',
      'warning': 'Hazard',
      'waves': 'Flood',
      'construction': 'Road Work',
      'local-police': 'Crime',
      'public': 'Public'
    };
    return labels[iconName] || 'Incident';
  };

  const formattedDate = new Date(report.time).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <View style={styles.card}>
      {/* Category Label */}
      <View style={styles.categoryLabel}>
        <Text style={styles.categoryText}>{getIconLabel(report.icon)}</Text>
      </View>
      
      {/* Header/Headline */}
      <View style={styles.header}>
        <Text style={styles.headline}>{report.title}</Text>
        <View style={styles.metadata}>
          <Text style={styles.metadataText}>Filed on {formattedDate}</Text>
          <Text style={styles.metadataText}>
            {report.comments || 0} comments • {report.likes || 0} likes
          </Text>
        </View>
      </View>

      {/* Author info */}
      <View style={styles.userInfo}>
        <TouchableOpacity onPress={() => viewUserProfile(report.user)}>
          <Image
            source={{ uri: report.user?.avatar }}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <View style={styles.nameContainer}>
          <Text style={styles.userName}>By {report.user?.name}</Text>
          {report.user?.verified && (
            <MaterialIcons
              name="verified"
              size={16}
              color={Colors.primary}
              style={styles.verifiedIcon}
            />
          )}
        </View>
      </View>

      {report.solved && (
        <View style={styles.solvedBanner}>
          <MaterialIcons name="check-circle" size={16} color="#fff" />
          <Text style={styles.solvedText}>RESOLVED</Text>
        </View>
      )}

      {/* Main Image */}
      <Image source={{ uri: report.image }} style={styles.cardImage} />

      {/* Content */}
      <View style={styles.cardContent}>
        <Text style={styles.subheader}>Incident Report</Text>
        <Text style={styles.cardDescription}>{report.description}</Text>

        <SolutionInfo report={report} />

        {/* Action buttons styled as newspaper interaction elements */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleLike(report.id)}
          >
            <View style={styles.iconWrapper}>
              <MaterialIcons
                name="thumb-up"
                size={18}
                color="#444"
              />
            </View>
            <Text style={styles.actionText}>{report.likes || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => viewComments(report)}
          >
            <View style={styles.iconWrapper}>
              <MaterialIcons
                name="comment"
                size={18}
                color="#444"
              />
            </View>
            <Text style={styles.actionText}>{report.comments || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleShare(report)}
          >
            <View style={styles.iconWrapper}>
              <MaterialIcons
                name="share"
                size={18}
                color="#444"
              />
            </View>
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
              size={18}
              color={report.solved ? "#fff" : "#000"}
            />
            <Text
              style={[
                styles.solveButtonText,
                report.solved && styles.solvedButtonText,
              ]}
            >
              {report.solved ? "View Resolution" : "Mark Resolved"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ReportCard;
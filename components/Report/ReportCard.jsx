import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Linking,
  Platform,
  Share
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import db from "@/configs/firebaseConfig";
import { Colors } from "@/constants/Colors";
import { styles } from "@/styles/reportCardStyles";
import CommentScreen from "@/components/CommentScreen"; // Adjust path as needed

const NewspaperReport = ({ report, onSolvePress, currentUser }) => {
  const [showFullImage, setShowFullImage] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentCount, setCommentCount] = useState(report.comments?.length || 0);

  // Update comment count after adding a new comment
  useEffect(() => {
    if (!showCommentsModal && report.id) {
      // Refresh comment count when modal closes
      const fetchCommentCount = async () => {
        try {
          const reportRef = doc(db, 'reports', report.id);
          const reportSnap = await getDoc(reportRef);
          
          if (reportSnap.exists()) {
            const reportData = reportSnap.data();
            const comments = reportData.comments || [];
            setCommentCount(comments.length);
          }
        } catch (error) {
          console.error("Error fetching comment count:", error);
        }
      };
      
      fetchCommentCount();
    }
  }, [showCommentsModal, report.id]);

  // Format date in newspaper style (e.g., "Monday, March 29, 2023")
  const formatNewspaperDate = (dateString) => {
    if (!dateString) return "Date unavailable";
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format time in 12-hour format with AM/PM
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const options = { hour: 'numeric', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };

  // Get category label from icon name
  const getCategoryLabel = (iconName) => {
    const labels = {
      'directions-car': 'Road Incident',
      'local-fire-department': 'Fire Alert',
      'medical-services': 'Medical Emergency',
      'local-gas-station': 'Gas Leak',
      'local-bar': 'Public Disturbance', 
      'flash-on': 'Power Outage',
      'warning': 'Hazard',
      'waves': 'Flood',
      'construction': 'Road Work',
      'local-police': 'Crime',
      'public': 'Public Notice'
    };
    return labels[iconName] || 'Incident Report';
  };

  const handleShare = async () => {
    try {
      // Create a newspaper-style share message
      const shareMessage = `
📰 *${report.title}* 📰
${formatNewspaperDate(report.time)} - ${formatTime(report.time)}

${report.description}.

📍 Location: ${report.address || formatCoordinates()}

#CommunityAlert #LocalNews
      `;

      await Share.share({
        message: shareMessage,
        title: `${report.title} - Community Alert`,
      });
    } catch (error) {
      console.error("Error sharing", error);
    }
  };

  const openInGoogleMaps = () => {
    if (report.location?.lat && report.location?.long) {
      const { lat, long } = report.location;
      const label = encodeURIComponent(report.title);
      const url = Platform.select({
        ios: `maps:0,0?q=${label}@${lat},${long}`,
        android: `geo:0,0?q=${lat},${long}(${label})`,
        default: `https://maps.google.com/maps?q=${lat},${long}`
      });

      Linking.openURL(url).catch(() => {
        Linking.openURL(`https://maps.google.com/maps?q=${lat},${long}`);
      });
    }
  };

  const formatCoordinates = () => {
    if (!report.location) return "Location not specified";
    return `${report.location.lat.toFixed(5)}, ${report.location.long.toFixed(5)}`;
  };

  // Render article header
  const renderArticleHeader = () => (
    <View style={styles.articleHeader}>
      <View style={styles.categoryContainer}>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{getCategoryLabel(report.icon).toUpperCase()}</Text>
        </View>
        {report.solved && (
          <View style={styles.solvedBadge}>
            <MaterialIcons name="check-circle" size={14} color="#fff" />
            <Text style={styles.solvedText}>RESOLVED</Text>
          </View>
        )}
      </View>
      <Text style={styles.headline}>{report.title}</Text>
      <View style={styles.byline}>
        <Text style={styles.bylineText}>By </Text>
        <Text style={styles.authorName}>{report.user?.name || "Community Correspondent"}</Text>
        <Text style={styles.bylineDate}> • {formatNewspaperDate(report.time)}</Text>
      </View>
    </View>
  );

  // Render lead image section
  const renderLeadImage = () => (
    report.image ? (
      <TouchableOpacity 
        style={styles.imageContainer}
        onPress={() => setShowFullImage(true)}
      >
        <Image 
          source={{ uri: report.image }} 
          style={styles.leadImage} 
        />
        <Text style={styles.imageCaption}>
          {report.imageCaption || `Photo of the incident at ${report.address || formatCoordinates()}`}
        </Text>
      </TouchableOpacity>
    ) : null
  );

  // Render article body
  const renderArticleBody = () => {
    // Split description into paragraphs for better newspaper formatting
    const descriptionParts = (report.description || "No details available").split('.');
    const leadSentence = descriptionParts[0] + (descriptionParts.length > 1 ? '.' : '');
    const remainingText = descriptionParts.slice(1).join('.').trim();
    
    return (
      <View style={styles.articleBody}>
        <Text style={styles.dropCap}>
          {leadSentence.charAt(0)}
          <Text style={styles.leadParagraph}>
            {leadSentence.substring(1)}
          </Text>
        </Text>
        
        {remainingText ? (
          <Text style={styles.bodyText}>{remainingText}</Text>
        ) : null}
      </View>
    );
  };

  // Render solution details if report is solved
  const renderSolutionBox = () => (
    report.solved ? (
      <View style={styles.solutionBox}>
        <View style={styles.solutionBoxHeader}>
          <MaterialIcons name="check-circle" size={16} color="#fff" />
          <Text style={styles.solutionBoxTitle}>RESOLUTION REPORT</Text>
        </View>
        <View style={styles.solutionContent}>
          <Text style={styles.solutionSubtitle}>How it was resolved:</Text>
          <Text style={styles.solutionText}>{report.solution || "No details provided"}</Text>
          
          <Text style={styles.solutionSubtitle}>Current status:</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusIndicator} />
            <Text style={styles.solutionText}>{report.currentStatus || "No status update available"}</Text>
          </View>
          
          <Text style={styles.solutionTimestamp}>
            Resolved on {formatNewspaperDate(report.resolvedDate)} at {formatTime(report.resolvedDate)}
          </Text>
        </View>
      </View>
    ) : null
  );

  // Render compact action buttons
  const renderCompactActionBar = () => (
    <View style={styles.compactActionBar}>
      <TouchableOpacity 
        style={styles.compactButton}
        onPress={() => setShowCommentsModal(true)}
      >
        <MaterialIcons name="comment" size={18} color={Colors.primary} />
        <Text style={styles.compactButtonText}>
          {commentCount > 0 ? `${commentCount}` : ""}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.compactButton}
        onPress={handleShare}
      >
        <MaterialIcons name="share" size={18} color={Colors.primary} />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.compactButton}
        onPress={openInGoogleMaps}
      >
        <MaterialIcons name="location-on" size={18} color={Colors.primary} />
      </TouchableOpacity>
      
      {!report.solved && (
        <TouchableOpacity 
          style={styles.compactResolveButton}
          onPress={() => onSolvePress(report)}
        >
          <MaterialIcons name="check-circle" size={18} color="#fff" />
          <Text style={styles.compactResolveText}>RESOLVE</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Render full image modal
  const renderImageModal = () => (
    <Modal
      visible={showFullImage}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowFullImage(false)}
    >
      <TouchableOpacity 
        style={styles.modalBackdrop}
        activeOpacity={1}
        onPress={() => setShowFullImage(false)}
      >
        <Image 
          source={{ uri: report.image }} 
          style={styles.fullImage}
          resizeMode="contain"
        />
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => setShowFullImage(false)}
        >
          <MaterialIcons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  // Main render
  return (
    <ScrollView style={styles.container}>
      {renderArticleHeader()}
      {renderLeadImage()}
      {renderArticleBody()}
      {renderSolutionBox()}
      {renderCompactActionBar()}
      {renderImageModal()}
      
      {/* Comments Modal */}
      <CommentScreen
        visible={showCommentsModal}
        onClose={() => setShowCommentsModal(false)}
        reportId={report.id}
        currentUser={currentUser}
      />
    </ScrollView>
  );
};

export default NewspaperReport;
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Linking,
  Platform,
  Share
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const NewspaperReport = ({ report, onSolvePress, currentUser }) => {
  const [showFullImage, setShowFullImage] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f7f0',
  },
  masthead: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    alignItems: 'center',
  },
  newspaperName: {
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 26,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  divider: {
    height: 2,
    backgroundColor: '#000',
    width: '100%',
    marginVertical: 6,
  },
  tagline: {
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  editionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  editionDate: {
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 12,
  },
  editionVolume: {
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 12,
  },
  articleHeader: {
    padding: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTag: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  categoryText: {
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 12,
    fontWeight: 'bold',
  },
  solvedBadge: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  solvedText: {
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  headline: {
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 30,
  },
  byline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bylineText: {
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 14,
    fontStyle: 'italic',
  },
  authorName: {
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bylineDate: {
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 14,
    color: '#666',
  },
  imageContainer: {
    margin: 16,
    marginTop: 0,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  leadImage: {
    width: '100%',
    height: 220,
    backgroundColor: '#f0f0f0',
  },
  imageCaption: {
    padding: 8,
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
  },
  articleBody: {
    padding: 16,
  },
  dropCap: {
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 36,
    fontWeight: 'bold',
    lineHeight: 36,
  },
  leadParagraph: {
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 16,
    lineHeight: 24,
  },
  bodyText: {
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
  },
  infoBox: {
    margin: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden',
  },
  infoBoxHeader: {
    backgroundColor: Colors.primary,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoBoxTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoBoxContent: {
    padding: 12,
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 14,
    lineHeight: 20,
  },
  infoBoxButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  infoBoxButtonText: {
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  solutionBox: {
    margin: 16,
    marginTop: 0,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 4,
    overflow: 'hidden',
  },
  solutionBoxHeader: {
    backgroundColor: '#4CAF50',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  solutionBoxTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  solutionContent: {
    padding: 12,
  },
  solutionSubtitle: {
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  solutionText: {
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  solutionTimestamp: {
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666',
    marginTop: 8,
    textAlign: 'right',
  },
  // New compact action bar
  compactActionBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#f5f5f5',
  },
  compactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    flexDirection: 'row',
  },
  compactButtonText: {
    fontSize: 12,
    color: Colors.primary,
    marginLeft: 2,
  },
  compactResolveButton: {
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginLeft: 8,
    justifyContent: 'center',
  },
  compactResolveText: {
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '70%',
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NewspaperReport;
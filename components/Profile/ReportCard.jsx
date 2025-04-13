import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Card, Divider, Chip } from 'react-native-paper';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { formatDate } from './dateUtils';
import EditReportModal from './EditReportModal';
import { toggleReportStatus } from '../../services/reportService';

const ReportCard = ({ report, onEdit, onView, onDelete, onUpdate }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleEditComplete = (success) => {
    setEditModalVisible(false);
    if (success && onUpdate) {
      onUpdate();
    }
  };

  const handleToggleStatus = async () => {
    if (isUpdatingStatus) return;
    
    try {
      setIsUpdatingStatus(true);
      await toggleReportStatus(report.id, report.solved);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <>
      <Card 
        style={styles.reportCard}
        elevation={2}
      >
        <View style={styles.reportHeader}>
          <View style={styles.reportTitleContainer}>
            <MaterialIcons 
              name={report.icon || "report-problem"} 
              size={24} 
              color={Colors.primary} 
              style={styles.reportIcon} 
            />
            <Text variant="titleMedium" style={styles.reportTitle}>
              {report.title}
            </Text>
          </View>
          <TouchableOpacity onPress={handleToggleStatus} disabled={isUpdatingStatus}>
            <Chip 
              style={[
                styles.statusChip, 
                report.solved ? styles.solvedChip : styles.unsolvedChip
              ]}
              textStyle={report.solved ? styles.solvedChipText : styles.unsolvedChipText}
            >
              {report.solved ? 'Solved' : 'Unsolved'}
            </Chip>
          </TouchableOpacity>
        </View>
        
        <Divider style={styles.reportDivider} />
        
        {report.image && (
          <TouchableOpacity 
            onPress={onView}
            activeOpacity={0.9}
          >
            <Image 
              source={{ uri: report.image }} 
              style={styles.reportImage} 
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        
        <Text 
          style={styles.reportDescription}
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          {report.description}
        </Text>
        
        <View style={styles.reportFooter}>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setEditModalVisible(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={18} color={Colors.secondary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.iconButton, styles.deleteButton]}
              onPress={() => onDelete && onDelete(report)}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={18} color={Colors.error} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.reportDate}>
            {formatDate(
              report.time instanceof Date ? report.time : 
              report.time?.seconds ? new Date(report.time.seconds * 1000) : report.time
            )}
          </Text>
        </View>
      </Card>
      
      <EditReportModal 
        visible={editModalVisible}
        onClose={handleEditComplete}
        report={report}
      />
    </>
  );
};

const styles = StyleSheet.create({
  reportCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  reportTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reportIcon: {
    marginRight: 8,
  },
  reportTitle: {
    fontWeight: '600',
    flex: 1,
  },
  statusChip: {
    height: 28,
  },
  solvedChip: {
    backgroundColor: Colors.successLight,
  },
  solvedChipText: {
    color: Colors.success,
  },
  unsolvedChip: {
    backgroundColor: Colors.warningLight,
  },
  unsolvedChipText: {
    color: Colors.warning,
  },
  reportDivider: {
    marginVertical: 0,
  },
  reportImage: {
    width: '100%',
    height: 180,
  },
  reportDescription: {
    padding: 16,
    color: '#555',
  },
  reportFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deleteButton: {
    backgroundColor: '#ffecec',
  },
  reportDate: {
    fontSize: 12,
    color: '#888',
  },
});

export default ReportCard;